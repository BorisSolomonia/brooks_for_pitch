package com.brooks.media.exception;

import com.brooks.common.exception.BaseGlobalExceptionHandler;
import org.springframework.web.bind.annotation.ControllerAdvice;

/**
 * Global exception handler for the media service.
 * Extends the base handler to provide consistent error responses.
 */
@ControllerAdvice
public class MediaExceptionHandler extends BaseGlobalExceptionHandler {
  public MediaExceptionHandler() {
    super("media-service");
  }

  // Service-specific exception handlers can be added here if needed
}
