package com.brooks.pins;

import java.util.List;

public record PinCandidatesResponse(
    List<PinCandidate> candidates
) {}
