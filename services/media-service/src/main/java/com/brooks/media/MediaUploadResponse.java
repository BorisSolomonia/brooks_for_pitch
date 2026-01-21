package com.brooks.media;

public record MediaUploadResponse(
    String uploadUrl,
    String storageKey
) {}
