package com.community.news.repository;

import com.community.news.model.Post;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;

import java.util.List;
import java.util.stream.Collectors;

@Repository
public class PostRepository {

    private final DynamoDbTable<Post> postTable;

    public PostRepository(DynamoDbEnhancedClient enhancedClient) {
        // Maps your "Post" Java class to the "Posts" table in DynamoDB
        this.postTable = enhancedClient.table("Posts", TableSchema.fromBean(Post.class));
    }

    public void save(Post post) {
        // Saves or updates the item in DynamoDB automatically
        postTable.putItem(post);
    }

    public List<Post> findAll() {
        // Fetches all items from the table and sorts them locally by timestamp descending (newest first)
        return postTable.scan().items().stream()
                .sorted((p1, p2) -> p2.getTimestamp().compareTo(p1.getTimestamp()))
                .collect(Collectors.toList());
    }
}
