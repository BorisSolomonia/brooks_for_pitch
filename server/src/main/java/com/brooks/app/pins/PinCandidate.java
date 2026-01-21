package com.brooks.app.pins;

import com.brooks.app.common.model.RevealType;

public record PinCandidate(
    String id,
    RevealType revealType,
    Integer revealRadiusM,
    PolygonRequest mysteryPolygon
) {}
