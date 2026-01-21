package com.brooks.moderation;

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
class ModerationServiceIntegrationTest {
  @Container
  static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>("postgres:16-alpine")
      .withDatabaseName("moderation_db")
      .withUsername("moderation_user")
      .withPassword("moderation_pass");

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
  ReportRepository reportRepository;

  @Test
  void persistsReport() {
    ReportEntity report = new ReportEntity();
    report.setReporterId(UUID.randomUUID());
    report.setTargetType("PIN");
    report.setTargetId(UUID.randomUUID());
    report.setReason("SPAM");

    reportRepository.save(report);

    assertThat(reportRepository.findById(report.getId())).isPresent();
  }
}

