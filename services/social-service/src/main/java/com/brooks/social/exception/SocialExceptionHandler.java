package com.brooks.social.exception;

import com.brooks.common.exception.BaseGlobalExceptionHandler;
import org.springframework.web.bind.annotation.ControllerAdvice;

/**
 * Global exception handler for the social service.
 * Extends the base handler to provide consistent error responses.
 */
@ControllerAdvice
public class SocialExceptionHandler extends BaseGlobalExceptionHandler {
  public SocialExceptionHandler() {
    super("social-service");
  }

  // Service-specific exception handlers can be added here if needed
}
