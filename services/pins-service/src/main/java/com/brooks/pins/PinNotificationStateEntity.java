package com.brooks.pins;

import com.brooks.common.jpa.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "pin_notification_state")
public class PinNotificationStateEntity extends BaseEntity {
  @Column(nullable = false)
  private UUID pinId;

  @Column(nullable = false)
  private UUID userId;

  private Instant lastNotifiedAt;

  private Instant unlockedAt;

  public UUID getPinId() {
    return pinId;
  }

  public void setPinId(UUID pinId) {
    this.pinId = pinId;
  }

  public UUID getUserId() {
    return userId;
  }

  public void setUserId(UUID userId) {
    this.userId = userId;
  }

  public Instant getLastNotifiedAt() {
    return lastNotifiedAt;
  }

  public void setLastNotifiedAt(Instant lastNotifiedAt) {
    this.lastNotifiedAt = lastNotifiedAt;
  }

  public Instant getUnlockedAt() {
    return unlockedAt;
  }

  public void setUnlockedAt(Instant unlockedAt) {
    this.unlockedAt = unlockedAt;
  }
}
