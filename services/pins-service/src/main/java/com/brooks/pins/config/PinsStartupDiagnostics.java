package com.brooks.pins.config;

import java.net.InetAddress;
import java.net.URI;
import java.sql.Connection;
import java.sql.Statement;
import javax.sql.DataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.data.redis.connection.RedisConnection;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.stereotype.Component;

@Component
public class PinsStartupDiagnostics {
  private static final Logger log = LoggerFactory.getLogger(PinsStartupDiagnostics.class);

  private final ObjectProvider<DataSource> dataSourceProvider;
  private final ObjectProvider<RedisConnectionFactory> redisConnectionFactoryProvider;
  private final String serverPort;
  private final String pinsDbUrl;
  private final String redisHost;
  private final String redisPort;
  private final String socialServiceUrl;
  private final String listsServiceUrl;
  private final String auth0IssuerUri;
  private final String auth0Audience;
  private final String webOrigins;
  private final String internalServiceName;
  private final String internalServiceKey;

  public PinsStartupDiagnostics(
      ObjectProvider<DataSource> dataSourceProvider,
      ObjectProvider<RedisConnectionFactory> redisConnectionFactoryProvider,
      @Value("${server.port}") String serverPort,
      @Value("${spring.datasource.url}") String pinsDbUrl,
      @Value("${spring.data.redis.host}") String redisHost,
      @Value("${spring.data.redis.port}") String redisPort,
      @Value("${brooks.social.base-url}") String socialServiceUrl,
      @Value("${brooks.lists.base-url}") String listsServiceUrl,
      @Value("${auth0.issuer-uri}") String auth0IssuerUri,
      @Value("${auth0.audience}") String auth0Audience,
      @Value("${brooks.web.origins}") String webOrigins,
      @Value("${internal.service.name}") String internalServiceName,
      @Value("${internal.service.key}") String internalServiceKey
  ) {
    this.dataSourceProvider = dataSourceProvider;
    this.redisConnectionFactoryProvider = redisConnectionFactoryProvider;
    this.serverPort = serverPort;
    this.pinsDbUrl = pinsDbUrl;
    this.redisHost = redisHost;
    this.redisPort = redisPort;
    this.socialServiceUrl = socialServiceUrl;
    this.listsServiceUrl = listsServiceUrl;
    this.auth0IssuerUri = auth0IssuerUri;
    this.auth0Audience = auth0Audience;
    this.webOrigins = webOrigins;
    this.internalServiceName = internalServiceName;
    this.internalServiceKey = internalServiceKey;
  }

  @EventListener(ApplicationReadyEvent.class)
  public void logDiagnostics() {
    log.info(
        "pins-service ready: port={}, dbUrl={}, redis={}:{}, socialBaseUrl={}, listsBaseUrl={}, auth0Issuer={}, auth0Audience={}, webOrigins={}, internalServiceName={}, internalServiceKeyPresent={}",
        serverPort,
        sanitizeJdbcUrl(pinsDbUrl),
        redisHost,
        redisPort,
        socialServiceUrl,
        listsServiceUrl,
        auth0IssuerUri,
        auth0Audience,
        webOrigins,
        internalServiceName,
        internalServiceKey != null && !internalServiceKey.isBlank()
    );

    logHostResolution("redis", redisHost);
    logUrlResolution("social-service", socialServiceUrl);
    logUrlResolution("lists-service", listsServiceUrl);
    logDatabaseProbe();
    logRedisProbe();
  }

  private void logDatabaseProbe() {
    DataSource dataSource = dataSourceProvider.getIfAvailable();
    if (dataSource == null) {
      log.error("startup probe: DataSource bean is unavailable");
      return;
    }

    try (Connection connection = dataSource.getConnection();
         Statement statement = connection.createStatement()) {
      statement.execute("SELECT 1");
      log.info("startup probe: database connectivity OK");
    } catch (Exception ex) {
      log.error("startup probe: database connectivity FAILED for {}", sanitizeJdbcUrl(pinsDbUrl), ex);
    }
  }

  private void logRedisProbe() {
    RedisConnectionFactory factory = redisConnectionFactoryProvider.getIfAvailable();
    if (factory == null) {
      log.error("startup probe: RedisConnectionFactory bean is unavailable");
      return;
    }

    try (RedisConnection connection = factory.getConnection()) {
      String pong = connection.ping();
      log.info("startup probe: redis connectivity OK (ping={})", pong);
    } catch (Exception ex) {
      log.error("startup probe: redis connectivity FAILED for {}:{}", redisHost, redisPort, ex);
    }
  }

  private void logUrlResolution(String label, String rawUrl) {
    try {
      URI uri = URI.create(rawUrl);
      String host = uri.getHost();
      if (host == null || host.isBlank()) {
        log.error("startup probe: {} URL has no host component: {}", label, rawUrl);
        return;
      }
      logHostResolution(label, host);
    } catch (Exception ex) {
      log.error("startup probe: failed to parse {} URL {}", label, rawUrl, ex);
    }
  }

  private void logHostResolution(String label, String host) {
    try {
      InetAddress[] addresses = InetAddress.getAllByName(host);
      StringBuilder joined = new StringBuilder();
      for (int i = 0; i < addresses.length; i++) {
        if (i > 0) {
          joined.append(", ");
        }
        joined.append(addresses[i].getHostAddress());
      }
      log.info("startup probe: {} host {} resolved to {}", label, host, joined);
    } catch (Exception ex) {
      log.error("startup probe: {} host resolution FAILED for {}", label, host, ex);
    }
  }

  private String sanitizeJdbcUrl(String url) {
    return url.replaceAll("(password=)[^&]+", "$1***");
  }
}
