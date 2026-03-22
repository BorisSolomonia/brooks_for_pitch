package com.brooks.pins;

import com.brooks.pins.client.NotificationsClient;
import com.brooks.pins.service.PinAccessService;
import com.brooks.pins.service.ProximityService;
import com.brooks.security.SecurityContextUtil;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.PrecisionModel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

/**
 * Refactored Pin service focused on core CRUD operations.
 * Delegates to:
 * - PinAccessService for access control evaluation
 * - ProximityService for spatial queries and candidate selection
 * - Service clients for inter-service communication
 */
@Service
public class PinServiceRefactored {
  private static final Logger log = LoggerFactory.getLogger(PinServiceRefactored.class);

  private final PinRepository pinRepository;
  private final PinAclRepository pinAclRepository;
  private final PinNotificationStateRepository pinNotificationStateRepository;
  private final PinAccessService pinAccessService;
  private final ProximityService proximityService;
  private final NotificationsClient notificationsClient;
  private final LocationBucket locationBucket;
  private final GeometryFactory geometryFactory;

  public PinServiceRefactored(
      PinRepository pinRepository,
      PinAclRepository pinAclRepository,
      PinNotificationStateRepository pinNotificationStateRepository,
      PinAccessService pinAccessService,
      ProximityService proximityService,
      NotificationsClient notificationsClient,
      @Value("${brooks.proximity.bucket-size-deg}") double bucketSizeDeg
  ) {
    this.pinRepository = pinRepository;
    this.pinAclRepository = pinAclRepository;
    this.pinNotificationStateRepository = pinNotificationStateRepository;
    this.pinAccessService = pinAccessService;
    this.proximityService = proximityService;
    this.notificationsClient = notificationsClient;
    this.locationBucket = new LocationBucket(bucketSizeDeg);
    this.geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);
  }

  /**
   * Creates a new pin with the given properties.
   * Validates business rules (future-self constraints) and creates ACL entries.
   *
   * @param request Pin creation request
   * @return Pin creation response with ID
   */
  @Transactional
  public PinResponse create(PinCreateRequest request) {
    UUID ownerId = requireActor();
    Instant now = Instant.now();

    // Validate future-self constraints
    validateFutureSelfConstraints(request);

    // Create pin entity
    PinEntity pin = buildPinEntity(request, ownerId, now);
    PinEntity saved = pinRepository.save(pin);

    // Create ACL entries
    createAclEntries(saved.getId(), request.acl());

    return new PinResponse(saved.getId().toString(), "CREATED");
  }

  /**
   * Returns pins visible to the viewer within a map bounding box.
   * Applies access control and map precision.
   *
   * @param bbox Bounding box string (minLng,minLat,maxLng,maxLat)
   * @return Response with visible pins
   */
  public MapPinsResponse mapPins(String bbox, PinMapScope scope) {
    UUID viewerId = requireActor();
    double[] bounds = parseBbox(bbox);

    List<MapPin> pins = switch (scope) {
      case HOME -> proximityService.findPinsInBoundingBox(viewerId, bounds);
      case MINE -> proximityService.findOwnPinsInBoundingBox(viewerId, bounds);
      case FRIENDS -> proximityService.findFriendPinsInBoundingBox(viewerId, bounds);
    };
    return new MapPinsResponse(pins);
  }

  /**
   * Returns pin candidates for geofence registration.
   * Used by the client to set up proximity-based discovery.
   *
   * @param bucket Location bucket identifier
   * @return Pin candidates with zones but not content
   */
  public PinCandidatesResponse candidates(String bucket) {
    UUID viewerId = requireActor();

    List<PinCandidate> candidates = proximityService.findCandidatesInBucket(viewerId, bucket);
    return new PinCandidatesResponse(candidates);
  }

  /**
   * Batch proximity check: finds REACH_TO_REVEAL pins near the viewer
   * that haven't been unlocked yet, unlocks them, sends notifications,
   * and returns newly revealed pins.
   */
  @Transactional
  public ProximityCheckResponse proximityCheck(ProximityCheckRequest request) {
    UUID viewerId = requireActor();
    LocationRequest viewerLocation = request.location();
    String bucket = locationBucket.bucket(viewerLocation.lat(), viewerLocation.lng());
    Instant now = Instant.now();

    // Query neighboring buckets for candidate pins
    List<String> buckets = locationBucket.neighbors(bucket);
    List<PinEntity> candidatePins = pinRepository.findByBucketInAndExpiresAtAfterAndAvailableFromBefore(
        buckets, now, now
    );

    // Filter to REACH_TO_REVEAL pins not owned by viewer
    List<PinEntity> reachToRevealPins = candidatePins.stream()
        .filter(pin -> pin.getRevealType() == RevealType.REACH_TO_REVEAL)
        .filter(pin -> !viewerId.equals(pin.getOwnerId()))
        .collect(Collectors.toList());

    if (reachToRevealPins.isEmpty()) {
      return new ProximityCheckResponse(List.of());
    }

    // Batch evaluate access control
    Map<UUID, PinAccessService.AccessEvaluationResult> accessResults =
        pinAccessService.evaluateBatch(reachToRevealPins, viewerId, false);

    // Filter to allowed pins
    List<PinEntity> allowedPins = reachToRevealPins.stream()
        .filter(pin -> {
          PinAccessService.AccessEvaluationResult result = accessResults.get(pin.getId());
          return result != null && result.isAllowed();
        })
        .collect(Collectors.toList());

    if (allowedPins.isEmpty()) {
      return new ProximityCheckResponse(List.of());
    }

    // Check which are already unlocked
    List<UUID> allowedPinIds = allowedPins.stream().map(PinEntity::getId).collect(Collectors.toList());
    Set<UUID> alreadyUnlocked = pinNotificationStateRepository
        .findByUserIdAndPinIdIn(viewerId, allowedPinIds)
        .stream()
        .filter(state -> state.getUnlockedAt() != null)
        .map(PinNotificationStateEntity::getPinId)
        .collect(Collectors.toSet());

    // For each not-yet-unlocked pin, check distance
    List<ProximityCheckResponse.RevealedPin> revealed = new ArrayList<>();
    for (PinEntity pin : allowedPins) {
      if (alreadyUnlocked.contains(pin.getId())) {
        continue;
      }

      LocationRequest pinLocation = new LocationRequest(
          pin.getGeom().getY(),
          pin.getGeom().getX(),
          pin.getAltitudeM()
      );

      Integer effectiveRadius = pin.getRevealRadiusM() != null
          ? pin.getRevealRadiusM()
          : pin.getNotifyRadiusM();

      if (effectiveRadius == null) {
        continue;
      }

      double distance = GeoUtil.distanceMeters(viewerLocation, pinLocation);
      if (distance <= effectiveRadius) {
        boolean firstReveal = recordUnlock(pin.getId(), viewerId);
        if (firstReveal) {
          notificationsClient.sendRevealNotification(viewerId, pin.getId(), pin.getOwnerId());
        }
        revealed.add(new ProximityCheckResponse.RevealedPin(
            pin.getId().toString(),
            pin.getText(),
            pin.getLinkUrl()
        ));
      }
    }

    return new ProximityCheckResponse(revealed);
  }

  /**
   * Checks if a viewer can reveal a pin at their current location.
   * If authorized and within reveal radius, unlocks the pin content.
   *
   * @param pinId Pin ID to check
   * @param request Reveal check request with viewer location
   * @return Reveal check response with pin content if authorized
   */
  @Transactional
  public RevealCheckResponse checkReveal(UUID pinId, RevealCheckRequest request) {
    UUID viewerId = requireActor();

    PinEntity pin = pinRepository.findById(pinId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pin not found"));

    // Evaluate access with precise location
    PinAccessService.AccessEvaluationResult result = pinAccessService.evaluate(
        pin,
        viewerId,
        false,
        request.location()
    );

    if (!result.isAllowed()) {
      return new RevealCheckResponse(false, result.getDenialReason(), null);
    }

    // Check if within reveal radius
    if (result.inRevealRadius()) {
      // Record unlock
      recordUnlock(pin.getId(), viewerId);

      // Return pin content
      PinDetail detail = new PinDetail(
          pin.getId().toString(),
          pin.getText(),
          pin.getLinkUrl()
      );
      return new RevealCheckResponse(true, "OK", detail);
    }

    return new RevealCheckResponse(false, "DISTANCE", null);
  }

  /**
   * Deletes a pin. Only the owner can delete their pins.
   *
   * @param pinId Pin ID to delete
   */
  @Transactional
  public void delete(UUID pinId) {
    UUID viewerId = requireActor();

    PinEntity pin = pinRepository.findById(pinId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pin not found"));

    if (!viewerId.equals(pin.getOwnerId())) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not owner");
    }

    pinRepository.delete(pin);
  }

  // --- Private helper methods ---

  private void validateFutureSelfConstraints(PinCreateRequest request) {
    if (!Boolean.TRUE.equals(request.futureSelf())) {
      return; // Not a future-self pin
    }

    if (request.audienceType() != AudienceType.PRIVATE) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST,
          "Future-self pins must be PRIVATE"
      );
    }

    if (request.revealType() != RevealType.REACH_TO_REVEAL) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST,
          "Future-self pins require REACH_TO_REVEAL"
      );
    }
  }

  private PinEntity buildPinEntity(PinCreateRequest request, UUID ownerId, Instant now) {
    PinEntity pin = new PinEntity();
    pin.setOwnerId(ownerId);
    pin.setText(request.text());
    pin.setLinkUrl(request.linkUrl());
    pin.setAudienceType(request.audienceType());
    pin.setAvailableFrom(request.availableFrom() != null ? request.availableFrom() : now);
    pin.setExpiresAt(request.expiresAt());
    pin.setRevealType(request.revealType());
    pin.setRevealRadiusM(request.revealRadiusM());
    pin.setMapPrecision(request.mapPrecision() != null ? request.mapPrecision() : MapPrecision.EXACT);
    pin.setNotifyRadiusM(request.notifyRadiusM());
    pin.setNotifyCooldownSeconds(request.notifyCooldownSeconds() != null ? request.notifyCooldownSeconds() : 3600);
    pin.setNotifyRepeatable(Boolean.TRUE.equals(request.notifyRepeatable()));
    pin.setFutureSelf(Boolean.TRUE.equals(request.futureSelf()));
    pin.setAltitudeM(request.location().altitudeM());
    pin.setGeom(GeoUtil.toPoint(request.location(), geometryFactory));
    pin.setBucket(locationBucket.bucket(request.location().lat(), request.location().lng()));

    if (request.mysteryPolygon() != null) {
      pin.setMysteryGeom(GeoUtil.toPolygon(request.mysteryPolygon(), geometryFactory));
    }

    return pin;
  }

  private void createAclEntries(UUID pinId, PinAclRequest acl) {
    if (acl == null) {
      return;
    }

    // Create list ACL entries
    if (acl.listIds() != null) {
      for (String listId : acl.listIds()) {
        PinAclEntity aclEntity = new PinAclEntity();
        aclEntity.setPinId(pinId);
        aclEntity.setTargetType(TargetType.LIST);
        aclEntity.setTargetId(UUID.fromString(listId));
        pinAclRepository.save(aclEntity);
      }
    }

    // Create user ACL entries
    if (acl.userIds() != null) {
      for (String userId : acl.userIds()) {
        PinAclEntity aclEntity = new PinAclEntity();
        aclEntity.setPinId(pinId);
        aclEntity.setTargetType(TargetType.USER);
        aclEntity.setTargetId(UUID.fromString(userId));
        pinAclRepository.save(aclEntity);
      }
    }
  }

  private boolean recordUnlock(UUID pinId, UUID userId) {
    Optional<PinNotificationStateEntity> existing =
        pinNotificationStateRepository.findByPinIdAndUserId(pinId, userId);
    if (existing.isPresent() && existing.get().getUnlockedAt() != null) {
      return false; // Already unlocked
    }
    PinNotificationStateEntity state = existing.orElseGet(PinNotificationStateEntity::new);
    state.setPinId(pinId);
    state.setUserId(userId);
    state.setUnlockedAt(Instant.now());
    state.setLastNotifiedAt(Instant.now());
    pinNotificationStateRepository.save(state);
    return true; // First reveal
  }

  private double[] parseBbox(String bbox) {
    String[] parts = bbox.split(",");
    if (parts.length != 4) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid bbox format");
    }

    try {
      double minLng = Double.parseDouble(parts[0]);
      double minLat = Double.parseDouble(parts[1]);
      double maxLng = Double.parseDouble(parts[2]);
      double maxLat = Double.parseDouble(parts[3]);
      return new double[]{minLng, minLat, maxLng, maxLat};
    } catch (NumberFormatException e) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid bbox coordinates");
    }
  }

  private UUID requireActor() {
    UUID actorId = SecurityContextUtil.currentUserId();
    if (actorId == null) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing user context");
    }
    return actorId;
  }
}
