package com.brooks.auth;

public record UserProfileResponse(
    String userId,
    String handle,
    String displayName,
    String avatarUrl,
    String bio,
    String about,
    String pronouns,
    String locationLabel,
    String websiteUrl
) {}
