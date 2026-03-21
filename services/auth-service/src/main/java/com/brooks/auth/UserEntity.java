package com.brooks.auth;

import com.brooks.common.jpa.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "users")
public class UserEntity extends BaseEntity {
  @Column(nullable = false, unique = true, length = 320)
  private String email;

  @Column(nullable = false, unique = true, length = 32)
  private String handle;

  @Column(nullable = false, length = 120)
  private String displayName;

  @Column(length = 500)
  private String avatarUrl;

  @Column(length = 280)
  private String bio;

  @Column(columnDefinition = "TEXT")
  private String about;

  @Column(length = 80)
  private String pronouns;

  @Column(length = 120)
  private String locationLabel;

  @Column(length = 320)
  private String websiteUrl;

  @Column(nullable = false)
  private String passwordHash;

  @Column(nullable = false, length = 20)
  private String status;

  private Instant deletedAt;

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getHandle() {
    return handle;
  }

  public void setHandle(String handle) {
    this.handle = handle;
  }

  public String getDisplayName() {
    return displayName;
  }

  public void setDisplayName(String displayName) {
    this.displayName = displayName;
  }

  public String getAvatarUrl() {
    return avatarUrl;
  }

  public void setAvatarUrl(String avatarUrl) {
    this.avatarUrl = avatarUrl;
  }

  public String getBio() {
    return bio;
  }

  public void setBio(String bio) {
    this.bio = bio;
  }

  public String getAbout() {
    return about;
  }

  public void setAbout(String about) {
    this.about = about;
  }

  public String getPronouns() {
    return pronouns;
  }

  public void setPronouns(String pronouns) {
    this.pronouns = pronouns;
  }

  public String getLocationLabel() {
    return locationLabel;
  }

  public void setLocationLabel(String locationLabel) {
    this.locationLabel = locationLabel;
  }

  public String getWebsiteUrl() {
    return websiteUrl;
  }

  public void setWebsiteUrl(String websiteUrl) {
    this.websiteUrl = websiteUrl;
  }

  public String getPasswordHash() {
    return passwordHash;
  }

  public void setPasswordHash(String passwordHash) {
    this.passwordHash = passwordHash;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public Instant getDeletedAt() {
    return deletedAt;
  }

  public void setDeletedAt(Instant deletedAt) {
    this.deletedAt = deletedAt;
  }
}
