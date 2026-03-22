package com.brooks.pins;

import java.util.List;

public record ProximityCheckResponse(List<RevealedPin> revealed) {

  public record RevealedPin(String id, String text, String linkUrl) {}
}
