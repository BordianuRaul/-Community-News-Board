# Lambda Image Resize Worker

This folder contains a small AWS Lambda function that resizes images to 128px thumbnails and updates DynamoDB.

## Files
- `lambda_function.py`: Lambda handler and resize logic.
- `requirements.txt`: Python dependencies.
- `test_resize.py`: Small local test for the resize function.

## Local Test (no AWS required)

```powershell
Set-Location "C:\Users\bordi\Desktop\master\An I sem II\GCC\-Community-News-Board\Backend\lambda"
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python test_resize.py
```

## Build Deployment Package

```powershell
Set-Location "C:\Users\bordi\Desktop\master\An I sem II\GCC\-Community-News-Board\Backend\lambda"
Remove-Item -Recurse -Force python -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path python | Out-Null
pip install -r requirements.txt -t python
Copy-Item lambda_function.py -Destination python
Set-Location python
Compress-Archive -Path * -DestinationPath ..\lambda_deployment.zip -Force
```

## Deploy (manual)

Use the steps in `DEPLOYMENT_GUIDE.md` to create the IAM role, Lambda function, and SQS trigger.

