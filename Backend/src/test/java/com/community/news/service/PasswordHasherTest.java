package com.community.news.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class PasswordHasherTest {

    @Test
    void hashAndVerify() {
        PasswordHasher hasher = new PasswordHasher("PBKDF2WithHmacSHA256");
        PasswordHasher.HashResult result = hasher.hash("secret123");

        assertTrue(hasher.verify("secret123", result.salt(), result.hash()));
        assertFalse(hasher.verify("wrong", result.salt(), result.hash()));
    }
}
