package com.community.news.dto;

import com.community.news.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String userId;
    private String username;
    private String createdAt;
    private String message;

    public static AuthResponse from(User user, String message) {
        return new AuthResponse(user.getUserId(), user.getUsername(), user.getCreatedAt(), message);
    }
}


