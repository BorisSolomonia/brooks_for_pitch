package com.brooks.app.pins;

public record RevealCheckResponse(
    boolean unlocked,
    PinDetail pin
) {}
