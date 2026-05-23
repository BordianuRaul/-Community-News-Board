package com.community.news.service;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.security.SecureRandom;
import java.util.Base64;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class PasswordHasher {

    private final String algorithm;
    private static final int ITERATIONS = 120_000;
    private static final int KEY_LENGTH = 256;
    private static final int SALT_BYTES = 16;

    private final SecureRandom secureRandom = new SecureRandom();

    public PasswordHasher(@Value("${auth.password.algorithm}") String algorithm) {
        if (algorithm == null || algorithm.isBlank()) {
            throw new IllegalStateException("auth.password.algorithm must be set");
        }
        this.algorithm = algorithm;
    }

    public HashResult hash(String password) {
        String salt = generateSalt();
        String hash = hashWithSalt(password, salt);
        return new HashResult(hash, salt);
    }

    public boolean verify(String password, String salt, String expectedHash) {
        String computed = hashWithSalt(password, salt);
        return constantTimeEquals(computed, expectedHash);
    }

    private String generateSalt() {
        byte[] salt = new byte[SALT_BYTES];
        secureRandom.nextBytes(salt);
        return Base64.getEncoder().encodeToString(salt);
    }

    private String hashWithSalt(String password, String saltBase64) {
        try {
            byte[] salt = Base64.getDecoder().decode(saltBase64);
            PBEKeySpec spec = new PBEKeySpec(password.toCharArray(), salt, ITERATIONS, KEY_LENGTH);
            SecretKeyFactory factory = SecretKeyFactory.getInstance(algorithm);
            byte[] hash = factory.generateSecret(spec).getEncoded();
            return Base64.getEncoder().encodeToString(hash);
        } catch (Exception ex) {
            throw new IllegalStateException("Failed to hash password", ex);
        }
    }

    private boolean constantTimeEquals(String a, String b) {
        if (a == null || b == null || a.length() != b.length()) {
            return false;
        }
        int result = 0;
        for (int i = 0; i < a.length(); i++) {
            result |= a.charAt(i) ^ b.charAt(i);
        }
        return result == 0;
    }

    public record HashResult(String hash, String salt) {
    }
}
