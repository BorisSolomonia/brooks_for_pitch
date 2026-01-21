package com.brooks.app.pins;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record RevealCheckRequest(
    @Valid @NotNull LocationRequest location
) {}
