package com.brooks.pins;

public record RevealCheckResponse(
    boolean unlocked,
    String reason,
    PinDetail pin
) {}
