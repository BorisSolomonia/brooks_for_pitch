package com.brooks.pins.service;

import com.brooks.pins.*;
import com.brooks.pins.client.ListsClient;
import com.brooks.pins.client.SocialGraphClient;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.stereotype.Service;

/**
 * Service responsible for evaluating pin access control.
 * Handles the complex 11-factor decision logic including:
 * - Time windows
 * - Social graph relationships
 * - Audience types
 * - ACL lists
 * - Relationship preferences
 * - Proximity/reveal radius checks
 * - Future-self mode
 */
@Service
public class PinAccessService {
  private final PinAclRepository pinAclRepository;
  private final SocialGraphClient socialGraphClient;
  private final ListsClient listsClient;
  private final PinAccessPolicy accessPolicy;
  private final GeometryFactory geometryFactory;

  public PinAccessService(
      PinAclRepository pinAclRepository,
      SocialGraphClient socialGraphClient,
      ListsClient listsClient,
      GeometryFactory geometryFactory
  ) {
    this.pinAclRepository = pinAclRepository;
    this.socialGraphClient = socialGraphClient;
    this.listsClient = listsClient;
    this.accessPolicy = new PinAccessPolicy();
    this.geometryFactory = geometryFactory;
  }

  /**
   * Evaluates whether a viewer can access a pin.
   *
   * @param pin The pin to check access for
   * @param viewerId The user attempting to view the pin
   * @param forNotification Whether this check is for a notification (stricter rules)
   * @param viewerLocation The viewer's location (required for proximity checks)
   * @return Access evaluation result with decision and context
   */
  public AccessEvaluationResult evaluate(
      PinEntity pin,
      UUID viewerId,
      boolean forNotification,
      LocationRequest viewerLocation
  ) {
    // Fetch social graph view (will be cached in future iteration)
    SocialGraphView graphView = socialGraphClient.fetchGraphView(viewerId, pin.getOwnerId());

    return evaluateWithGraphView(pin, viewerId, graphView, forNotification, viewerLocation);
  }

  /**
   * Evaluates multiple pins for a single viewer efficiently.
   * Caches social graph views to avoid N+1 queries.
   *
   * @param pins The pins to evaluate
   * @param viewerId The viewer
   * @param forNotification Whether for notification context
   * @return Map of pin ID to access evaluation result
   */
  public Map<UUID, AccessEvaluationResult> evaluateBatch(
      List<PinEntity> pins,
      UUID viewerId,
      boolean forNotification
  ) {
    // Cache social graph views to avoid N+1 queries
    Map<UUID, SocialGraphView> graphCache = new HashMap<>();
    Map<UUID, AccessEvaluationResult> results = new HashMap<>();

    for (PinEntity pin : pins) {
      SocialGraphView graphView = graphCache.computeIfAbsent(
          pin.getOwnerId(),
          ownerId -> socialGraphClient.fetchGraphView(viewerId, ownerId)
      );

      AccessEvaluationResult result = evaluateWithGraphView(
          pin,
          viewerId,
          graphView,
          forNotification,
          null // No location for batch map queries
      );
      results.put(pin.getId(), result);
    }

    return results;
  }

  /**
   * Evaluates access with a pre-fetched social graph view.
   * This is the core access evaluation logic.
   */
  private AccessEvaluationResult evaluateWithGraphView(
      PinEntity pin,
      UUID viewerId,
      SocialGraphView graphView,
      boolean forNotification,
      LocationRequest viewerLocation
  ) {
    Instant now = Instant.now();

    // Check time window
    boolean timeEligible = !now.isBefore(pin.getAvailableFrom())
        && now.isBefore(pin.getExpiresAt());

    // Check if blocked
    boolean blocked = graphView.blocked();

    // Check ownership
    boolean isOwner = viewerId.equals(pin.getOwnerId());

    // Check audience type
    boolean allowedByAudience = isAllowedByAudience(pin.getAudienceType(), isOwner, graphView);

    // Load and check ACL
    List<PinAclEntity> aclEntries = pinAclRepository.findByPinId(pin.getId());
    AclCheckResult aclResult = checkAcl(aclEntries, viewerId);

    // Check relationship preferences
    boolean canSeePins = isOwner || graphView.canSeePins();
    boolean canReceiveNotifications = isOwner || graphView.canReceiveNotifications();

    // Check reveal radius (proximity)
    boolean inRevealRadius = checkRevealRadius(pin, viewerLocation);

    // Check future-self mode
    boolean futureSelfMode = pin.isFutureSelf() && isOwner;

    // Evaluate policy
    PinAccessPolicy.PolicyDecision decision = accessPolicy.evaluate(
        new PinAccessPolicy.PolicyInput(
            timeEligible,
            blocked,
            allowedByAudience,
            aclResult.hasAcl(),
            aclResult.allowed(),
            canSeePins,
            forNotification,
            canReceiveNotifications,
            pin.getRevealType(),
            inRevealRadius,
            futureSelfMode
        )
    );

    return new AccessEvaluationResult(decision, inRevealRadius, graphView);
  }

  private boolean isAllowedByAudience(
      AudienceType audienceType,
      boolean isOwner,
      SocialGraphView graphView
  ) {
    return switch (audienceType) {
      case PRIVATE -> isOwner;
      case FRIENDS -> isOwner || graphView.friend();
      case FOLLOWERS -> isOwner || graphView.follower();
      case PUBLIC -> true;
    };
  }

  private AclCheckResult checkAcl(List<PinAclEntity> aclEntries, UUID viewerId) {
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
    boolean hasAcl = hasListAcl || hasUserAcl;

    if (!hasAcl) {
      return new AclCheckResult(false, true);
    }

    boolean inAnyRequiredList = !hasListAcl || listsClient.isUserInAnyList(viewerId, listIds);
    boolean allowedByUserAcl = !hasUserAcl || userIds.contains(viewerId.toString());

    // If both list and user ACLs exist, user needs to match either
    // If only one type exists, user must match that type
    boolean aclAllowed = (hasListAcl && hasUserAcl)
        ? (inAnyRequiredList || allowedByUserAcl)
        : (hasListAcl ? inAnyRequiredList : allowedByUserAcl);

    return new AclCheckResult(true, aclAllowed);
  }

  private boolean checkRevealRadius(PinEntity pin, LocationRequest viewerLocation) {
    if (pin.getRevealType() != RevealType.REACH_TO_REVEAL) {
      return true; // Not required for non-proximity pins
    }

    if (viewerLocation == null) {
      return false; // Location required but not provided
    }

    LocationRequest pinLocation = new LocationRequest(
        pin.getGeom().getY(),
        pin.getGeom().getX(),
        pin.getAltitudeM()
    );

    // Check mystery polygon first (higher priority)
    if (pin.getMysteryGeom() != null) {
      Point viewerPoint = GeoUtil.toPoint(viewerLocation, geometryFactory);
      return GeoUtil.withinPolygon(viewerPoint, pin.getMysteryGeom());
    }

    // Check circular reveal radius
    if (pin.getRevealRadiusM() != null) {
      double distance = GeoUtil.distanceMeters(viewerLocation, pinLocation);
      return distance <= pin.getRevealRadiusM();
    }

    return false; // REACH_TO_REVEAL without radius or polygon
  }

  /**
   * Result of access control evaluation.
   */
  public record AccessEvaluationResult(
      PinAccessPolicy.PolicyDecision decision,
      boolean inRevealRadius,
      SocialGraphView graphView
  ) {
    public boolean isAllowed() {
      return decision.allowed();
    }

    public String getDenialReason() {
      return decision.reason();
    }
  }

  /**
   * Result of ACL check.
   */
  private record AclCheckResult(boolean hasAcl, boolean allowed) {
  }
}
