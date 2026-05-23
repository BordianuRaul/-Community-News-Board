package com.community.news.service;

import com.community.news.dto.AuthResponse;
import com.community.news.dto.LoginRequest;
import com.community.news.dto.RegisterRequest;
import com.community.news.model.User;
import com.community.news.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordHasher passwordHasher;

    public UserService(UserRepository userRepository, PasswordHasher passwordHasher) {
        this.userRepository = userRepository;
        this.passwordHasher = passwordHasher;
    }

    public AuthResponse register(RegisterRequest request) {
        validateRegister(request);

        User existing = userRepository.findByUsername(request.getUsername());
        if (existing != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "username already exists");
        }

        PasswordHasher.HashResult hashResult = passwordHasher.hash(request.getPassword());

        User user = User.builder()
                .userId(UUID.randomUUID().toString())
                .username(request.getUsername())
                .passwordHash(hashResult.hash())
                .passwordSalt(hashResult.salt())
                .createdAt(Instant.now().toString())
                .build();

        userRepository.save(user);
        return AuthResponse.from(user, "registered");
    }

    public AuthResponse login(LoginRequest request) {
        validateLogin(request);

        User user = userRepository.findByUsername(request.getUsername());
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "invalid credentials");
        }

        boolean ok = passwordHasher.verify(request.getPassword(), user.getPasswordSalt(), user.getPasswordHash());
        if (!ok) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "invalid credentials");
        }

        return AuthResponse.from(user, "logged-in");
    }

    private void validateRegister(RegisterRequest request) {
        if (request == null || request.getUsername() == null || request.getUsername().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "username is required");
        }
        if (request.getPassword() == null || request.getPassword().length() < 6) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "password must be at least 6 characters");
        }
    }

    private void validateLogin(LoginRequest request) {
        if (request == null || request.getUsername() == null || request.getUsername().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "username is required");
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "password is required");
        }
    }
}
