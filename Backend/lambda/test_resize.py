"""Minimal local test for resize_image.

Run:
  python test_resize.py
"""

from io import BytesIO

from PIL import Image

from lambda_function import resize_image


def main() -> None:
    img = Image.new("RGB", (256, 200), (10, 120, 200))
    buffer = BytesIO()
    img.save(buffer, format="PNG")
    buffer.seek(0)

    resized_bytes = resize_image(buffer.getvalue())
    resized_img = Image.open(BytesIO(resized_bytes))

    width, height = resized_img.size
    assert width <= 128 and height <= 128, f"Unexpected size: {resized_img.size}"

    print(f"OK: resized to {resized_img.size}")


if __name__ == "__main__":
    main()

