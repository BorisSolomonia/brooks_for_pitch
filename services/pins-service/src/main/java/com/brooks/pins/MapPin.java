package com.brooks.pins;

public record MapPin(
    String id,
    LocationRequest location,
    MapPrecision mapPrecision,
    String textPreview,
    AudienceType audienceType,
    RevealType revealType,
    boolean owner
) {}
