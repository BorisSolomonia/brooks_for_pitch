package com.brooks.pins;

import java.util.List;

public record PolygonRequest(
    List<List<Double>> coordinates
) {}
