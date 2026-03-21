package com.brooks.pins;

import java.util.List;

public record ProfileMapSummaryResponse(
    long totalCount,
    List<LocationRequest> markers
) {}
