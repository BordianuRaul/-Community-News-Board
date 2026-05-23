# Community News Board Backend

## Auth API (simple)

This adds a minimal username/password flow without JWT or sessions. It is meant to support a basic login/register UI.

### Endpoints

- `POST /api/auth/register`
  - Body:
    ```json
    {
      "username": "alice",
      "password": "secret123"
    }
    ```
  - Response:
    ```json
    {
      "userId": "uuid",
      "username": "alice",
      "createdAt": "2026-05-23T12:00:00Z",
      "message": "registered"
    }
    ```

- `POST /api/auth/login`
  - Body:
    ```json
    {
      "username": "alice",
      "password": "secret123"
    }
    ```
  - Response:
    ```json
    {
      "userId": "uuid",
      "username": "alice",
      "createdAt": "2026-05-23T12:00:00Z",
      "message": "logged-in"
    }
    ```

## DynamoDB Tables

- `NewsPosts` (already used by posts)
- `Users` (new, partition key: `username`)

## Local Test

```powershell
Set-Location "C:\Users\bordi\Desktop\master\An I sem II\GCC\-Community-News-Board\Backend"
./mvnw test
```

