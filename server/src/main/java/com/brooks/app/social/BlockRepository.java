package com.brooks.app.social;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BlockRepository extends JpaRepository<BlockEntity, UUID> {
  Optional<BlockEntity> findByBlockerIdAndBlockedId(UUID blockerId, UUID blockedId);
}
