package com.brooks.app.media;

import com.brooks.app.common.model.MediaType;
import jakarta.validation.constraints.NotNull;

public record MediaUploadRequest(
    @NotNull MediaType mediaType
) {}
