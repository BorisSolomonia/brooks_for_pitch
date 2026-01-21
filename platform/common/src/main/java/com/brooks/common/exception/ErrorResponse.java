package com.brooks.common.exception;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.Instant;
import java.util.Map;

/**
 * Standardized error response structure for all Brooks services.
 * Follows RFC 7807 Problem Details for HTTP APIs pattern.
 *
 * <p>This class should be used by all microservices to ensure
 * consistent error responses across the entire platform.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse {
  private Instant timestamp;
  private int status;
  private String error;
  private String message;
  private String path;
  private String service;
  private Map<String, String> details;

  private ErrorResponse(Builder builder) {
    this.timestamp = builder.timestamp;
    this.status = builder.status;
    this.error = builder.error;
    this.message = builder.message;
    this.path = builder.path;
    this.service = builder.service;
    this.details = builder.details;
  }

  public static Builder builder() {
    return new Builder();
  }

  // Getters
  public Instant getTimestamp() {
    return timestamp;
  }

  public int getStatus() {
    return status;
  }

  public String getError() {
    return error;
  }

  public String getMessage() {
    return message;
  }

  public String getPath() {
    return path;
  }

  public String getService() {
    return service;
  }

  public Map<String, String> getDetails() {
    return details;
  }

  public static class Builder {
    private Instant timestamp;
    private int status;
    private String error;
    private String message;
    private String path;
    private String service;
    private Map<String, String> details;

    public Builder timestamp(Instant timestamp) {
      this.timestamp = timestamp;
      return this;
    }

    public Builder status(int status) {
      this.status = status;
      return this;
    }

    public Builder error(String error) {
      this.error = error;
      return this;
    }

    public Builder message(String message) {
      this.message = message;
      return this;
    }

    public Builder path(String path) {
      this.path = path;
      return this;
    }

    public Builder service(String service) {
      this.service = service;
      return this;
    }

    public Builder details(Map<String, String> details) {
      this.details = details;
      return this;
    }

    public ErrorResponse build() {
      return new ErrorResponse(this);
    }
  }
}
