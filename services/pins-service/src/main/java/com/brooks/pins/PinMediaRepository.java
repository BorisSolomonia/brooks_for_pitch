package com.brooks.pins;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PinMediaRepository extends JpaRepository<PinMediaEntity, UUID> {
  List<PinMediaEntity> findByPinId(UUID pinId);
}
