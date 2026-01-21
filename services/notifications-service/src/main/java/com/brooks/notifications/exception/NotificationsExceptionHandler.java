package com.brooks.notifications.exception;

import com.brooks.common.exception.BaseGlobalExceptionHandler;
import org.springframework.web.bind.annotation.ControllerAdvice;

/**
 * Global exception handler for the notifications service.
 * Extends the base handler to provide consistent error responses.
 */
@ControllerAdvice
public class NotificationsExceptionHandler extends BaseGlobalExceptionHandler {
  public NotificationsExceptionHandler() {
    super("notifications-service");
  }

  // Service-specific exception handlers can be added here if needed
}
