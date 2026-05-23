"""AWS Lambda image resize worker.

Flow:
- Triggered by SQS messages containing postId and originalImageKey.
- Downloads original image from S3.
- Resizes to a 128px thumbnail.
- Uploads thumbnail to S3 under thumbnails/.
- Updates DynamoDB with thumbnailImageUrl.
"""

import json
import logging
import os
from io import BytesIO

import boto3
from boto3.dynamodb.conditions import Attr
from PIL import Image, ImageOps

logger = logging.getLogger()
logger.setLevel(logging.INFO)

s3_client = boto3.client("s3")
dynamodb = boto3.resource("dynamodb")

BUCKET_NAME = os.environ.get("S3_BUCKET", "community-news-poze-2026")
TABLE_NAME = os.environ.get("DYNAMODB_TABLE", "NewsPosts")
THUMBNAIL_SIZE = int(os.environ.get("THUMBNAIL_SIZE", "128"))
THUMBNAIL_PREFIX = os.environ.get("THUMBNAIL_PREFIX", "thumbnails/")


def _thumbnail_key(original_key: str) -> str:
    base_name = os.path.basename(original_key)
    name_no_ext = os.path.splitext(base_name)[0]
    return f"{THUMBNAIL_PREFIX}{name_no_ext}.jpg"


def resize_image(image_bytes: bytes) -> bytes:
    """Resize image to THUMBNAIL_SIZE preserving aspect ratio. Returns JPEG bytes."""
    img = Image.open(BytesIO(image_bytes))
    img = ImageOps.exif_transpose(img)

    if img.mode in ("RGBA", "LA", "P"):
        rgb_img = Image.new("RGB", img.size, (255, 255, 255))
        mask = img.split()[-1] if img.mode == "RGBA" else None
        rgb_img.paste(img, mask=mask)
        img = rgb_img

    img.thumbnail((THUMBNAIL_SIZE, THUMBNAIL_SIZE), Image.Resampling.LANCZOS)

    output = BytesIO()
    img.save(output, format="JPEG", quality=85, optimize=True)
    output.seek(0)
    return output.getvalue()


def _update_post_thumbnail(table, post_id: str, thumbnail_key: str, timestamp: str | None) -> None:
    if timestamp:
        table.update_item(
            Key={"postId": post_id, "timestamp": timestamp},
            UpdateExpression="SET thumbnailImageUrl = :url",
            ExpressionAttributeValues={":url": thumbnail_key},
        )
        return

    # Fallback: scan for the item if timestamp was not provided.
    response = table.scan(FilterExpression=Attr("postId").eq(post_id), Limit=1)
    items = response.get("Items", [])
    if not items:
        raise RuntimeError(f"Post not found for postId={post_id}")

    item = items[0]
    table.update_item(
        Key={"postId": item["postId"], "timestamp": item["timestamp"]},
        UpdateExpression="SET thumbnailImageUrl = :url",
        ExpressionAttributeValues={":url": thumbnail_key},
    )


def lambda_handler(event, context):
    logger.info("Received event with %s record(s)", len(event.get("Records", [])))

    table = dynamodb.Table(TABLE_NAME)

    for record in event.get("Records", []):
        try:
            message_body = json.loads(record.get("body", "{}"))
            post_id = message_body.get("postId")
            original_image_key = message_body.get("originalImageKey")
            timestamp = message_body.get("timestamp")

            if not post_id or not original_image_key:
                logger.warning("Missing postId or originalImageKey: %s", message_body)
                continue

            logger.info("Processing postId=%s key=%s", post_id, original_image_key)

            response = s3_client.get_object(Bucket=BUCKET_NAME, Key=original_image_key)
            original_image_bytes = response["Body"].read()

            thumbnail_bytes = resize_image(original_image_bytes)
            thumbnail_key = _thumbnail_key(original_image_key)

            s3_client.put_object(
                Bucket=BUCKET_NAME,
                Key=thumbnail_key,
                Body=thumbnail_bytes,
                ContentType="image/jpeg",
                CacheControl="max-age=31536000",
            )

            _update_post_thumbnail(table, post_id, thumbnail_key, timestamp)
            logger.info("Updated postId=%s with thumbnail=%s", post_id, thumbnail_key)

        except Exception as exc:
            logger.exception("Failed to process record: %s", exc)
            continue

    return {"statusCode": 200, "body": json.dumps("OK")}

