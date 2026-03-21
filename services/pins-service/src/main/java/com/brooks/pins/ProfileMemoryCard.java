package com.brooks.pins;

public record ProfileMemoryCard(
    String id,
    LocationRequest location,
    MapPrecision mapPrecision,
    String textPreview,
    AudienceType audienceType,
    RevealType revealType,
    String createdAt,
    boolean owner
) {}
