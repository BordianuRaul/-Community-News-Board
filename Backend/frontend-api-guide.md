# Frontend API Guide (React)

This document summarizes the backend endpoints and the UI flows needed to build the React frontend for the Community News Board.

## Base URL

`http://localhost:8080`

All endpoints are CORS-enabled for `*`.

## Data Models

### RegisterRequest
```json
{ "username": "alice", "password": "secret123" }
```

### LoginRequest
```json
{ "username": "alice", "password": "secret123" }
```

### AuthResponse
```json
{
  "userId": "uuid",
  "username": "alice",
  "createdAt": "2026-05-24T00:30:00Z",
  "message": "registered|logged-in"
}
```

### CreatePostRequest
```json
{
  "headline": "Campus cleanup this weekend",
  "body": "Join us for a community cleanup on Saturday.",
  "imageKey": "uploads/uuid-filename.jpg"
}
```

### Post
```json
{
  "postId": "uuid",
  "timestamp": "2026-05-24T00:25:00Z",
  "headline": "Campus cleanup this weekend",
  "body": "Join us for a community cleanup on Saturday.",
  "originalImageUrl": "uploads/uuid-filename.jpg",
  "thumbnailImageUrl": "thumbnails/uuid-filename.jpg"
}
```

### PresignRequest
```json
{ "filename": "cleanup.jpg", "contentType": "image/jpeg" }
```

### PresignGetRequest
```json
{ "key": "uploads/uuid-filename.jpg" }
```

### PresignResponse
```json
{
  "url": "https://...presigned...",
  "key": "uploads/uuid-filename.jpg",
  "method": "PUT|GET"
}
```

## Endpoints

### Auth
1. `POST /api/auth/register`
   - **Body:** RegisterRequest
   - **201:** AuthResponse
   - **Errors:** `400` for missing/short password, `409` if username exists

2. `POST /api/auth/login`
   - **Body:** LoginRequest
   - **200:** AuthResponse
   - **Errors:** `400` for missing fields, `401` for invalid credentials

> There are **no auth tokens** or sessions returned. Use the AuthResponse to display the username in the UI.

### Posts
1. `GET /api/posts`
   - **200:** `Post[]` (newest first)
   - Backend returns **all** posts. Implement client-side pagination/infinite scroll.

2. `POST /api/posts`
   - **Body:** CreatePostRequest
   - **201:** Post
   - **Required fields:** `headline`, `body`, `imageKey`

> Note: The OpenAPI example shows `imageKey` as optional, but the service enforces it. Always provide it.

### Uploads (S3 presigned URLs)
1. `POST /api/uploads/presign`
   - **Body:** PresignRequest
   - **201:** PresignResponse (method = `PUT`)

2. `POST /api/uploads/presign-get`
   - **Body:** PresignGetRequest
   - **201:** PresignResponse (method = `GET`)

## Image Flow (Important)

The backend stores **S3 object keys** in `originalImageUrl` and `thumbnailImageUrl`, not public URLs. To display images:

1. Call `POST /api/uploads/presign` with `{ filename, contentType }`.
2. Use the returned `url` + `method` to **upload the file directly to S3**.
3. Create the post with `imageKey = response.key`.
4. To display images, call `POST /api/uploads/presign-get` with `{ key }` and use the returned `url`.

Thumbnail generation is **async** (SQS + Lambda). After creating a post, `thumbnailImageUrl` may be `null` or missing until the background job updates it. If it’s missing, show a placeholder and retry later.

## Required UI Screens & Flows

### 1. Register / Login Screen
- **Fields:** username, password.
- **Actions:**
  - Register: `POST /api/auth/register`
  - Login: `POST /api/auth/login`
- **State:** store `username` (and optionally `userId`) in client state or localStorage.
- **Navigation:** on success, go to **Main Screen**.

### 2. Main Screen (Posts Feed)
- **Header section:** shows `username` from auth response.
- **Posts list:** `GET /api/posts` on load.
  - Implement client-side pagination (e.g., 10–20 per page) and infinite scroll.
  - For each post, request a presigned GET URL for `thumbnailImageUrl` (or `originalImageUrl` if thumbnail missing).
- **Create Post button:** navigates to **Create Post Screen**.

### 3. Create Post Screen
- **Fields:** headline, body, image file.
- **Flow:**
  1. `POST /api/uploads/presign` with file name + content type.
  2. Upload file to S3 using the returned URL/method.
  3. `POST /api/posts` with `{ headline, body, imageKey }`.
  4. Navigate back to **Main Screen** and refresh the list.

## Notes for React Implementation

- Use a single API client with the base URL.
- Use optimistic UI cautiously: posts are created immediately, but thumbnails may lag.
- All endpoints are public; no auth headers are required.
