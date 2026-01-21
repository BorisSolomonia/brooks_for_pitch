package com.brooks.app.pins;

import java.util.List;

public record MapPinsResponse(
    List<MapPin> pins
) {}
