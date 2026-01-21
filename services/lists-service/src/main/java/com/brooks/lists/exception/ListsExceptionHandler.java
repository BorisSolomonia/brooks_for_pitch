package com.brooks.lists.exception;

import com.brooks.common.exception.BaseGlobalExceptionHandler;
import org.springframework.web.bind.annotation.ControllerAdvice;

/**
 * Global exception handler for the lists service.
 * Extends the base handler to provide consistent error responses.
 */
@ControllerAdvice
public class ListsExceptionHandler extends BaseGlobalExceptionHandler {
  public ListsExceptionHandler() {
    super("lists-service");
  }

  // Service-specific exception handlers can be added here if needed
}
