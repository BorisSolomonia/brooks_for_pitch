package com.brooks.moderation.exception;

import com.brooks.common.exception.BaseGlobalExceptionHandler;
import org.springframework.web.bind.annotation.ControllerAdvice;

/**
 * Global exception handler for the moderation service.
 * Extends the base handler to provide consistent error responses.
 */
@ControllerAdvice
public class ModerationExceptionHandler extends BaseGlobalExceptionHandler {
  public ModerationExceptionHandler() {
    super("moderation-service");
  }

  // Service-specific exception handlers can be added here if needed
}
