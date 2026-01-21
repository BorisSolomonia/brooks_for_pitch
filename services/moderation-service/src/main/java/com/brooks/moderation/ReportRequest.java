package com.brooks.moderation;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ReportRequest(
    @NotBlank(message = "Target type is required")
    @Size(max = 20, message = "Target type must not exceed 20 characters")
    String targetType,

    @NotBlank(message = "Target ID is required")
    String targetId,

    @NotBlank(message = "Reason is required")
    @Size(min = 3, max = 100, message = "Reason must be between 3 and 100 characters")
    String reason,

    @Size(max = 1000, message = "Details must not exceed 1000 characters")
    String details
) {}
