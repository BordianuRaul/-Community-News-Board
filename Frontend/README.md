# Community News Board - Frontend

Modern React frontend for the Community News Board backend.

## Prerequisites
- Node.js 18+ recommended
- Backend running on http://localhost:8080

## Setup
```bash
npm install
```

## Run (dev)
```bash
npm run dev
```

## Build
```bash
npm run build
```

## Environment
The frontend reads the backend base URL from `.env`:
```
VITE_API_BASE_URL=http://localhost:8080
```

## Notes
- Image upload uses presigned S3 URLs. The backend stores object keys, not public URLs.
- Thumbnails are generated asynchronously. Placeholders appear until a thumbnail is ready.
