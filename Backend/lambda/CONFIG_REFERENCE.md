# Configuration Reference

## Environment Variables
Set these in the Lambda configuration:

```
S3_BUCKET=gcc-community-news-2026
DYNAMODB_TABLE=NewsPosts
THUMBNAIL_SIZE=128
THUMBNAIL_PREFIX=thumbnails/
```

## Expected SQS Message Format

```json
{
  "postId": "550e8400-e29b-41d4-a716-446655440000",
  "originalImageKey": "images/uuid.png",
  "timestamp": "2026-05-23T12:34:56Z"
}
```

Notes:
- `timestamp` is optional. If missing, the Lambda scans DynamoDB to find the item.
- For best performance, include `timestamp` in the message and avoid scans.

## DynamoDB Keys
The table uses:
- Partition key: `postId`
- Sort key: `timestamp`
