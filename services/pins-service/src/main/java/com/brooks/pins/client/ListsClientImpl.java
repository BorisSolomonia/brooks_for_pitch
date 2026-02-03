package com.brooks.pins.client;

import com.brooks.pins.ListMembershipRequest;
import com.brooks.pins.ListMembershipResponse;
import com.brooks.security.SecurityContextUtil;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import io.github.resilience4j.timelimiter.annotation.TimeLimiter;
import java.util.List;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

/**
 * REST-based implementation of the ListsClient.
 * Communicates with the lists-service via HTTP with circuit breaker protection.
 */
@Component
public class ListsClientImpl implements ListsClient {
  private static final Logger log = LoggerFactory.getLogger(ListsClientImpl.class);
  private final RestTemplate restTemplate;
  private final String listsBaseUrl;
  private final String serviceName;
  private final String serviceKey;

  public ListsClientImpl(
      RestTemplate restTemplate,
      @Value("${brooks.lists.base-url}") String listsBaseUrl,
      @Value("${internal.service.name}") String serviceName,
      @Value("${internal.service.key}") String serviceKey
  ) {
    this.restTemplate = restTemplate;
    this.listsBaseUrl = listsBaseUrl;
    this.serviceName = serviceName;
    this.serviceKey = serviceKey;
  }

  @Override
  @Cacheable(
      cacheNames = "listsMembership",
      key = "#userId.toString() + '|' + T(java.lang.String).join(',', #listIds)"
  )
  @CircuitBreaker(name = "listsService", fallbackMethod = "isUserInAnyListFallback")
  @Retry(name = "listsService")
  @TimeLimiter(name = "listsService")
  public boolean isUserInAnyList(UUID userId, List<String> listIds) {
    if (listIds == null || listIds.isEmpty()) {
      return false;
    }

    ListMembershipRequest request = new ListMembershipRequest(userId.toString(), listIds);
    HttpHeaders headers = createAuthHeaders();

    ResponseEntity<ListMembershipResponse> response = restTemplate.exchange(
        listsBaseUrl + "/internal/lists/membership",
        HttpMethod.POST,
        new HttpEntity<>(request, headers),
        ListMembershipResponse.class
    );

    ListMembershipResponse body = response.getBody();
    return body != null && body.inAny();
  }

  /**
   * Fallback method when lists service is unavailable.
   * Returns false as safe default (denies access).
   */
  private boolean isUserInAnyListFallback(UUID userId, List<String> listIds, Exception ex) {
    log.warn("Lists service unavailable for userId={}, listIds={}. Using fallback. Error: {}",
        userId, listIds, ex.getMessage());
    // Return false as safe default (deny access)
    return false;
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
