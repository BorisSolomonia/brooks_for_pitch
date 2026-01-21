package com.brooks.pins;

public record MapPin(
    String id,
    LocationRequest location,
    MapPrecision mapPrecision
) {}
