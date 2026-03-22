package com.brooks.pins;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record ProximityCheckRequest(
    @Valid @NotNull LocationRequest location
) {}
