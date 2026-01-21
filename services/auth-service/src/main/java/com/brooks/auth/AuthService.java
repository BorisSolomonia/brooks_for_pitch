package com.brooks.auth;

import com.brooks.security.JwtService;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.Base64;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {
  private final UserRepository userRepository;
  private final RefreshTokenRepository refreshTokenRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final long accessTtlSeconds;
  private final long refreshTtlSeconds;

  public AuthService(
      UserRepository userRepository,
      RefreshTokenRepository refreshTokenRepository,
      PasswordEncoder passwordEncoder,
      JwtService jwtService,
      @Value("${brooks.jwt.access-ttl-seconds}") long accessTtlSeconds,
      @Value("${brooks.jwt.refresh-ttl-seconds:2592000}") long refreshTtlSeconds
  ) {
    this.userRepository = userRepository;
    this.refreshTokenRepository = refreshTokenRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
    this.accessTtlSeconds = accessTtlSeconds;
    this.refreshTtlSeconds = refreshTtlSeconds;
  }

  public AuthTokens login(LoginRequest request) {
    UserEntity user = userRepository.findByEmail(request.email())
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));
    if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
    }
    return issueTokens(user);
  }

  @Transactional
  public AuthTokens refresh(RefreshRequest request) {
    String tokenHash = hashToken(request.refreshToken());
    RefreshTokenEntity token = refreshTokenRepository.findByTokenHash(tokenHash)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid refresh token"));
    Instant now = Instant.now();
    if (token.getRevokedAt() != null || token.getExpiresAt().isBefore(now)) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token expired");
    }
    token.setRevokedAt(now);
    refreshTokenRepository.save(token);

    UserEntity user = userRepository.findById(token.getUserId())
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
    return issueTokens(user);
  }

  private AuthTokens issueTokens(UserEntity user) {
    String accessToken = jwtService.issueAccessToken(user.getId(), user.getEmail());
    String refreshToken = "refresh-" + UUID.randomUUID();
    Instant expiresAt = Instant.now().plusSeconds(refreshTtlSeconds);

    RefreshTokenEntity token = new RefreshTokenEntity();
    token.setUserId(user.getId());
    token.setTokenHash(hashToken(refreshToken));
    token.setExpiresAt(expiresAt);
    refreshTokenRepository.save(token);

    return new AuthTokens(accessToken, refreshToken, accessTtlSeconds);
  }

  private String hashToken(String token) {
    try {
      MessageDigest digest = MessageDigest.getInstance("SHA-256");
      byte[] hashed = digest.digest(token.getBytes(StandardCharsets.UTF_8));
      return Base64.getEncoder().encodeToString(hashed);
    } catch (NoSuchAlgorithmException e) {
      throw new IllegalStateException("SHA-256 unavailable", e);
    }
  }
}
