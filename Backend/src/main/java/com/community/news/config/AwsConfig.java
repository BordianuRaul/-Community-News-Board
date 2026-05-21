package com.community.news.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

@Configuration
public class AwsConfig {

    @Bean
    public S3Client s3Client() {
        // Introdu cheile tale aici (le găsești în fișierul .csv descărcat de la AWS IAM)
        AwsBasicCredentials credentials = AwsBasicCredentials.create(
            System.getenv("AWS_ACCESS_KEY_ID"), 
            System.getenv("AWS_SECRET_ACCESS_KEY")
        );

        return S3Client.builder()
                .region(Region.EU_NORTH_1)
                .credentialsProvider(StaticCredentialsProvider.create(credentials))
                .build();
    }
}