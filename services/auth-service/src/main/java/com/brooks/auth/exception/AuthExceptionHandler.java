package com.brooks.auth.exception;

import com.brooks.common.exception.BaseGlobalExceptionHandler;
import org.springframework.web.bind.annotation.ControllerAdvice;

/**
 * Global exception handler for the auth service.
 * Extends the base handler to provide consistent error responses.
 */
@ControllerAdvice
public class AuthExceptionHandler extends BaseGlobalExceptionHandler {
  public AuthExceptionHandler() {
    super("auth-service");
  }

  // Service-specific exception handlers can be added here if needed
}
