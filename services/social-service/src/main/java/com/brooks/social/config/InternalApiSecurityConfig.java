package com.brooks.social.config;

import com.brooks.common.security.InternalApiAuthFilter;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
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

  @Value("${internal.service.allowed-names:}")
  private String allowedServiceNamesRaw;

  @Value("${internal.service.key-map:}")
  private String keyMapRaw;

  @Bean
  public FilterRegistrationBean<InternalApiAuthFilter> internalApiAuthFilter() {
    FilterRegistrationBean<InternalApiAuthFilter> registrationBean =
        new FilterRegistrationBean<>();

    Map<String, Set<String>> keysByService = parseKeyMap(keyMapRaw);
    Set<String> allowedServiceNames = resolveAllowedNames(keysByService, allowedServiceNamesRaw);
    registrationBean.setFilter(new InternalApiAuthFilter(
        validServiceKeys,
        keysByService,
        allowedServiceNames,
        "social-service"
    ));
    registrationBean.addUrlPatterns("/internal/*");
    registrationBean.setOrder(1); // Execute before other filters

    return registrationBean;
  }

  private Map<String, Set<String>> parseKeyMap(String raw) {
    Map<String, Set<String>> map = new HashMap<>();
    if (raw == null || raw.isBlank()) {
      return map;
    }
    String[] entries = raw.split(",");
    for (String entry : entries) {
      String trimmed = entry.trim();
      if (trimmed.isEmpty()) {
        continue;
      }
      String[] parts = trimmed.split("=", 2);
      if (parts.length != 2) {
        continue;
      }
      String serviceName = parts[0].trim();
      if (serviceName.isEmpty()) {
        continue;
      }
      Set<String> keys = Arrays.stream(parts[1].split("\\|"))
          .map(String::trim)
          .filter(value -> !value.isEmpty())
          .collect(Collectors.toCollection(HashSet::new));
      if (!keys.isEmpty()) {
        map.put(serviceName, keys);
      }
    }
    return map;
  }

  private Set<String> resolveAllowedNames(
      Map<String, Set<String>> keysByService,
      String allowedNamesRaw
  ) {
    if (keysByService != null && !keysByService.isEmpty()) {
      return new HashSet<>(keysByService.keySet());
    }
    if (allowedNamesRaw == null || allowedNamesRaw.isBlank()) {
      return Set.of();
    }
    return Arrays.stream(allowedNamesRaw.split(","))
        .map(String::trim)
        .filter(value -> !value.isEmpty())
        .collect(Collectors.toCollection(HashSet::new));
  }
}
