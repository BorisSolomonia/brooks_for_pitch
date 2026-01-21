package com.brooks.pins.client;

import com.brooks.pins.SocialGraphView;
import com.brooks.security.SecurityContextUtil;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import io.github.resilience4j.timelimiter.annotation.TimeLimiter;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

/**
 * REST-based implementation of the SocialGraphClient.
 * Communicates with the social-service via HTTP with circuit breaker protection.
 */
@Component
public class SocialGraphClientImpl implements SocialGraphClient {
  private static final Logger log = LoggerFactory.getLogger(SocialGraphClientImpl.class);
  private final RestTemplate restTemplate;
  private final String socialBaseUrl;
  private final String serviceName;
  private final String serviceKey;

  public SocialGraphClientImpl(
      RestTemplate restTemplate,
      @Value("${brooks.social.base-url}") String socialBaseUrl,
      @Value("${internal.service.name}") String serviceName,
      @Value("${internal.service.key}") String serviceKey
  ) {
    this.restTemplate = restTemplate;
    this.socialBaseUrl = socialBaseUrl;
    this.serviceName = serviceName;
    this.serviceKey = serviceKey;
  }

  @Override
  @CircuitBreaker(name = "socialService", fallbackMethod = "fetchGraphViewFallback")
  @Retry(name = "socialService")
  @TimeLimiter(name = "socialService")
  public SocialGraphView fetchGraphView(UUID viewerId, UUID subjectId) {
    String url = String.format("%s/internal/graph/view?viewerId=%s&subjectId=%s",
        socialBaseUrl, viewerId, subjectId);

    HttpHeaders headers = createAuthHeaders();
    ResponseEntity<SocialGraphView> response = restTemplate.exchange(
        url,
        HttpMethod.GET,
        new HttpEntity<>(null, headers),
        SocialGraphView.class
    );

    SocialGraphView body = response.getBody();
    if (body == null) {
      // Return default deny-all view if service returns null
      return new SocialGraphView(false, false, false, false, false);
    }
    return body;
  }

  /**
   * Fallback method when social service is unavailable.
   * Returns a restrictive default view to fail-safe.
   */
  private SocialGraphView fetchGraphViewFallback(UUID viewerId, UUID subjectId, Exception ex) {
    log.warn("Social service unavailable for viewerId={}, subjectId={}. Using fallback. Error: {}",
        viewerId, subjectId, ex.getMessage());
    // Return deny-all permissions as safe default
    return new SocialGraphView(false, false, false, false, false);
  }

  private HttpHeaders createAuthHeaders() {
    HttpHeaders headers = new HttpHeaders();
    String token = SecurityContextUtil.currentToken();
    if (token != null) {
      headers.setBearerAuth(token);
    }
    // Add internal service authentication
    headers.set("X-Internal-Service-Key", serviceKey);
    headers.set("X-Service-Name", serviceName);
    return headers;
  }
}
