package com.brooks.moderation.config;

import com.brooks.common.ratelimit.RateLimitFilter;
import java.time.Duration;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Rate limiting configuration for moderation-service.
 * Limit: 50 requests per minute per client (moderate to prevent abuse reporting spam)
 */
@Configuration
public class RateLimitConfig {

  @Bean
  public FilterRegistrationBean<RateLimitFilter> rateLimitFilter() {
    FilterRegistrationBean<RateLimitFilter> registrationBean =
        new FilterRegistrationBean<>();

    // Moderate limits to prevent report spam
    RateLimitFilter filter = new RateLimitFilter(
        50,                       // capacity: 50 tokens
        50,                       // refill: 50 tokens
        Duration.ofMinutes(1),    // duration: per minute
        "moderation-service"      // service name for audit logging
    );

    registrationBean.setFilter(filter);
    registrationBean.addUrlPatterns("/*");
    registrationBean.setOrder(2);

    return registrationBean;
  }
}
