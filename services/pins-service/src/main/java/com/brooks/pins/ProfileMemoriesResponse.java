package com.brooks.pins;

import java.util.List;

public record ProfileMemoriesResponse(
    List<ProfileMemoryCard> memories
) {}
