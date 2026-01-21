package com.brooks.social;

import com.brooks.common.jpa.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import java.util.UUID;

@Entity
@Table(name = "follows")
public class FollowEntity extends BaseEntity {
  @Column(nullable = false)
  private UUID followerId;

  @Column(nullable = false)
  private UUID followeeId;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private FollowStatus status;

  public UUID getFollowerId() {
    return followerId;
  }

  public void setFollowerId(UUID followerId) {
    this.followerId = followerId;
  }

  public UUID getFolloweeId() {
    return followeeId;
  }

  public void setFolloweeId(UUID followeeId) {
    this.followeeId = followeeId;
  }

  public FollowStatus getStatus() {
    return status;
  }

  public void setStatus(FollowStatus status) {
    this.status = status;
  }
}
