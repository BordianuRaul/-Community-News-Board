package com.community.news.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;

@Service
public class FileStorageService {

    private final S3Client s3Client;

    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;

    public FileStorageService(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    public void save(MultipartFile file) throws IOException {
        System.out.println("DEBUG: Intru în metoda save...");
        System.out.println("DEBUG: Numele bucket-ului configurat este: " + bucketName);

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(file.getOriginalFilename())
                .build();

        System.out.println("DEBUG: Trimit cererea către AWS S3...");
        
        try {
            s3Client.putObject(putObjectRequest, 
                    RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
            System.out.println("DEBUG: Operațiunea putObject s-a terminat cu succes!");
        } catch (Exception e) {
            System.out.println("DEBUG: EROARE în timpul execuției putObject!");
            e.printStackTrace();
            throw e; // O aruncăm mai departe pentru ca și Controller-ul să o vadă
        }
    }
}