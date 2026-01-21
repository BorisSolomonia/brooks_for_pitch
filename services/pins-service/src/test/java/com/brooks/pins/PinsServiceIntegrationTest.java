package com.brooks.pins;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.utility.DockerImageName;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@SpringBootTest
@Testcontainers(disabledWithoutDocker = true)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class PinsServiceIntegrationTest {
  @Container
  static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>(
      DockerImageName.parse("postgis/postgis:16-3.4").asCompatibleSubstituteFor("postgres"))
      .withDatabaseName("pins_db")
      .withUsername("pins_user")
      .withPassword("pins_pass");

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
  PinRepository pinRepository;

  @Test
  void persistsPinAndQueriesBucket() {
    GeometryFactory factory = new GeometryFactory();
    PinEntity pin = new PinEntity();
    pin.setOwnerId(UUID.randomUUID());
    pin.setText("Hello");
    pin.setAudienceType(AudienceType.PUBLIC);
    pin.setAvailableFrom(Instant.now().minusSeconds(60));
    pin.setExpiresAt(Instant.now().plusSeconds(3600));
    pin.setRevealType(RevealType.VISIBLE_ALWAYS);
    pin.setMapPrecision(MapPrecision.EXACT);
    pin.setNotifyCooldownSeconds(3600);
    pin.setNotifyRepeatable(false);
    pin.setFutureSelf(false);
    pin.setBucket("0.00000:0.00000");
    pin.setGeom(factory.createPoint(new Coordinate(0.0, 0.0)));

    pinRepository.save(pin);

    List<PinEntity> found = pinRepository.findByBucketInAndExpiresAtAfterAndAvailableFromBefore(
        List.of("0.00000:0.00000"), Instant.now(), Instant.now());
    assertThat(found).isNotEmpty();
  }
}

