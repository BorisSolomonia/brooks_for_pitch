package com.brooks.pins;

import com.brooks.common.jpa.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.Polygon;

@Entity
@Table(name = "pins")
public class PinEntity extends BaseEntity {
  @Column(nullable = false)
  private UUID ownerId;

  @Column(nullable = false)
  private String text;

  private String linkUrl;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private AudienceType audienceType;

  @Column(nullable = false)
  private Instant availableFrom;

  @Column(nullable = false)
  private Instant expiresAt;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private RevealType revealType;

  @Column(name = "reveal_radius_m")
  private Integer revealRadiusM;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private MapPrecision mapPrecision;

  @Column(name = "notify_radius_m")
  private Integer notifyRadiusM;

  @Column(nullable = false)
  private Integer notifyCooldownSeconds;

  @Column(nullable = false)
  private boolean notifyRepeatable;

  @Column(nullable = false)
  private boolean futureSelf;

  @Column(name = "altitude_m")
  private Double altitudeM;

  @Column(nullable = false)
  private String bucket;

  @Column(nullable = false, columnDefinition = "geometry(Point,4326)")
  private Point geom;

  @Column(columnDefinition = "geometry(Polygon,4326)")
  private Polygon mysteryGeom;

  public UUID getOwnerId() {
    return ownerId;
  }

  public void setOwnerId(UUID ownerId) {
    this.ownerId = ownerId;
  }

  public String getText() {
    return text;
  }

  public void setText(String text) {
    this.text = text;
  }

  public String getLinkUrl() {
    return linkUrl;
  }

  public void setLinkUrl(String linkUrl) {
    this.linkUrl = linkUrl;
  }

  public AudienceType getAudienceType() {
    return audienceType;
  }

  public void setAudienceType(AudienceType audienceType) {
    this.audienceType = audienceType;
  }

  public Instant getAvailableFrom() {
    return availableFrom;
  }

  public void setAvailableFrom(Instant availableFrom) {
    this.availableFrom = availableFrom;
  }

  public Instant getExpiresAt() {
    return expiresAt;
  }

  public void setExpiresAt(Instant expiresAt) {
    this.expiresAt = expiresAt;
  }

  public RevealType getRevealType() {
    return revealType;
  }

  public void setRevealType(RevealType revealType) {
    this.revealType = revealType;
  }

  public Integer getRevealRadiusM() {
    return revealRadiusM;
  }

  public void setRevealRadiusM(Integer revealRadiusM) {
    this.revealRadiusM = revealRadiusM;
  }

  public MapPrecision getMapPrecision() {
    return mapPrecision;
  }

  public void setMapPrecision(MapPrecision mapPrecision) {
    this.mapPrecision = mapPrecision;
  }

  public Integer getNotifyRadiusM() {
    return notifyRadiusM;
  }

  public void setNotifyRadiusM(Integer notifyRadiusM) {
    this.notifyRadiusM = notifyRadiusM;
  }

  public Integer getNotifyCooldownSeconds() {
    return notifyCooldownSeconds;
  }

  public void setNotifyCooldownSeconds(Integer notifyCooldownSeconds) {
    this.notifyCooldownSeconds = notifyCooldownSeconds;
  }

  public boolean isNotifyRepeatable() {
    return notifyRepeatable;
  }

  public void setNotifyRepeatable(boolean notifyRepeatable) {
    this.notifyRepeatable = notifyRepeatable;
  }

  public boolean isFutureSelf() {
    return futureSelf;
  }

  public void setFutureSelf(boolean futureSelf) {
    this.futureSelf = futureSelf;
  }

  public Double getAltitudeM() {
    return altitudeM;
  }

  public void setAltitudeM(Double altitudeM) {
    this.altitudeM = altitudeM;
  }

  public String getBucket() {
    return bucket;
  }

  public void setBucket(String bucket) {
    this.bucket = bucket;
  }

  public Point getGeom() {
    return geom;
  }

  public void setGeom(Point geom) {
    this.geom = geom;
  }

  public Polygon getMysteryGeom() {
    return mysteryGeom;
  }

  public void setMysteryGeom(Polygon mysteryGeom) {
    this.mysteryGeom = mysteryGeom;
  }
}
