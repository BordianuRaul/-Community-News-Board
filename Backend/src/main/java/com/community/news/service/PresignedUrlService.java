package com.community.news.service;

import com.community.news.dto.PresignRequest;
import com.community.news.dto.PresignResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.time.Duration;
import java.util.UUID;

@Service
public class PresignedUrlService {

    private final S3Presigner s3Presigner;

    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;

    public PresignedUrlService(S3Presigner s3Presigner) {
        this.s3Presigner = s3Presigner;
    }

    public PresignResponse createUploadUrl(PresignRequest request) {
        if (request == null || request.getFilename() == null || request.getFilename().isBlank()) {
            throw new IllegalArgumentException("filename is required");
        }

        String safeName = request.getFilename().replace("\\", "/");
        String key = "uploads/" + UUID.randomUUID() + "-" + safeName.substring(safeName.lastIndexOf('/') + 1);

        PutObjectRequest.Builder putObjectBuilder = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key);

        if (request.getContentType() != null && !request.getContentType().isBlank()) {
            putObjectBuilder.contentType(request.getContentType());
        }

        PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(10))
                .putObjectRequest(putObjectBuilder.build())
                .build();

        String url = s3Presigner.presignPutObject(presignRequest).url().toString();
        return new PresignResponse(url, key, "PUT");
    }

    public PresignResponse createDownloadUrl(String key) {
        if (key == null || key.isBlank()) {
            throw new IllegalArgumentException("key is required");
        }

        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();

        GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(10))
                .getObjectRequest(getObjectRequest)
                .build();

        String url = s3Presigner.presignGetObject(presignRequest).url().toString();
        return new PresignResponse(url, key, "GET");
    }
}
