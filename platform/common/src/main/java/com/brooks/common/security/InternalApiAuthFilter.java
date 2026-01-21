package com.brooks.common.security;

import com.brooks.common.audit.AuditLogger;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Set;
import org.springframework.http.HttpStatus;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Filter to protect internal service-to-service API endpoints.
 * Validates the X-Internal-Service-Key header against configured service keys.
 *
 * Usage:
 * 1. Configure service keys in application.yml
 * 2. Register this filter for /internal/** paths
 * 3. Client services include X-Internal-Service-Key header
 */
public class InternalApiAuthFilter extends OncePerRequestFilter {
  private static final String HEADER_NAME = "X-Internal-Service-Key";
  private static final String HEADER_SERVICE_NAME = "X-Service-Name";

  private final Set<String> validServiceKeys;
  private final AuditLogger auditLogger;

  public InternalApiAuthFilter(Set<String> validServiceKeys, String serviceName) {
    this.validServiceKeys = validServiceKeys;
    this.auditLogger = new AuditLogger(serviceName);
  }

  @Override
  protected void doFilterInternal(
      HttpServletRequest request,
      HttpServletResponse response,
      FilterChain filterChain
  ) throws ServletException, IOException {
    String serviceKey = request.getHeader(HEADER_NAME);
    String serviceName = request.getHeader(HEADER_SERVICE_NAME);

    if (serviceKey == null || serviceKey.isBlank()) {
      auditLogger.logAccessDenied("unknown", request.getRemoteAddr(),
          "internal_api_call", "Missing service key");
      sendUnauthorized(response, "Missing internal service authentication");
      return;
    }

    if (serviceName == null || serviceName.isBlank()) {
      auditLogger.logAccessDenied("unknown", request.getRemoteAddr(),
          "internal_api_call", "Missing service name");
      sendUnauthorized(response, "Missing service name");
      return;
    }

    if (!validServiceKeys.contains(serviceKey)) {
      auditLogger.logAccessDenied(serviceName, request.getRemoteAddr(),
          "internal_api_call", "Invalid service credentials");
      sendUnauthorized(response, "Invalid service credentials");
      return;
    }

    filterChain.doFilter(request, response);
  }

  @Override
  protected boolean shouldNotFilter(HttpServletRequest request) {
    String path = request.getRequestURI();
    return !path.startsWith("/internal/");
  }

  private void sendUnauthorized(HttpServletResponse response, String message) throws IOException {
    response.setStatus(HttpStatus.UNAUTHORIZED.value());
    response.setContentType("application/json");
    response.getWriter().write(String.format(
        "{\"error\":\"Unauthorized\",\"message\":\"%s\"}",
        message
    ));
  }
}
