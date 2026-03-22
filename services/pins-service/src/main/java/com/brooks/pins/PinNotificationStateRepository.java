package com.brooks.pins;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PinNotificationStateRepository extends JpaRepository<PinNotificationStateEntity, UUID> {
  Optional<PinNotificationStateEntity> findByPinIdAndUserId(UUID pinId, UUID userId);

  List<PinNotificationStateEntity> findByUserIdAndPinIdIn(UUID userId, Collection<UUID> pinIds);
}
