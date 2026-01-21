package com.brooks.app.pins;

import java.util.List;

public record PinCandidatesResponse(
    List<PinCandidate> candidates
) {}
