package com.brooks.auth;

public record AuthTokens(
    String accessToken,
    String refreshToken,
    long expiresIn
) {}
