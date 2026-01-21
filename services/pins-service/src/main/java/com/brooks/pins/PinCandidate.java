package com.brooks.pins;

public record PinCandidate(
    String id,
    LocationRequest center,
    RevealType revealType,
    Integer revealRadiusM,
    PolygonRequest mysteryPolygon
) {}
