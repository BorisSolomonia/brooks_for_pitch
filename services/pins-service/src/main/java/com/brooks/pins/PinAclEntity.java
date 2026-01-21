package com.brooks.pins;

import com.brooks.common.jpa.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import java.util.UUID;

@Entity
@Table(name = "pin_acl")
public class PinAclEntity extends BaseEntity {
  @Column(nullable = false)
  private UUID pinId;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 10)
  private TargetType targetType;

  @Column(nullable = false)
  private UUID targetId;

  public UUID getPinId() {
    return pinId;
  }

  public void setPinId(UUID pinId) {
    this.pinId = pinId;
  }

  public TargetType getTargetType() {
    return targetType;
  }

  public void setTargetType(TargetType targetType) {
    this.targetType = targetType;
  }

  public UUID getTargetId() {
    return targetId;
  }

  public void setTargetId(UUID targetId) {
    this.targetId = targetId;
  }
}
