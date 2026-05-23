# Community News Board Backend

## What this project does

Community News Board is a Spring Boot backend that lets users create and view community posts with optional images. It provides a minimal auth flow (register/login), stores posts and users, and supports image uploads with presigned URLs plus background thumbnail resizing.

## Services used

- Spring Boot REST API
- AWS DynamoDB for `NewsPosts` and `Users`
- AWS S3 for storing original images and thumbnails
- AWS SQS for enqueueing image resize jobs
- AWS Lambda (in `lambda/`) for processing resize jobs from SQS

## Architecture in short

1. Client requests a presigned upload URL.
2. Client uploads the image directly to S3 using the presigned URL.
3. Client creates a post referencing the uploaded image key.
4. Backend writes the post to DynamoDB and sends a resize event to SQS.
5. Lambda consumes the SQS event, creates a thumbnail, and writes it back to S3.

## OpenAPI and endpoint testing

The OpenAPI spec is here: `src/main/resources/openapi.yaml`. It documents every endpoint, request body, and response example. The server base URL is `http://localhost:8080`.

### Option A: Swagger Editor (quickest)

1. Open https://editor.swagger.io/.
2. File -> Import File -> select `src/main/resources/openapi.yaml`.
3. Change the server URL if your API runs elsewhere.
4. Use the right-side "Try it out" buttons to execute calls.

### Option B: Postman

1. Open Postman.
2. Import -> File -> `src/main/resources/openapi.yaml`.
3. A collection will be created with all endpoints.
4. Set the base URL to your running backend instance.
5. Use the example bodies from the spec to run each request.

## Endpoints and test flow

The OpenAPI file already contains example payloads. A typical test flow is:

1. `POST /api/auth/register`
2. `POST /api/auth/login`
3. `POST /api/uploads/presign`
4. Upload the file to S3 using the returned `url` and `method` (usually `PUT`).
5. `POST /api/posts` with `imageKey` returned from presign.
6. `GET /api/posts` to confirm the post appears with image URLs.
7. (Optional) `POST /api/uploads/presign-get` to generate a temporary download URL.

## Related docs

- Lambda implementation and setup: `lambda/README.md`
- API contract: `src/main/resources/openapi.yaml`
