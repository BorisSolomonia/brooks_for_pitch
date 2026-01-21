package com.brooks.pins;

import com.brooks.security.SecurityContextUtil;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

/**
 * @deprecated This class has been refactored into smaller, focused services.
 * Use PinServiceRefactored (for CRUD), PinAccessService (for access control),
 * ProximityService (for spatial queries), and service clients instead.
 * This class will be removed in a future version.
 */
@Deprecated
@Service("pinServiceLegacy")
public class PinService {
  private final PinRepository pinRepository;
  private final PinAclRepository pinAclRepository;
  private final PinNotificationStateRepository pinNotificationStateRepository;
  private final RestTemplate restTemplate;
  private final PinAccessPolicy accessPolicy;
  private final LocationBucket locationBucket;
  private final GeometryFactory geometryFactory;
  private final String socialBaseUrl;
  private final String listsBaseUrl;

  public PinService(
      PinRepository pinRepository,
      PinAclRepository pinAclRepository,
      PinNotificationStateRepository pinNotificationStateRepository,
      RestTemplate restTemplate,
      @Value("${brooks.proximity.bucket-size-deg}") double bucketSizeDeg,
      @Value("${brooks.social.base-url}") String socialBaseUrl,
      @Value("${brooks.lists.base-url}") String listsBaseUrl
  ) {
    this.pinRepository = pinRepository;
    this.pinAclRepository = pinAclRepository;
    this.pinNotificationStateRepository = pinNotificationStateRepository;
    this.restTemplate = restTemplate;
    this.accessPolicy = new PinAccessPolicy();
    this.locationBucket = new LocationBucket(bucketSizeDeg);
    this.geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);
    this.socialBaseUrl = socialBaseUrl;
    this.listsBaseUrl = listsBaseUrl;
  }

  @Transactional
  public PinResponse create(PinCreateRequest request) {
    UUID ownerId = requireActor();
    Instant now = Instant.now();

    if (Boolean.TRUE.equals(request.futureSelf()) && request.audienceType() != AudienceType.PRIVATE) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Future-self pins must be PRIVATE");
    }
    if (Boolean.TRUE.equals(request.futureSelf()) && request.revealType() != RevealType.REACH_TO_REVEAL) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Future-self pins require REACH_TO_REVEAL");
    }

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

    PinEntity saved = pinRepository.save(pin);

    if (request.acl() != null) {
      if (request.acl().listIds() != null) {
        for (String listId : request.acl().listIds()) {
          PinAclEntity acl = new PinAclEntity();
          acl.setPinId(saved.getId());
          acl.setTargetType(TargetType.LIST);
          acl.setTargetId(UUID.fromString(listId));
          pinAclRepository.save(acl);
        }
      }
      if (request.acl().userIds() != null) {
        for (String userId : request.acl().userIds()) {
          PinAclEntity acl = new PinAclEntity();
          acl.setPinId(saved.getId());
          acl.setTargetType(TargetType.USER);
          acl.setTargetId(UUID.fromString(userId));
          pinAclRepository.save(acl);
        }
      }
    }

    return new PinResponse(saved.getId().toString(), "CREATED");
  }

  public MapPinsResponse mapPins(String bbox) {
    UUID viewerId = requireActor();
    double[] bounds = parseBbox(bbox);
    Instant now = Instant.now();

    List<PinEntity> pins = pinRepository.findInBoundingBox(bounds[0], bounds[1], bounds[2], bounds[3], now);
    Map<UUID, SocialGraphView> graphCache = new HashMap<>();
    List<MapPin> results = new ArrayList<>();
    for (PinEntity pin : pins) {
      SocialGraphView graphView = graphCache.computeIfAbsent(
          pin.getOwnerId(), ownerId -> fetchGraphView(viewerId, ownerId));
      PolicyContext context = buildPolicyContext(pin, viewerId, graphView, false, null);
      if (context.decision.allowed()) {
        LocationRequest location = toLocation(pin, pin.getMapPrecision());
        results.add(new MapPin(pin.getId().toString(), location, pin.getMapPrecision()));
      }
    }
    return new MapPinsResponse(results);
  }

  public PinCandidatesResponse candidates(String bucket) {
    UUID viewerId = requireActor();
    Instant now = Instant.now();
    List<String> buckets = locationBucket.neighbors(bucket);
    List<PinEntity> pins = pinRepository.findByBucketInAndExpiresAtAfterAndAvailableFromBefore(
        buckets, now, now);

    Map<UUID, SocialGraphView> graphCache = new HashMap<>();
    List<PinCandidate> candidates = new ArrayList<>();
    for (PinEntity pin : pins) {
      SocialGraphView graphView = graphCache.computeIfAbsent(
          pin.getOwnerId(), ownerId -> fetchGraphView(viewerId, ownerId));
      PolicyContext context = buildPolicyContext(pin, viewerId, graphView, true, null);
      if (context.decision.allowed()) {
        candidates.add(new PinCandidate(
            pin.getId().toString(),
            new LocationRequest(pin.getGeom().getY(), pin.getGeom().getX(), pin.getAltitudeM()),
            pin.getRevealType(),
            pin.getRevealRadiusM(),
            GeoUtil.toPolygonRequest(pin.getMysteryGeom())
        ));
      }
    }
    return new PinCandidatesResponse(candidates);
  }

  @Transactional
  public RevealCheckResponse checkReveal(UUID pinId, RevealCheckRequest request) {
    UUID viewerId = requireActor();
    PinEntity pin = pinRepository.findById(pinId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pin not found"));

    SocialGraphView graphView = fetchGraphView(viewerId, pin.getOwnerId());
    PolicyContext context = buildPolicyContext(pin, viewerId, graphView, false, request.location());
    if (!context.decision.allowed()) {
      return new RevealCheckResponse(false, context.decision.reason(), null);
    }

    if (context.inRevealRadius) {
      PinNotificationStateEntity state = pinNotificationStateRepository
          .findByPinIdAndUserId(pin.getId(), viewerId)
          .orElseGet(PinNotificationStateEntity::new);
      state.setPinId(pin.getId());
      state.setUserId(viewerId);
      state.setUnlockedAt(Instant.now());
      pinNotificationStateRepository.save(state);

      PinDetail detail = new PinDetail(pin.getId().toString(), pin.getText(), pin.getLinkUrl());
      return new RevealCheckResponse(true, "OK", detail);
    }

    return new RevealCheckResponse(false, "DISTANCE", null);
  }

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

  private PolicyContext buildPolicyContext(
      PinEntity pin,
      UUID viewerId,
      SocialGraphView graphView,
      boolean forNotification,
      LocationRequest location
  ) {
    Instant now = Instant.now();
    boolean timeEligible = !now.isBefore(pin.getAvailableFrom()) && now.isBefore(pin.getExpiresAt());
    boolean blocked = graphView.blocked();
    boolean isOwner = viewerId.equals(pin.getOwnerId());

    boolean allowedByAudience = switch (pin.getAudienceType()) {
      case PRIVATE -> isOwner;
      case FRIENDS -> isOwner || graphView.friend();
      case FOLLOWERS -> isOwner || graphView.follower();
      case PUBLIC -> true;
    };

    List<PinAclEntity> aclEntries = pinAclRepository.findByPinId(pin.getId());
    List<String> listIds = new ArrayList<>();
    List<String> userIds = new ArrayList<>();
    for (PinAclEntity acl : aclEntries) {
      if (acl.getTargetType() == TargetType.LIST) {
        listIds.add(acl.getTargetId().toString());
      } else if (acl.getTargetType() == TargetType.USER) {
        userIds.add(acl.getTargetId().toString());
      }
    }

    boolean hasListAcl = !listIds.isEmpty();
    boolean hasUserAcl = !userIds.isEmpty();
    boolean inAnyRequiredList = !hasListAcl || isInAnyRequiredList(viewerId, listIds);
    boolean allowedByUserAcl = !hasUserAcl || userIds.contains(viewerId.toString());
    boolean hasAcl = hasListAcl || hasUserAcl;
    boolean aclAllowed = !hasAcl || (hasListAcl && hasUserAcl
        ? (inAnyRequiredList || allowedByUserAcl)
        : (hasListAcl ? inAnyRequiredList : allowedByUserAcl));

    boolean canSeePins = isOwner || graphView.canSeePins();
    boolean canReceiveNotifications = isOwner || graphView.canReceiveNotifications();

    boolean inRevealRadius = true;
    if (pin.getRevealType() == RevealType.REACH_TO_REVEAL) {
      if (location != null) {
        LocationRequest pinLocation = new LocationRequest(pin.getGeom().getY(), pin.getGeom().getX(), pin.getAltitudeM());
        if (pin.getMysteryGeom() != null) {
          Point viewerPoint = GeoUtil.toPoint(location, geometryFactory);
          inRevealRadius = GeoUtil.withinPolygon(viewerPoint, pin.getMysteryGeom());
        } else if (pin.getRevealRadiusM() != null) {
          inRevealRadius = GeoUtil.distanceMeters(location, pinLocation) <= pin.getRevealRadiusM();
        } else {
          inRevealRadius = false;
        }
      }
    }

    boolean futureSelfMode = pin.isFutureSelf() && isOwner;

    PinAccessPolicy.PolicyDecision decision = accessPolicy.evaluate(new PinAccessPolicy.PolicyInput(
        timeEligible,
        blocked,
        allowedByAudience,
        hasAcl,
        aclAllowed,
        canSeePins,
        forNotification,
        canReceiveNotifications,
        pin.getRevealType(),
        inRevealRadius,
        futureSelfMode
    ));

    return new PolicyContext(decision, inRevealRadius);
  }

  private LocationRequest toLocation(PinEntity pin, MapPrecision precision) {
    double lat = pin.getGeom().getY();
    double lng = pin.getGeom().getX();
    if (precision == MapPrecision.BLURRED) {
      lat = Math.round(lat * 100.0) / 100.0;
      lng = Math.round(lng * 100.0) / 100.0;
    }
    return new LocationRequest(lat, lng, pin.getAltitudeM());
  }

  private double[] parseBbox(String bbox) {
    String[] parts = bbox.split(",");
    if (parts.length != 4) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid bbox");
    }
    double minLng = Double.parseDouble(parts[0]);
    double minLat = Double.parseDouble(parts[1]);
    double maxLng = Double.parseDouble(parts[2]);
    double maxLat = Double.parseDouble(parts[3]);
    return new double[] {minLng, minLat, maxLng, maxLat};
  }

  private SocialGraphView fetchGraphView(UUID viewerId, UUID subjectId) {
    String url = String.format("%s/internal/graph/view?viewerId=%s&subjectId=%s",
        socialBaseUrl, viewerId, subjectId);
    HttpHeaders headers = authHeaders();
    ResponseEntity<SocialGraphView> response = restTemplate.exchange(
        url, HttpMethod.GET, new HttpEntity<>(null, headers), SocialGraphView.class);
    SocialGraphView body = response.getBody();
    if (body == null) {
      return new SocialGraphView(false, false, false, false, false);
    }
    return body;
  }

  private boolean isInAnyRequiredList(UUID viewerId, List<String> listIds) {
    ListMembershipRequest request = new ListMembershipRequest(viewerId.toString(), listIds);
    HttpHeaders headers = authHeaders();
    ResponseEntity<ListMembershipResponse> response = restTemplate.exchange(
        listsBaseUrl + "/internal/lists/membership",
        HttpMethod.POST,
        new HttpEntity<>(request, headers),
        ListMembershipResponse.class
    );
    ListMembershipResponse body = response.getBody();
    return body != null && body.inAny();
  }

  private HttpHeaders authHeaders() {
    HttpHeaders headers = new HttpHeaders();
    String token = SecurityContextUtil.currentToken();
    if (token != null) {
      headers.setBearerAuth(token);
    }
    return headers;
  }

  private UUID requireActor() {
    UUID actorId = SecurityContextUtil.currentUserId();
    if (actorId == null) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing user context");
    }
    return actorId;
  }

  private record PolicyContext(PinAccessPolicy.PolicyDecision decision, boolean inRevealRadius) {
  }
}
