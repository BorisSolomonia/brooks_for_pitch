package com.brooks.pins;

public enum PinMapScope {
  HOME,
  MINE,
  FRIENDS;

  public static PinMapScope fromRequest(String rawScope) {
    if (rawScope == null || rawScope.isBlank()) {
      return HOME;
    }

    try {
      return PinMapScope.valueOf(rawScope.trim().toUpperCase());
    } catch (IllegalArgumentException ex) {
      throw new org.springframework.web.server.ResponseStatusException(
          org.springframework.http.HttpStatus.BAD_REQUEST,
          "Invalid pin scope"
      );
    }
  }
}
