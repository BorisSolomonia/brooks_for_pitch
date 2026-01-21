package com.brooks.pins.exception;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.server.ResponseStatusException;

/**
 * Global exception handler for the pins service.
 * Provides consistent error responses across all endpoints.
 */
@ControllerAdvice
public class GlobalExceptionHandler {
  private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

  /**
   * Handles ResponseStatusException (thrown by service layer).
   */
  @ExceptionHandler(ResponseStatusException.class)
  public ResponseEntity<ErrorResponse> handleResponseStatusException(
      ResponseStatusException ex,
      WebRequest request
  ) {
    HttpStatus status = HttpStatus.valueOf(ex.getStatusCode().value());
    log.warn("ResponseStatusException: {} - {}", status, ex.getReason());

    ErrorResponse error = ErrorResponse.builder()
        .timestamp(Instant.now())
        .status(status.value())
        .error(status.getReasonPhrase())
        .message(ex.getReason())
        .path(extractPath(request))
        .build();

    return ResponseEntity.status(status).body(error);
  }

  /**
   * Handles validation errors (@Valid on DTOs).
   */
  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ErrorResponse> handleValidationException(
      MethodArgumentNotValidException ex,
      WebRequest request
  ) {
    log.warn("Validation error: {}", ex.getMessage());

    Map<String, String> fieldErrors = new HashMap<>();
    for (FieldError error : ex.getBindingResult().getFieldErrors()) {
      fieldErrors.put(error.getField(), error.getDefaultMessage());
    }

    ErrorResponse error = ErrorResponse.builder()
        .timestamp(Instant.now())
        .status(HttpStatus.BAD_REQUEST.value())
        .error("Validation Failed")
        .message("Invalid request parameters")
        .path(extractPath(request))
        .details(fieldErrors)
        .build();

    return ResponseEntity.badRequest().body(error);
  }

  /**
   * Handles IllegalArgumentException (e.g., from value objects).
   */
  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<ErrorResponse> handleIllegalArgumentException(
      IllegalArgumentException ex,
      WebRequest request
  ) {
    log.warn("IllegalArgumentException: {}", ex.getMessage());

    ErrorResponse error = ErrorResponse.builder()
        .timestamp(Instant.now())
        .status(HttpStatus.BAD_REQUEST.value())
        .error("Bad Request")
        .message(ex.getMessage())
        .path(extractPath(request))
        .build();

    return ResponseEntity.badRequest().body(error);
  }

  /**
   * Handles unexpected exceptions.
   */
  @ExceptionHandler(Exception.class)
  public ResponseEntity<ErrorResponse> handleGenericException(
      Exception ex,
      WebRequest request
  ) {
    log.error("Unexpected exception occurred", ex);

    ErrorResponse error = ErrorResponse.builder()
        .timestamp(Instant.now())
        .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
        .error("Internal Server Error")
        .message("An unexpected error occurred. Please try again later.")
        .path(extractPath(request))
        .build();

    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
  }

  /**
   * Handles circuit breaker exceptions (when service is unavailable).
   */
  @ExceptionHandler(io.github.resilience4j.circuitbreaker.CallNotPermittedException.class)
  public ResponseEntity<ErrorResponse> handleCircuitBreakerException(
      io.github.resilience4j.circuitbreaker.CallNotPermittedException ex,
      WebRequest request
  ) {
    log.error("Circuit breaker is open: {}", ex.getMessage());

    ErrorResponse error = ErrorResponse.builder()
        .timestamp(Instant.now())
        .status(HttpStatus.SERVICE_UNAVAILABLE.value())
        .error("Service Unavailable")
        .message("A dependent service is currently unavailable. Please try again later.")
        .path(extractPath(request))
        .build();

    return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(error);
  }

  private String extractPath(WebRequest request) {
    return request.getDescription(false).replace("uri=", "");
  }
}
