package com.brooks.common.audit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Service for logging security audit events.
 * Logs in structured JSON format for easy parsing and analysis.
 *
 * Usage:
 * <pre>
 * AuditLogger auditLogger = new AuditLogger("my-service");
 * auditLogger.logAuthSuccess("user-123", "192.168.1.1", "login");
 * auditLogger.logAuthFailure("unknown", "192.168.1.1", "login", "Invalid credentials");
 * auditLogger.logAccessDenied("user-123", "192.168.1.1", "view-admin-panel", "Insufficient permissions");
 * </pre>
 */
public class AuditLogger {
  private static final Logger log = LoggerFactory.getLogger("SECURITY_AUDIT");
  private final String serviceName;

  public AuditLogger(String serviceName) {
    this.serviceName = serviceName;
  }

  /**
   * Logs successful authentication event.
   */
  public void logAuthSuccess(String userId, String ipAddress, String action) {
    AuditEvent event = AuditEvent.builder()
        .service(serviceName)
        .eventType("AUTHENTICATION")
        .userId(userId)
        .ipAddress(ipAddress)
        .action(action)
        .result("SUCCESS")
        .build();
    log.info("AUDIT: {}", formatEvent(event));
  }

  /**
   * Logs failed authentication event.
   */
  public void logAuthFailure(String userId, String ipAddress, String action, String reason) {
    AuditEvent event = AuditEvent.builder()
        .service(serviceName)
        .eventType("AUTHENTICATION")
        .userId(userId)
        .ipAddress(ipAddress)
        .action(action)
        .result("FAILURE")
        .addMetadata("reason", reason)
        .build();
    log.warn("AUDIT: {}", formatEvent(event));
  }

  /**
   * Logs access denied event.
   */
  public void logAccessDenied(String userId, String ipAddress, String action, String reason) {
    AuditEvent event = AuditEvent.builder()
        .service(serviceName)
        .eventType("ACCESS_CONTROL")
        .userId(userId)
        .ipAddress(ipAddress)
        .action(action)
        .result("DENIED")
        .addMetadata("reason", reason)
        .build();
    log.warn("AUDIT: {}", formatEvent(event));
  }

  /**
   * Logs rate limit exceeded event.
   */
  public void logRateLimitExceeded(String userId, String ipAddress, String endpoint) {
    AuditEvent event = AuditEvent.builder()
        .service(serviceName)
        .eventType("RATE_LIMIT")
        .userId(userId)
        .ipAddress(ipAddress)
        .action("API_CALL")
        .result("RATE_LIMITED")
        .addMetadata("endpoint", endpoint)
        .build();
    log.warn("AUDIT: {}", formatEvent(event));
  }

  /**
   * Logs data access event.
   */
  public void logDataAccess(String userId, String ipAddress, String resourceType, String resourceId, String action) {
    AuditEvent event = AuditEvent.builder()
        .service(serviceName)
        .eventType("DATA_ACCESS")
        .userId(userId)
        .ipAddress(ipAddress)
        .action(action)
        .result("SUCCESS")
        .addMetadata("resourceType", resourceType)
        .addMetadata("resourceId", resourceId)
        .build();
    log.info("AUDIT: {}", formatEvent(event));
  }

  /**
   * Logs custom audit event.
   */
  public void logCustomEvent(AuditEvent event) {
    log.info("AUDIT: {}", formatEvent(event));
  }

  /**
   * Formats audit event as JSON-like string for structured logging.
   * In production, use a JSON library for proper formatting.
   */
  private String formatEvent(AuditEvent event) {
    StringBuilder sb = new StringBuilder();
    sb.append("{");
    sb.append("\"timestamp\":\"").append(event.getTimestamp()).append("\",");
    sb.append("\"service\":\"").append(event.getService()).append("\",");
    sb.append("\"eventType\":\"").append(event.getEventType()).append("\",");
    sb.append("\"userId\":\"").append(event.getUserId()).append("\",");
    sb.append("\"ipAddress\":\"").append(event.getIpAddress()).append("\",");
    sb.append("\"action\":\"").append(event.getAction()).append("\",");
    sb.append("\"result\":\"").append(event.getResult()).append("\"");

    if (!event.getMetadata().isEmpty()) {
      sb.append(",\"metadata\":{");
      event.getMetadata().forEach((key, value) -> {
        sb.append("\"").append(key).append("\":\"").append(value).append("\",");
      });
      // Remove trailing comma
      sb.setLength(sb.length() - 1);
      sb.append("}");
    }

    sb.append("}");
    return sb.toString();
  }
}
