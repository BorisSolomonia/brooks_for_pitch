package com.brooks.app.media;

public record MediaUploadResponse(
    String uploadUrl,
    String storageKey
) {}
