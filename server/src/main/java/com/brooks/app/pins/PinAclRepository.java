package com.brooks.app.pins;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PinAclRepository extends JpaRepository<PinAclEntity, UUID> {
  List<PinAclEntity> findByPinId(UUID pinId);
}
