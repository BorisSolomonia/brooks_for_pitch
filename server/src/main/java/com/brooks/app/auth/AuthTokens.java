package com.brooks.app.auth;

public record AuthTokens(
    String accessToken,
    String refreshToken,
    long expiresIn
) {}
