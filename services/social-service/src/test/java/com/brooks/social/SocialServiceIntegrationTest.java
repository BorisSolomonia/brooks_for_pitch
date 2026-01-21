package com.brooks.social;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@SpringBootTest
@Testcontainers(disabledWithoutDocker = true)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class SocialServiceIntegrationTest {
  @Container
  static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>("postgres:16-alpine")
      .withDatabaseName("social_db")
      .withUsername("social_user")
      .withPassword("social_pass");

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
  FollowRepository followRepository;

  @Test
  void persistsFollow() {
    FollowEntity follow = new FollowEntity();
    follow.setFollowerId(UUID.randomUUID());
    follow.setFolloweeId(UUID.randomUUID());
    follow.setStatus(FollowStatus.ACTIVE);

    followRepository.save(follow);

    assertThat(followRepository.findById(follow.getId())).isPresent();
  }
}

