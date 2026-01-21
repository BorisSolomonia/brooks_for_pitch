package com.brooks.auth;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootTest
@Testcontainers(disabledWithoutDocker = true)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class AuthServiceIntegrationTest {
  @Container
  static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>("postgres:16-alpine")
      .withDatabaseName("auth_db")
      .withUsername("auth_user")
      .withPassword("auth_pass");

  @DynamicPropertySource
  static void registerProps(DynamicPropertyRegistry registry) {
    registry.add("spring.datasource.url", POSTGRES::getJdbcUrl);
    registry.add("spring.datasource.username", POSTGRES::getUsername);
    registry.add("spring.datasource.password", POSTGRES::getPassword);
    registry.add("brooks.jwt.secret", () -> "change-me-change-me-change-me-change");
    registry.add("brooks.jwt.issuer", () -> "brooks-test");
    registry.add("brooks.jwt.access-ttl-seconds", () -> "900");
  }

  @Autowired
  UserRepository userRepository;

  @Autowired
  PasswordEncoder passwordEncoder;

  @Test
  void persistsUser() {
    UserEntity user = new UserEntity();
    user.setEmail("test@example.com");
    user.setHandle("tester");
    user.setDisplayName("Test User");
    user.setPasswordHash(passwordEncoder.encode("secret"));
    user.setStatus("ACTIVE");

    userRepository.save(user);

    assertThat(userRepository.findByEmail("test@example.com")).isPresent();
  }
}

