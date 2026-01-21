package com.brooks.app.moderation;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ReportRequest(
    @NotNull String targetType,
    @NotNull String targetId,
    @NotBlank String reason,
    String details
) {}
