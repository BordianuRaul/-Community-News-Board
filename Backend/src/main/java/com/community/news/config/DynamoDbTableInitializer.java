package com.community.news.config;

import com.community.news.model.Post;
import com.community.news.model.User;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;
import software.amazon.awssdk.enhanced.dynamodb.model.CreateTableEnhancedRequest;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.DescribeTableRequest;
import software.amazon.awssdk.services.dynamodb.model.ResourceNotFoundException;

@Component
public class DynamoDbTableInitializer {

    private final DynamoDbClient dynamoDbClient;
    private final DynamoDbEnhancedClient enhancedClient;
    private final boolean autoCreateTables;

    public DynamoDbTableInitializer(DynamoDbClient dynamoDbClient,
                                    DynamoDbEnhancedClient enhancedClient,
                                    @Value("${aws.dynamodb.auto-create-tables:false}") boolean autoCreateTables) {
        this.dynamoDbClient = dynamoDbClient;
        this.enhancedClient = enhancedClient;
        this.autoCreateTables = autoCreateTables;
    }

    @PostConstruct
    public void ensureTables() {
        if (!autoCreateTables) {
            return;
        }
        ensureTableExists("Users", TableSchema.fromBean(User.class));
        ensureTableExists("Posts", TableSchema.fromBean(Post.class));
    }

    private <T> void ensureTableExists(String tableName, TableSchema<T> schema) {
        if (tableExists(tableName)) {
            return;
        }
        DynamoDbTable<T> table = enhancedClient.table(tableName, schema);
        table.createTable(CreateTableEnhancedRequest.builder().build());
    }

    private boolean tableExists(String tableName) {
        try {
            dynamoDbClient.describeTable(DescribeTableRequest.builder()
                    .tableName(tableName)
                    .build());
            return true;
        } catch (ResourceNotFoundException ex) {
            return false;
        }
    }
}
