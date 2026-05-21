package com.community.news.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbSortKey;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@DynamoDbBean
public class Post {
    private String postId;
    private String timestamp; // Folosit pentru sortare
    private String headline;
    private String body;
    private String originalImageUrl;
    private String thumbnailImageUrl;

    @DynamoDbPartitionKey
    public String getPostId() { return postId; }

    @DynamoDbSortKey
    public String getTimestamp() { return timestamp; }
}