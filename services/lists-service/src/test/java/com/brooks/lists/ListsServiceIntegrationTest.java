package com.brooks.lists;

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
class ListsServiceIntegrationTest {
  @Container
  static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>("postgres:16-alpine")
      .withDatabaseName("lists_db")
      .withUsername("lists_user")
      .withPassword("lists_pass");

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
  ListRepository listRepository;

  @Test
  void persistsList() {
    ListEntity list = new ListEntity();
    list.setOwnerId(UUID.randomUUID());
    list.setListType(ListType.FRIEND);
    list.setName("Family");

    listRepository.save(list);

    assertThat(listRepository.findById(list.getId())).isPresent();
  }
}

