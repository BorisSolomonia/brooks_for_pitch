package com.brooks.pins.service;

import com.brooks.pins.*;
import com.brooks.security.SecurityContextUtil;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ProfilePinsService {
  private final PinRepository pinRepository;
  private final PinAccessService pinAccessService;

  public ProfilePinsService(PinRepository pinRepository, PinAccessService pinAccessService) {
    this.pinRepository = pinRepository;
    this.pinAccessService = pinAccessService;
  }

  @Transactional(readOnly = true)
  public ProfileMemoriesResponse featured(UUID ownerId) {
    return new ProfileMemoriesResponse(loadVisibleMemories(ownerId, 3));
  }

  @Transactional(readOnly = true)
  public ProfileMemoriesResponse recent(UUID ownerId) {
    return new ProfileMemoriesResponse(loadVisibleMemories(ownerId, 12));
  }

  @Transactional(readOnly = true)
  public ProfileMapSummaryResponse mapSummary(UUID ownerId) {
    List<ProfileMemoryCard> visible = loadVisibleMemories(ownerId, Integer.MAX_VALUE);
    long totalCount = visible.size();
    return new ProfileMapSummaryResponse(
        totalCount,
        visible.stream().limit(40).map(ProfileMemoryCard::location).toList()
    );
  }

  private List<ProfileMemoryCard> loadVisibleMemories(UUID ownerId, int limit) {
    UUID viewerId = requireActor();
    Instant now = Instant.now();
    List<PinEntity> pins = pinRepository.findByOwnerIdAndExpiresAtAfterAndAvailableFromBeforeOrderByCreatedAtDesc(ownerId, now, now);
    Map<UUID, PinAccessService.AccessEvaluationResult> accessResults = pinAccessService.evaluateBatch(pins, viewerId, false);

    return pins.stream()
        .filter(pin -> {
          PinAccessService.AccessEvaluationResult result = accessResults.get(pin.getId());
          return result != null && result.isAllowed();
        })
        .limit(limit)
        .map(pin -> new ProfileMemoryCard(
            pin.getId().toString(),
            applyMapPrecision(pin),
            pin.getMapPrecision(),
            previewText(pin.getText()),
            pin.getAudienceType(),
            pin.getRevealType(),
            pin.getCreatedAt().toString(),
            viewerId.equals(pin.getOwnerId())
        ))
        .toList();
  }

  private LocationRequest applyMapPrecision(PinEntity pin) {
    double lat = pin.getGeom().getY();
    double lng = pin.getGeom().getX();
    if (pin.getMapPrecision() == MapPrecision.BLURRED) {
      lat = Math.round(lat * 100.0) / 100.0;
      lng = Math.round(lng * 100.0) / 100.0;
    }
    return new LocationRequest(lat, lng, pin.getAltitudeM());
  }

  private String previewText(String text) {
    if (text == null || text.isBlank()) {
      return "Untitled memory";
    }
    String normalized = text.trim().replaceAll("\\s+", " ");
    if (normalized.length() <= 140) {
      return normalized;
    }
    return normalized.substring(0, 137) + "...";
  }

  private UUID requireActor() {
    UUID actorId = SecurityContextUtil.currentUserId();
    if (actorId == null) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing user context");
    }
    return actorId;
  }
}
