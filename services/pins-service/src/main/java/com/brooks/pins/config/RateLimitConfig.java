package com.brooks.pins.config;

import com.brooks.common.ratelimit.RateLimitFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Rate limiting configuration for pins-service.
 * Limit: 100 requests per minute per client
 */
@Configuration
public class RateLimitConfig {

  @Bean
  public FilterRegistrationBean<RateLimitFilter> rateLimitFilter() {
    FilterRegistrationBean<RateLimitFilter> registrationBean =
        new FilterRegistrationBean<>();

    registrationBean.setFilter(new RateLimitFilter()); // Default: 100 req/min
    registrationBean.addUrlPatterns("/*");
    registrationBean.setOrder(2);

    return registrationBean;
  }
}
