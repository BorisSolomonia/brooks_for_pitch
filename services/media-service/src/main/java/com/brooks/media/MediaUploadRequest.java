package com.brooks.media;

import jakarta.validation.constraints.NotNull;

public record MediaUploadRequest(
    @NotNull(message = "Media type is required")
    MediaType mediaType
) {}
