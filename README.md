# Community News Board

Community News Board is a full-stack app where users register/login, post community updates with images, and browse a paginated feed. The frontend is React (Vite), and the backend is Spring Boot with AWS-backed storage and image processing.

## What the app does

- **Auth:** simple register/login to capture a username (no tokens).
- **Posts:** create and list posts (newest first).
- **Images:** upload via S3 presigned URLs; thumbnails are generated asynchronously.

## AWS services (what each does)

| Service | Role in this app |
| --- | --- |
| **S3** | Stores original uploads and generated thumbnails. |
| **DynamoDB** | Stores users and posts metadata. |
| **SQS** | Queues image resize jobs after a post is created. |
| **Lambda** | Consumes SQS jobs, creates thumbnails, and updates DynamoDB. |

## Local setup (short)

### Software needed

- **Java 21** + **Maven** (backend)
- **Node.js 18+** + **npm** (frontend)
- **Python 3.11** + **pip** (optional: Lambda local tests)
- **AWS credentials** configured (backend talks to AWS directly)

### Run backend (Spring Boot)

```powershell
Set-Location "C:\Users\bordi\Desktop\master\An I sem II\GCC\-Community-News-Board\Backend"
mvn spring-boot:run
```

The API runs on `http://localhost:8080` and uses AWS SDK default credentials. OpenAPI spec: `Backend\src\main\resources\openapi.yaml`.

### Run frontend (React + Vite)

```powershell
Set-Location "C:\Users\bordi\Desktop\master\An I sem II\GCC\-Community-News-Board\Frontend"
npm install
npm run dev
```

Set the backend URL in `Frontend\.env`:
```
VITE_API_BASE_URL=http://localhost:8080
```

### Optional: Lambda local resize test

```powershell
Set-Location "C:\Users\bordi\Desktop\master\An I sem II\GCC\-Community-News-Board\Backend\lambda"
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python test_resize.py
```

## Notes

- Image uploads use **presigned S3 URLs**; the backend stores S3 object keys.
- Thumbnails are generated asynchronously by Lambda, so the feed may show placeholders briefly.