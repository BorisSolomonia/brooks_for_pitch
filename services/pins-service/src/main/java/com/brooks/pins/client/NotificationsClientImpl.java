package com.brooks.pins.client;

import com.brooks.security.SecurityContextUtil;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import java.util.Map;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class NotificationsClientImpl implements NotificationsClient {
  private static final Logger log = LoggerFactory.getLogger(NotificationsClientImpl.class);
  private final RestTemplate restTemplate;
  private final String notificationsBaseUrl;
  private final String serviceKey;
  private final String serviceName;
  private final String revealTitle;
  private final String revealBody;
  private final String revealType;

  public NotificationsClientImpl(
      RestTemplate restTemplate,
      @Value("${brooks.notifications.base-url}") String notificationsBaseUrl,
      @Value("${internal.service.key}") String serviceKey,
      @Value("${internal.service.name}") String serviceName,
      @Value("${brooks.notifications.reveal-title}") String revealTitle,
      @Value("${brooks.notifications.reveal-body}") String revealBody,
      @Value("${brooks.notifications.reveal-type}") String revealType
  ) {
    this.restTemplate = restTemplate;
    this.notificationsBaseUrl = notificationsBaseUrl;
    this.serviceKey = serviceKey;
    this.serviceName = serviceName;
    this.revealTitle = revealTitle;
    this.revealBody = revealBody;
    this.revealType = revealType;
  }

  @Override
  @CircuitBreaker(name = "notificationsService", fallbackMethod = "sendRevealNotificationFallback")
  @Retry(name = "notificationsService")
  public void sendRevealNotification(UUID recipientId, UUID pinId, UUID ownerId) {
    String url = notificationsBaseUrl + "/internal/notifications";
    log.info("Sending reveal notification: recipientId={}, pinId={}", recipientId, pinId);

    HttpHeaders headers = createAuthHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);

    Map<String, Object> payload = Map.of(
        "userId", recipientId.toString(),
        "type", revealType,
        "referenceId", pinId.toString(),
        "title", revealTitle,
        "body", revealBody
    );

    HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);
    restTemplate.postForEntity(url, request, Void.class);
    log.info("Reveal notification sent: recipientId={}, pinId={}", recipientId, pinId);
  }

  private void sendRevealNotificationFallback(UUID recipientId, UUID pinId, UUID ownerId, Exception ex) {
    log.warn("Failed to send reveal notification for recipientId={}, pinId={}. Error: {}",
        recipientId, pinId, ex.getMessage());
  }

  private HttpHeaders createAuthHeaders() {
    HttpHeaders headers = new HttpHeaders();
    String token = SecurityContextUtil.currentToken();
    if (token != null) {
      headers.setBearerAuth(token);
    }
    headers.set("X-Internal-Service-Key", serviceKey);
    headers.set("X-Service-Name", serviceName);
    return headers;
  }
}
