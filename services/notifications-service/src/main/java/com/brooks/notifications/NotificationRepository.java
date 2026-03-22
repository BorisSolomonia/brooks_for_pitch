package com.brooks.notifications;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<NotificationEntity, UUID> {
  List<NotificationEntity> findByUserIdOrderByCreatedAtDesc(UUID userId);

  long countByUserIdAndReadFalse(UUID userId);
}
