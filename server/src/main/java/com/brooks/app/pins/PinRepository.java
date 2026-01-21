package com.brooks.app.pins;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PinRepository extends JpaRepository<PinEntity, UUID> {
  List<PinEntity> findByExpiresAtAfterAndAvailableFromBefore(Instant now1, Instant now2);
}
