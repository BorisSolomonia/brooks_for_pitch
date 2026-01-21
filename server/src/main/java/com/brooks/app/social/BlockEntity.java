package com.brooks.app.social;

import com.brooks.app.common.jpa.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.util.UUID;

@Entity
@Table(name = "blocks")
public class BlockEntity extends BaseEntity {
  @Column(nullable = false)
  private UUID blockerId;

  @Column(nullable = false)
  private UUID blockedId;

  public UUID getBlockerId() {
    return blockerId;
  }

  public void setBlockerId(UUID blockerId) {
    this.blockerId = blockerId;
  }

  public UUID getBlockedId() {
    return blockedId;
  }

  public void setBlockedId(UUID blockedId) {
    this.blockedId = blockedId;
  }
}
