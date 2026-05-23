package com.community.news.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreatePostRequest {
    private String headline;
    private String body;
    private String imageKey;
}

