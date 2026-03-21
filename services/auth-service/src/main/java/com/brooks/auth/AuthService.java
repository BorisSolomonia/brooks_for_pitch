package com.brooks.auth;

import com.brooks.security.JwtService;
import com.brooks.security.SecurityContextUtil;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.Base64;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
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
      @Value("${brooks.jwt.refresh-ttl-seconds}") long refreshTtlSeconds
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

  public List<UserSummaryResponse> searchUsers(String query) {
    String normalized = query == null ? "" : query.trim();
    if (normalized.isBlank()) {
      return List.of();
    }

    return userRepository.searchActiveUsers(normalized).stream()
        .limit(20)
        .map(this::toUserSummary)
        .toList();
  }

  public List<UserSummaryResponse> getUserSummaries(List<UUID> ids) {
    if (ids == null || ids.isEmpty()) {
      return List.of();
    }

    return userRepository.findByIdIn(ids).stream()
        .filter(user -> user.getDeletedAt() == null && "active".equalsIgnoreCase(user.getStatus()))
        .sorted(Comparator.comparing(UserEntity::getDisplayName, String.CASE_INSENSITIVE_ORDER))
        .map(this::toUserSummary)
        .toList();
  }

  @Transactional
  public UserProfileResponse currentProfile() {
    return toUserProfile(requireCurrentUserEntity());
  }

  @Transactional(readOnly = true)
  public UserProfileResponse profileById(UUID userId) {
    return toUserProfile(findActiveUser(userId));
  }

  @Transactional(readOnly = true)
  public UserProfileResponse profileByHandle(String handle) {
    return toUserProfile(
        userRepository.findByHandleIgnoreCase(handle)
            .filter(user -> user.getDeletedAt() == null && "active".equalsIgnoreCase(user.getStatus()))
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"))
    );
  }

  @Transactional
  public UserProfileResponse updateCurrentProfile(UpdateUserProfileRequest request) {
    UserEntity user = requireCurrentUserEntity();

    String nextHandle = normalize(request.handle());
    if (!nextHandle.isBlank() && !nextHandle.equalsIgnoreCase(user.getHandle())) {
      userRepository.findByHandleIgnoreCase(nextHandle)
          .filter(existing -> !existing.getId().equals(user.getId()))
          .ifPresent(existing -> {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Handle already in use");
          });
      user.setHandle(nextHandle);
    }

    String nextDisplayName = normalize(request.displayName());
    if (!nextDisplayName.isBlank()) {
      user.setDisplayName(nextDisplayName);
    }

    user.setAvatarUrl(normalizeNullable(request.avatarUrl()));
    user.setBio(normalizeNullable(request.bio()));
    user.setAbout(normalizeNullable(request.about()));
    user.setPronouns(normalizeNullable(request.pronouns()));
    user.setLocationLabel(normalizeNullable(request.locationLabel()));
    user.setWebsiteUrl(normalizeNullable(request.websiteUrl()));

    return toUserProfile(userRepository.save(user));
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

  private UserSummaryResponse toUserSummary(UserEntity user) {
    return new UserSummaryResponse(
        user.getId().toString(),
        user.getHandle(),
        user.getDisplayName()
    );
  }

  private UserProfileResponse toUserProfile(UserEntity user) {
    return new UserProfileResponse(
        user.getId().toString(),
        user.getHandle(),
        user.getDisplayName(),
        user.getAvatarUrl(),
        user.getBio(),
        user.getAbout(),
        user.getPronouns(),
        user.getLocationLabel(),
        user.getWebsiteUrl()
    );
  }

  private UserEntity findActiveUser(UUID userId) {
    return userRepository.findById(userId)
        .filter(user -> user.getDeletedAt() == null && "active".equalsIgnoreCase(user.getStatus()))
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
  }

  private UserEntity requireCurrentUserEntity() {
    UUID actorId = requireActor();
    return userRepository.findById(actorId)
        .filter(user -> user.getDeletedAt() == null && "active".equalsIgnoreCase(user.getStatus()))
        .orElseGet(() -> userRepository.save(createUserFromJwt(actorId, currentJwt())));
  }

  private UUID requireActor() {
    UUID actorId = SecurityContextUtil.currentUserId();
    if (actorId == null) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing user context");
    }
    return actorId;
  }

  private UserEntity createUserFromJwt(UUID actorId, Jwt jwt) {
    UserEntity user = new UserEntity();
    String email = firstClaim(jwt, "email");
    String nickname = firstClaim(jwt, "preferred_username", "nickname");
    String name = firstClaim(jwt, "name", "given_name");

    String handleBase = normalizeHandle(nickname, email, actorId);

    user.setId(actorId);
    user.setEmail(email != null && !email.isBlank() ? email : actorId + "@brooks.local");
    user.setHandle(uniqueHandle(handleBase, actorId));
    user.setDisplayName(name != null && !name.isBlank() ? name : handleBase);
    user.setPasswordHash("{external-auth}");
    user.setStatus("ACTIVE");
    return user;
  }

  private Jwt currentJwt() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication instanceof JwtAuthenticationToken jwtAuthenticationToken) {
      return jwtAuthenticationToken.getToken();
    }
    Object principal = authentication == null ? null : authentication.getPrincipal();
    if (principal instanceof Jwt jwt) {
      return jwt;
    }
    throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing JWT context");
  }

  private String firstClaim(Jwt jwt, String... keys) {
    for (String key : keys) {
      String value = jwt.getClaimAsString(key);
      if (value != null && !value.isBlank()) {
        return value.trim();
      }
    }
    return null;
  }

  private String normalizeHandle(String nickname, String email, UUID actorId) {
    String source = nickname;
    if (source == null || source.isBlank()) {
      source = email != null && email.contains("@") ? email.substring(0, email.indexOf('@')) : "user-" + actorId.toString().substring(0, 8);
    }
    String normalized = source.toLowerCase().replaceAll("[^a-z0-9_.]", "");
    if (normalized.length() < 2) {
      normalized = "user" + actorId.toString().replace("-", "").substring(0, 6);
    }
    return normalized.substring(0, Math.min(normalized.length(), 32));
  }

  private String uniqueHandle(String base, UUID actorId) {
    String candidate = base;
    int suffix = 1;
    while (userRepository.findByHandleIgnoreCase(candidate)
        .filter(existing -> !existing.getId().equals(actorId))
        .isPresent()) {
      String tail = String.valueOf(suffix++);
      int maxBaseLength = Math.max(2, 32 - tail.length());
      candidate = base.substring(0, Math.min(base.length(), maxBaseLength)) + tail;
    }
    return candidate;
  }

  private String normalize(String value) {
    return value == null ? "" : value.trim();
  }

  private String normalizeNullable(String value) {
    String normalized = normalize(value);
    return normalized.isBlank() ? null : normalized;
  }
}
