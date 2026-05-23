# Deployment Guide

This guide uses AWS CLI. Commands are in PowerShell.

## 1) Prerequisites
- AWS CLI installed and configured (`aws configure`).
- S3 bucket exists: `community-news-poze-2026` (or update `S3_BUCKET`).
- DynamoDB table exists: `NewsPosts` (or update `DYNAMODB_TABLE`).
- SQS queue exists: `ImageResizeTaskQueue`.

## 2) Build the Lambda package

```powershell
Set-Location "C:\Users\bordi\Desktop\master\An I sem II\GCC\-Community-News-Board\Backend\lambda"
Remove-Item -Recurse -Force python -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path python | Out-Null
pip install -r requirements.txt -t python
Copy-Item lambda_function.py -Destination python
Set-Location python
Compress-Archive -Path * -DestinationPath ..\lambda_deployment.zip -Force
```

## 3) Create IAM role (one time)

```powershell
$accountId = aws sts get-caller-identity --query Account --output text

aws iam create-role --role-name ImageResizeRole --assume-role-policy-document '{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {"Service": "lambda.amazonaws.com"},
      "Action": "sts:AssumeRole"
    }
  ]
}'

aws iam attach-role-policy --role-name ImageResizeRole --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess
aws iam attach-role-policy --role-name ImageResizeRole --policy-arn arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess
aws iam attach-role-policy --role-name ImageResizeRole --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaSQSQueueExecutionRole
```

## 4) Create the Lambda function

```powershell
$accountId = aws sts get-caller-identity --query Account --output text

aws lambda create-function `
  --function-name ImageResizeWorker `
  --runtime python3.11 `
  --role arn:aws:iam::$accountId:role/ImageResizeRole `
  --handler lambda_function.lambda_handler `
  --zip-file fileb://lambda_deployment.zip `
  --timeout 60 `
  --memory-size 512 `
  --environment Variables={S3_BUCKET=community-news-poze-2026,DYNAMODB_TABLE=NewsPosts,THUMBNAIL_SIZE=128,THUMBNAIL_PREFIX=thumbnails/}
```

## 5) Connect SQS to Lambda

```powershell
$accountId = aws sts get-caller-identity --query Account --output text

aws lambda create-event-source-mapping `
  --event-source-arn arn:aws:sqs:eu-north-1:$accountId:ImageResizeTaskQueue `
  --function-name ImageResizeWorker `
  --batch-size 10
```

## 6) Verify

```powershell
aws lambda get-function --function-name ImageResizeWorker
aws lambda list-event-source-mappings --function-name ImageResizeWorker
aws logs tail /aws/lambda/ImageResizeWorker --follow
```

