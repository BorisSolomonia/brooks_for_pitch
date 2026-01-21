package com.brooks.security;

import java.util.UUID;

public record UserPrincipal(
    UUID userId,
    String email
) {}
