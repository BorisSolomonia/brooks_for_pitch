package com.brooks.security;

public record JwtConfig(
    String issuer,
    String secret,
    long accessTtlSeconds
) {}
