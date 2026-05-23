# Implementation Tasks

This document tracks the step-by-step progress of the backend implementation.

## 🎯 Phase 1: Project Initialization
- [ ] Update `pom.xml` with Spring Boot Starter Web, Lombok, and AWS SDK V2 (S3, DynamoDB, SQS).
- [ ] Create basic Spring Boot application entry point (`Main.java` or `Application.java`).
- [ ] Setup `application.yml` with basic AWS connection placeholders.

## ☁️ Phase 2: AWS Configuration
- [x] Create `AwsConfig.java` to configure beans for `S3Client`, `DynamoDbClient`, and `SqsClient`.

## 📦 Phase 3: Domain & Data Layer (DynamoDB)
- [x] Define `Post` domain model (id, headline, body, timestamp, originalImageUrl, thumbnailImageUrl).
- [x] Implement `PostRepository` using `DynamoDbClient` to save and retrieve paginated posts.

## 🪣 Phase 4: Storage Layer (S3)
- [x] Implement `S3Service` to handle uploading `MultipartFile` and returning S3 URLs.

## ✉️ Phase 5: Messaging Layer (SQS)
- [x] Define `ImageResizeEvent` DTO.
- [x] Implement `SqsProducer` to send the DTO to the SQS queue.

## 🚀 Phase 6: Web Layer
- [x] Create `PostService` to orchestrate saving to DB, uploading to S3, and sending to SQS.
- [x] Create `PostController` to expose `POST /api/posts` and `GET /api/posts`.

## 🐳 Phase 7: Local Development Environment
- [ ] Create a `docker-compose.yml` containing LocalStack.
- [ ] Add an init script to create the S3 buckets, DynamoDB tables, and SQS queues in LocalStack upon startup.

