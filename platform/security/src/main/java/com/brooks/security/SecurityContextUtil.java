package com.brooks.security;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.UUID;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

public final class SecurityContextUtil {
  private SecurityContextUtil() {
  }

  public static UUID currentUserId() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null) {
      return null;
    }

    Object principal = authentication.getPrincipal();
    if (principal instanceof UserPrincipal userPrincipal) {
      return userPrincipal.userId();
    }

    if (principal instanceof Jwt jwtPrincipal) {
      return resolveUserId(jwtPrincipal);
    }

    if (authentication instanceof JwtAuthenticationToken jwtAuth) {
      return resolveUserId(jwtAuth.getToken());
    }

    return null;
  }

  public static String currentToken() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null) {
      return null;
    }
    if (authentication instanceof JwtAuthenticationToken jwtAuth) {
      return jwtAuth.getToken().getTokenValue();
    }

    Object principal = authentication.getPrincipal();
    if (principal instanceof Jwt jwtPrincipal) {
      return jwtPrincipal.getTokenValue();
    }

    Object credentials = authentication.getCredentials();
    if (credentials instanceof String token) {
      return token;
    }
    if (credentials instanceof Jwt jwtCredentials) {
      return jwtCredentials.getTokenValue();
    }

    return null;
  }

  private static UUID resolveUserId(Jwt jwt) {
    String userId = firstClaim(jwt, List.of(
        "https://brooksweb.uk/user_id",
        "https://brooksweb.uk/uid",
        "user_id",
        "uid",
        "sub"
    ));
    if (userId == null || userId.isBlank()) {
      return null;
    }
    try {
      return UUID.fromString(userId);
    } catch (IllegalArgumentException ex) {
      return UUID.nameUUIDFromBytes(userId.getBytes(StandardCharsets.UTF_8));
    }
  }

  private static String firstClaim(Jwt jwt, List<String> claimKeys) {
    for (String key : claimKeys) {
      String value = jwt.getClaimAsString(key);
      if (value != null && !value.isBlank()) {
        return value;
      }
    }
    return null;
  }
}
