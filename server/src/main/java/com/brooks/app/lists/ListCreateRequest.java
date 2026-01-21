package com.brooks.app.lists;

import com.brooks.app.common.model.ListType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ListCreateRequest(
    @NotBlank String name,
    @NotNull ListType listType
) {}
