package com.brooks.auth;

public record UserSummaryResponse(
    String userId,
    String handle,
    String displayName
) {}
