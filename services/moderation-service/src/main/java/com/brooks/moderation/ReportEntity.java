package com.brooks.moderation;

import com.brooks.common.jpa.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.util.UUID;

@Entity
@Table(name = "reports")
public class ReportEntity extends BaseEntity {
  @Column(nullable = false)
  private UUID reporterId;

  @Column(nullable = false, length = 20)
  private String targetType;

  @Column(nullable = false)
  private UUID targetId;

  @Column(nullable = false, length = 50)
  private String reason;

  private String details;

  public UUID getReporterId() {
    return reporterId;
  }

  public void setReporterId(UUID reporterId) {
    this.reporterId = reporterId;
  }

  public String getTargetType() {
    return targetType;
  }

  public void setTargetType(String targetType) {
    this.targetType = targetType;
  }

  public UUID getTargetId() {
    return targetId;
  }

  public void setTargetId(UUID targetId) {
    this.targetId = targetId;
  }

  public String getReason() {
    return reason;
  }

  public void setReason(String reason) {
    this.reason = reason;
  }

  public String getDetails() {
    return details;
  }

  public void setDetails(String details) {
    this.details = details;
  }
}
