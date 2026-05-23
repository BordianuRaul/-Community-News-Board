package com.community.news.service;

import com.community.news.dto.CreatePostRequest;
import com.community.news.dto.ImageResizeEvent;
import com.community.news.model.Post;
import com.community.news.repository.PostRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final SqsProducer sqsProducer;

    public PostService(PostRepository postRepository, SqsProducer sqsProducer) {
        this.postRepository = postRepository;
        this.sqsProducer = sqsProducer;
    }

    public Post createPost(CreatePostRequest request) {
        if (request == null || request.getHeadline() == null || request.getHeadline().isBlank()) {
            throw new IllegalArgumentException("headline is required");
        }
        if (request.getBody() == null || request.getBody().isBlank()) {
            throw new IllegalArgumentException("body is required");
        }
        if (request.getImageKey() == null || request.getImageKey().isBlank()) {
            throw new IllegalArgumentException("imageKey is required");
        }

        String imageKey = request.getImageKey();

        // 1. Prepare the Post record (thumbnailImageUrl is null initially)
        Post newPost = Post.builder()
                .postId(UUID.randomUUID().toString())
                .timestamp(Instant.now().toString())
                .headline(request.getHeadline())
                .body(request.getBody())
                .originalImageUrl(imageKey)
                .build();

        // 2. Save to DynamoDB
        postRepository.save(newPost);

        // 3. Send event to SQS to trigger thumbnail generation in the background
        ImageResizeEvent event = new ImageResizeEvent(newPost.getPostId(), imageKey);
        sqsProducer.publishImageResizeEvent(event);

        return newPost;
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }
}
