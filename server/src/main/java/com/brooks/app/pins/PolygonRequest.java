package com.brooks.app.pins;

import java.util.List;

public record PolygonRequest(
    List<List<Double>> coordinates
) {}
