package com.brooks.common.audit;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

/**
 * Represents a security audit event.
 * Immutable record of security-relevant actions.
 */
public class AuditEvent {
  private final Instant timestamp;
  private final String service;
  private final String eventType;
  private final String userId;
  private final String ipAddress;
  private final String action;
  private final String result;
  private final Map<String, Object> metadata;

  private AuditEvent(Builder builder) {
    this.timestamp = builder.timestamp != null ? builder.timestamp : Instant.now();
    this.service = builder.service;
    this.eventType = builder.eventType;
    this.userId = builder.userId;
    this.ipAddress = builder.ipAddress;
    this.action = builder.action;
    this.result = builder.result;
    this.metadata = builder.metadata != null ? new HashMap<>(builder.metadata) : new HashMap<>();
  }

  public static Builder builder() {
    return new Builder();
  }

  public Instant getTimestamp() {
    return timestamp;
  }

  public String getService() {
    return service;
  }

  public String getEventType() {
    return eventType;
  }

  public String getUserId() {
    return userId;
  }

  public String getIpAddress() {
    return ipAddress;
  }

  public String getAction() {
    return action;
  }

  public String getResult() {
    return result;
  }

  public Map<String, Object> getMetadata() {
    return new HashMap<>(metadata);
  }

  public static class Builder {
    private Instant timestamp;
    private String service;
    private String eventType;
    private String userId;
    private String ipAddress;
    private String action;
    private String result;
    private Map<String, Object> metadata;

    public Builder timestamp(Instant timestamp) {
      this.timestamp = timestamp;
      return this;
    }

    public Builder service(String service) {
      this.service = service;
      return this;
    }

    public Builder eventType(String eventType) {
      this.eventType = eventType;
      return this;
    }

    public Builder userId(String userId) {
      this.userId = userId;
      return this;
    }

    public Builder ipAddress(String ipAddress) {
      this.ipAddress = ipAddress;
      return this;
    }

    public Builder action(String action) {
      this.action = action;
      return this;
    }

    public Builder result(String result) {
      this.result = result;
      return this;
    }

    public Builder metadata(Map<String, Object> metadata) {
      this.metadata = metadata;
      return this;
    }

    public Builder addMetadata(String key, Object value) {
      if (this.metadata == null) {
        this.metadata = new HashMap<>();
      }
      this.metadata.put(key, value);
      return this;
    }

    public AuditEvent build() {
      return new AuditEvent(this);
    }
  }

  @Override
  public String toString() {
    return String.format(
        "AuditEvent{timestamp=%s, service='%s', eventType='%s', userId='%s', ipAddress='%s', action='%s', result='%s', metadata=%s}",
        timestamp, service, eventType, userId, ipAddress, action, result, metadata
    );
  }
}
