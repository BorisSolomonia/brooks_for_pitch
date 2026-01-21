package com.brooks.app.social;

import com.brooks.app.common.jpa.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.util.UUID;

@Entity
@Table(name = "relationship_preferences")
public class RelationshipPreferenceEntity extends BaseEntity {
  @Column(nullable = false)
  private UUID viewerId;

  @Column(nullable = false)
  private UUID subjectId;

  @Column(nullable = false)
  private boolean canSeePins;

  @Column(nullable = false)
  private boolean canReceiveProximityNotifications;

  public UUID getViewerId() {
    return viewerId;
  }

  public void setViewerId(UUID viewerId) {
    this.viewerId = viewerId;
  }

  public UUID getSubjectId() {
    return subjectId;
  }

  public void setSubjectId(UUID subjectId) {
    this.subjectId = subjectId;
  }

  public boolean isCanSeePins() {
    return canSeePins;
  }

  public void setCanSeePins(boolean canSeePins) {
    this.canSeePins = canSeePins;
  }

  public boolean isCanReceiveProximityNotifications() {
    return canReceiveProximityNotifications;
  }

  public void setCanReceiveProximityNotifications(boolean canReceiveProximityNotifications) {
    this.canReceiveProximityNotifications = canReceiveProximityNotifications;
  }
}
