package com.brooks.app.pins;

import com.brooks.app.common.model.MapPrecision;

public record MapPin(
    String id,
    LocationRequest location,
    MapPrecision mapPrecision
) {}
