package com.brooks.social;

import com.brooks.common.jpa.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "friendships")
public class FriendshipEntity extends BaseEntity {
  @Column(nullable = false)
  private UUID userId;

  @Column(nullable = false)
  private UUID friendId;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private FriendshipStatus status;

  @Column(nullable = false)
  private Instant requestedAt;

  private Instant acceptedAt;

  public UUID getUserId() {
    return userId;
  }

  public void setUserId(UUID userId) {
    this.userId = userId;
  }

  public UUID getFriendId() {
    return friendId;
  }

  public void setFriendId(UUID friendId) {
    this.friendId = friendId;
  }

  public FriendshipStatus getStatus() {
    return status;
  }

  public void setStatus(FriendshipStatus status) {
    this.status = status;
  }

  public Instant getRequestedAt() {
    return requestedAt;
  }

  public void setRequestedAt(Instant requestedAt) {
    this.requestedAt = requestedAt;
  }

  public Instant getAcceptedAt() {
    return acceptedAt;
  }

  public void setAcceptedAt(Instant acceptedAt) {
    this.acceptedAt = acceptedAt;
  }
}
