package com.brooks.auth.config;

import com.brooks.common.ratelimit.RateLimitFilter;
import java.time.Duration;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Rate limiting configuration for auth-service.
 * Limits login attempts to prevent brute force attacks.
 *
 * Limit: 20 requests per minute per client (stricter for auth)
 */
@Configuration
public class RateLimitConfig {

  @Bean
  public FilterRegistrationBean<RateLimitFilter> rateLimitFilter() {
    FilterRegistrationBean<RateLimitFilter> registrationBean =
        new FilterRegistrationBean<>();

    // Stricter limits for authentication service
    RateLimitFilter filter = new RateLimitFilter(
        20,                       // capacity: 20 tokens
        20,                       // refill: 20 tokens
        Duration.ofMinutes(1),    // duration: per minute
        "auth-service"            // service name for audit logging
    );

    registrationBean.setFilter(filter);
    registrationBean.addUrlPatterns("/*");
    registrationBean.setOrder(2); // After internal auth filter

    return registrationBean;
  }
}
