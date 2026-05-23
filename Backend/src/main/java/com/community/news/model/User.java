package com.community.news.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@DynamoDbBean
public class User {
    private String username;
    private String userId;
    private String passwordHash;
    private String passwordSalt;
    private String createdAt;

    @DynamoDbPartitionKey
    public String getUsername() {
        return username;
    }
}

}
