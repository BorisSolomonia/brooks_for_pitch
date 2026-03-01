package com.brooks.pins.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class RequestLoggingFilter extends OncePerRequestFilter {
  private static final Logger log = LoggerFactory.getLogger(RequestLoggingFilter.class);

  @Override
  protected void doFilterInternal(
      HttpServletRequest request,
      HttpServletResponse response,
      FilterChain filterChain
  ) throws ServletException, IOException {
    String requestId = UUID.randomUUID().toString().substring(0, 8);
    long startedAt = System.currentTimeMillis();
    String uri = request.getRequestURI();
    String query = request.getQueryString();
    String target = query == null ? uri : uri + "?" + query;
    String cfRay = headerOrDash(request, "CF-Ray");
    String forwardedFor = headerOrDash(request, "X-Forwarded-For");
    String userAgent = headerOrDash(request, "User-Agent");

    log.info(
        "request start id={} method={} path={} remoteAddr={} xForwardedFor={} cfRay={} userAgent={}",
        requestId,
        request.getMethod(),
        target,
        request.getRemoteAddr(),
        forwardedFor,
        cfRay,
        userAgent
    );

    try {
      filterChain.doFilter(request, response);
      long durationMs = System.currentTimeMillis() - startedAt;
      log.info(
          "request end id={} method={} path={} status={} durationMs={}",
          requestId,
          request.getMethod(),
          target,
          response.getStatus(),
          durationMs
      );
    } catch (Exception ex) {
      long durationMs = System.currentTimeMillis() - startedAt;
      log.error(
          "request failed id={} method={} path={} durationMs={} message={}",
          requestId,
          request.getMethod(),
          target,
          durationMs,
          ex.getMessage(),
          ex
      );
      throw ex;
    }
  }

  private String headerOrDash(HttpServletRequest request, String name) {
    String value = request.getHeader(name);
    return value == null || value.isBlank() ? "-" : value;
  }
}
