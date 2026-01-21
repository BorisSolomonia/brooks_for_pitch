package com.brooks.app.auth;

import java.time.Duration;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
  private static final long ACCESS_TTL_SECONDS = Duration.ofMinutes(15).getSeconds();

  public AuthTokens login(LoginRequest request) {
    return issueTokens();
  }

  public AuthTokens refresh(RefreshRequest request) {
    return issueTokens();
  }

  private AuthTokens issueTokens() {
    String accessToken = "access-" + UUID.randomUUID();
    String refreshToken = "refresh-" + UUID.randomUUID();
    return new AuthTokens(accessToken, refreshToken, ACCESS_TTL_SECONDS);
  }
}
