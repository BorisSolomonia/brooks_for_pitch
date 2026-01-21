package com.brooks.common.ratelimit;

import com.brooks.common.audit.AuditLogger;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.http.HttpStatus;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Token bucket rate limiting filter.
 * Limits requests per IP address or per authenticated user.
 *
 * Default: 100 requests per minute per client
 * Configurable via constructor parameters
 */
public class RateLimitFilter extends OncePerRequestFilter {
  private final Map<String, Bucket> cache = new ConcurrentHashMap<>();
  private final int capacity;
  private final int refillTokens;
  private final Duration refillDuration;
  private final AuditLogger auditLogger;

  /**
   * Creates a rate limit filter with default settings.
   * Default: 100 requests per minute
   */
  public RateLimitFilter() {
    this(100, 100, Duration.ofMinutes(1), "unknown-service");
  }

  /**
   * Creates a rate limit filter with custom settings.
   *
   * @param capacity Maximum tokens in bucket
   * @param refillTokens Tokens to add during refill
   * @param refillDuration Duration between refills
   */
  public RateLimitFilter(int capacity, int refillTokens, Duration refillDuration) {
    this(capacity, refillTokens, refillDuration, "unknown-service");
  }

  /**
   * Creates a rate limit filter with custom settings and service name.
   *
   * @param capacity Maximum tokens in bucket
   * @param refillTokens Tokens to add during refill
   * @param refillDuration Duration between refills
   * @param serviceName Name of the service for audit logging
   */
  public RateLimitFilter(int capacity, int refillTokens, Duration refillDuration, String serviceName) {
    this.capacity = capacity;
    this.refillTokens = refillTokens;
    this.refillDuration = refillDuration;
    this.auditLogger = new AuditLogger(serviceName);
  }

  @Override
  protected void doFilterInternal(
      HttpServletRequest request,
      HttpServletResponse response,
      FilterChain filterChain
  ) throws ServletException, IOException {
    String key = resolveClientKey(request);
    Bucket bucket = resolveBucket(key);

    if (bucket.tryConsume(1)) {
      filterChain.doFilter(request, response);
    } else {
      // Log rate limit exceeded event
      auditLogger.logRateLimitExceeded(key, getClientIpAddress(request), request.getRequestURI());
      sendRateLimitExceeded(response);
    }
  }

  @Override
  protected boolean shouldNotFilter(HttpServletRequest request) {
    String path = request.getRequestURI();
    // Don't rate limit health/metrics endpoints
    return path.startsWith("/actuator/health") ||
           path.startsWith("/actuator/info");
  }

  /**
   * Resolves client identifier for rate limiting.
   * Prefers user ID from security context, falls back to IP address.
   */
  private String resolveClientKey(HttpServletRequest request) {
    // Try to get authenticated user ID from Authorization header
    String authHeader = request.getHeader("Authorization");
    if (authHeader != null && authHeader.startsWith("Bearer ")) {
      // Use a hash of the token as key (simplified - in production, extract user ID from JWT)
      return "user:" + authHeader.substring(7, Math.min(authHeader.length(), 20));
    }

    // Fall back to IP address
    String clientIp = getClientIpAddress(request);
    return "ip:" + clientIp;
  }

  /**
   * Resolves bucket for a client key, creating if needed.
   */
  private Bucket resolveBucket(String key) {
    return cache.computeIfAbsent(key, k -> createNewBucket());
  }

  /**
   * Creates a new token bucket with configured limits.
   */
  private Bucket createNewBucket() {
    Bandwidth limit = Bandwidth.classic(
        capacity,
        Refill.intervally(refillTokens, refillDuration)
    );
    return Bucket.builder()
        .addLimit(limit)
        .build();
  }

  /**
   * Extracts client IP address, handling proxies.
   */
  private String getClientIpAddress(HttpServletRequest request) {
    String xForwardedFor = request.getHeader("X-Forwarded-For");
    if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
      return xForwardedFor.split(",")[0].trim();
    }
    return request.getRemoteAddr();
  }

  /**
   * Sends HTTP 429 Too Many Requests response.
   */
  private void sendRateLimitExceeded(HttpServletResponse response) throws IOException {
    response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
    response.setContentType("application/json");
    response.getWriter().write(
        "{\"error\":\"Too Many Requests\",\"message\":\"Rate limit exceeded. Please try again later.\"}"
    );
  }
}
