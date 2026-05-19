# Community News Board - Backend Plan & Design

## 1. Overview
The **Community News Board** is a public web application where users can post short news articles comprising a cover image, headline, and body text.
This document outlines the design and plan for the Spring Boot backend integrating with multiple AWS services to achieve this.

## 2. Architecture & AWS Services

### AWS Components
1. **Amazon S3**:
   - Stores original full-size cover images.
   - Stores processed thumbnail images (128px max dimension).
2. **Amazon DynamoDB**:
   - Table `NewsPosts` storing post metadata.
   - Primary Key: `postId` (UUID) or `partition_key: type="POST", sort_key: timestamp` (for reverse chronological sorting).
   - Attributes: `postId`, `headline`, `body`, `timestamp`, `originalImageUrl`, `thumbnailImageUrl`.
3. **Amazon SQS**:
   - Queue: `ImageResizeTaskQueue`.
   - Used to decouple image processing. The backend sends a message here once a new post with a full-size image is successfully saved.
4. **AWS Lambda (Serverless Worker)**:
   - Triggered by SQS.
   - Downloads original image from S3, resizes to a 128px thumbnail, uploads to S3, and updates the `thumbnailImageUrl` in DynamoDB.

### Backend Application (Spring Boot)
- **Framework**: Spring Boot (Java 21)
- **AWS SDK**: AWS SDK for Java v2 (S3, DynamoDB, SQS)
- **Pattern**: RESTful API + layered architecture (Controllers, Services, Repositories).

## 3. Data Flow

### POST: Creating a New Article
1. Frontend sends a `POST /api/posts` request with `MultipartFile` (image), `headline`, and `body`.
   *(Alternative: Frontend requests a presigned URL, uploads to S3 directly, and then POSTs metadata to the Backend. For simplicity in V1, Backend handles `MultipartFile`).*
2. **Backend**:
   - Uploads image to S3 (Originals prefix/bucket).
   - Saves initial post record in DynamoDB (with `originalImageUrl` set, but `thumbnailImageUrl` empty/null).
   - Secures the new `postId` and pushes a message to SQS containing `{ "postId": "...", "originalImageKey": "..." }`.
3. Backend immediately returns `201 Created` with the post metadata.

### GET: Listing Articles
1. Frontend requests `GET /api/posts` (optionally with a pagination cursor).
2. **Backend**:
   - Queries DynamoDB using an index to retrieve posts sorted descending by `timestamp`.
   - Returns a JSON array of posts.
   - If `thumbnailImageUrl` is still null (Lambda hasn't finished), frontend can gracefully show a loading placeholder.

## 4. REST API Contract

- `GET /api/posts`
  - Returns paginated posts, ordered newest to oldest.
- `GET /api/posts/{postId}`
  - Returns a specific post with its full details.
- `POST /api/posts`
  - Consumes: `multipart/form-data`
  - Payload: `headline`, `body`, `image`
  - Returns: `201 Created`

## 5. Development Steps

1. **Project Setup**:
   - Add Spring Web, Spring Boot DevTools, AWS SDK v2 (`dynamodb`, `s3`, `sqs`), and Lombok to `pom.xml`.
2. **AWS Configuration**:
   - Setup `AwsCredentialsProvider` and client beans (`DynamoDbClient`, `S3Client`, `SqsClient`).
3. **Data Layer**:
   - Create the `Post` model.
   - Create `DynamoDbRepository` with `save` and `findAllSorted` methods.
4. **Storage Layer**:
   - Implement `S3Service` for `uploadFile()`.
5. **Messaging Layer**:
   - Implement `SqsProducer` to send messages formatted as JSON to SQS.
6. **Controllers & Service Stitching**:
   - Create `PostController` linking file upload, database save, and queue push.
7. **Infrastructure / Testing**:
   - Use Testcontainers / LocalStack to test the AWS integration locally without incurring costs or needing immediate AWS credentials.
