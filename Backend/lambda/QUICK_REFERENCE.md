# Quick Reference

## Local test

```powershell
Set-Location "C:\Users\bordi\Desktop\master\An I sem II\GCC\-Community-News-Board\Backend\lambda"
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python test_resize.py
```

## Check Lambda logs

```powershell
aws logs tail /aws/lambda/ImageResizeWorker --follow
```

## Send a test SQS message

```powershell
$accountId = aws sts get-caller-identity --query Account --output text
$queueUrl = "https://sqs.eu-north-1.amazonaws.com/$accountId/ImageResizeTaskQueue"

aws sqs send-message `
  --queue-url $queueUrl `
  --message-body '{"postId":"test-123","originalImageKey":"images/test.png"}'
```

## Update Lambda code (after edits)

```powershell
Set-Location "C:\Users\bordi\Desktop\master\An I sem II\GCC\-Community-News-Board\Backend\lambda"
Copy-Item lambda_function.py -Destination python -Force
Set-Location python
Compress-Archive -Path * -DestinationPath ..\lambda_deployment.zip -Force
Set-Location ..
aws lambda update-function-code --function-name ImageResizeWorker --zip-file fileb://lambda_deployment.zip
```

