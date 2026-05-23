package com.community.news.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PresignResponse {
    private String url;
    private String key;
    private String method;
}

