package com.brooks.media.config;

import com.brooks.common.ratelimit.RateLimitFilter;
import java.time.Duration;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Rate limiting configuration for media-service.
 * Limit: 30 requests per minute per client (strict to prevent upload abuse)
 */
@Configuration
public class RateLimitConfig {

  @Bean
  public FilterRegistrationBean<RateLimitFilter> rateLimitFilter() {
    FilterRegistrationBean<RateLimitFilter> registrationBean =
        new FilterRegistrationBean<>();

    // Strict limits for media uploads
    RateLimitFilter filter = new RateLimitFilter(
        30,                       // capacity: 30 tokens
        30,                       // refill: 30 tokens
        Duration.ofMinutes(1),    // duration: per minute
        "media-service"           // service name for audit logging
    );

    registrationBean.setFilter(filter);
    registrationBean.addUrlPatterns("/*");
    registrationBean.setOrder(2);

    return registrationBean;
  }
}
