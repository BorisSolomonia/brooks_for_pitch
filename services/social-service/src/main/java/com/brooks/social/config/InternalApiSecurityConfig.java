package com.brooks.social.config;

import com.brooks.common.security.InternalApiAuthFilter;
import java.util.Set;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Security configuration for internal APIs.
 * Protects /internal/** endpoints with service-to-service authentication.
 */
@Configuration
public class InternalApiSecurityConfig {

  @Value("${internal.service.keys}")
  private Set<String> validServiceKeys;

  @Bean
  public FilterRegistrationBean<InternalApiAuthFilter> internalApiAuthFilter() {
    FilterRegistrationBean<InternalApiAuthFilter> registrationBean =
        new FilterRegistrationBean<>();

    registrationBean.setFilter(new InternalApiAuthFilter(validServiceKeys, "social-service"));
    registrationBean.addUrlPatterns("/internal/*");
    registrationBean.setOrder(1); // Execute before other filters

    return registrationBean;
  }
}
