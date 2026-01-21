package com.brooks.security;

import java.util.UUID;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public final class SecurityContextUtil {
  private SecurityContextUtil() {
  }

  public static UUID currentUserId() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null || !(authentication.getPrincipal() instanceof UserPrincipal)) {
      return null;
    }
    UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
    return principal.userId();
  }

  public static String currentToken() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null) {
      return null;
    }
    Object credentials = authentication.getCredentials();
    if (credentials instanceof String token) {
      return token;
    }
    return null;
  }
}
