package com.community.news.controller;

import com.community.news.dto.CreatePostRequest;
import com.community.news.model.Post;
import com.community.news.service.PostService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*") // Allows calls from any frontend locally
@Slf4j
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Post createPost(@RequestBody CreatePostRequest request) throws Exception {
        log.debug("DEBUG: Received request to create post with headline: {}", request.getHeadline());
        return postService.createPost(request);
    }

    @GetMapping
    public List<Post> getPosts() {
        return postService.getAllPosts();
    }
}
