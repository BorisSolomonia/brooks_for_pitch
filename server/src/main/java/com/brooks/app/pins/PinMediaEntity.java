package com.brooks.app.pins;

import com.brooks.app.common.jpa.BaseEntity;
import com.brooks.app.common.model.MediaType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import java.util.UUID;

@Entity
@Table(name = "pin_media")
public class PinMediaEntity extends BaseEntity {
  @Column(nullable = false)
  private UUID pinId;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private MediaType mediaType;

  @Column(nullable = false)
  private String storageKey;

  @Column(nullable = false)
  private String url;

  @Column(nullable = false)
  private int sortOrder;

  public UUID getPinId() {
    return pinId;
  }

  public void setPinId(UUID pinId) {
    this.pinId = pinId;
  }

  public MediaType getMediaType() {
    return mediaType;
  }

  public void setMediaType(MediaType mediaType) {
    this.mediaType = mediaType;
  }

  public String getStorageKey() {
    return storageKey;
  }

  public void setStorageKey(String storageKey) {
    this.storageKey = storageKey;
  }

  public String getUrl() {
    return url;
  }

  public void setUrl(String url) {
    this.url = url;
  }

  public int getSortOrder() {
    return sortOrder;
  }

  public void setSortOrder(int sortOrder) {
    this.sortOrder = sortOrder;
  }
}
