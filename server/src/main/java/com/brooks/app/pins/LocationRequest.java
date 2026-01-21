package com.brooks.app.pins;

import jakarta.validation.constraints.NotNull;

public record LocationRequest(
    @NotNull Double lat,
    @NotNull Double lng,
    Double altitudeM
) {}
