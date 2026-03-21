package com.brooks.auth;

import jakarta.validation.constraints.Size;

public record UpdateUserProfileRequest(
    @Size(min = 2, max = 32, message = "Handle must be between 2 and 32 characters")
    String handle,
    @Size(min = 1, max = 120, message = "Display name must be between 1 and 120 characters")
    String displayName,
    @Size(max = 500, message = "Avatar URL must be at most 500 characters")
    String avatarUrl,
    @Size(max = 280, message = "Bio must be at most 280 characters")
    String bio,
    String about,
    @Size(max = 80, message = "Pronouns must be at most 80 characters")
    String pronouns,
    @Size(max = 120, message = "Location must be at most 120 characters")
    String locationLabel,
    @Size(max = 320, message = "Website URL must be at most 320 characters")
    String websiteUrl
) {}
