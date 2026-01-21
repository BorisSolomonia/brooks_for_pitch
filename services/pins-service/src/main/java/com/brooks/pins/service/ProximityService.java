package com.brooks.pins.service;

import com.brooks.pins.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.stereotype.Service;

/**
 * Service responsible for proximity-based pin discovery.
 * Handles:
 * - Map bounding box queries
 * - Location bucket-based candidate selection
 * - Geofence candidate preparation
 */
@Service
public class ProximityService {
  private final PinRepository pinRepository;
  private final PinAccessService pinAccessService;
  private final LocationBucket locationBucket;

  public ProximityService(
      PinRepository pinRepository,
      PinAccessService pinAccessService,
      LocationBucket locationBucket
  ) {
    this.pinRepository = pinRepository;
    this.pinAccessService = pinAccessService;
    this.locationBucket = locationBucket;
  }

  /**
   * Finds all pins visible to a viewer within a map bounding box.
   * Applies access control and map precision blurring.
   *
   * @param viewerId The user viewing the map
   * @param bbox Bounding box coordinates [minLng, minLat, maxLng, maxLat]
   * @return List of visible pins with appropriate precision
   */
  public List<MapPin> findPinsInBoundingBox(UUID viewerId, double[] bbox) {
    Instant now = Instant.now();

    // Query database for pins in bounding box
    List<PinEntity> pins = pinRepository.findInBoundingBox(
        bbox[0], bbox[1], bbox[2], bbox[3], now
    );

    // Batch evaluate access control (avoids N+1 queries)
    Map<UUID, PinAccessService.AccessEvaluationResult> accessResults =
        pinAccessService.evaluateBatch(pins, viewerId, false);

    // Build response with access-controlled pins
    List<MapPin> results = new ArrayList<>();
    for (PinEntity pin : pins) {
      PinAccessService.AccessEvaluationResult result = accessResults.get(pin.getId());

      if (result.isAllowed()) {
        LocationRequest location = applyMapPrecision(pin, pin.getMapPrecision());
        results.add(new MapPin(
            pin.getId().toString(),
            location,
            pin.getMapPrecision()
        ));
      }
    }

    return results;
  }

  /**
   * Finds pin candidates for geofence registration in a location bucket.
   * Returns coarse zones (not full pin content) that the client can
   * register OS-level geofences for.
   *
   * @param viewerId The user requesting candidates
   * @param bucket The location bucket identifier
   * @return List of pin candidates with zones but not content
   */
  public List<PinCandidate> findCandidatesInBucket(UUID viewerId, String bucket) {
    Instant now = Instant.now();

    // Query neighboring buckets for candidate pins
    List<String> buckets = locationBucket.neighbors(bucket);
    List<PinEntity> pins = pinRepository.findByBucketInAndExpiresAtAfterAndAvailableFromBefore(
        buckets, now, now
    );

    // Batch evaluate access control
    Map<UUID, PinAccessService.AccessEvaluationResult> accessResults =
        pinAccessService.evaluateBatch(pins, viewerId, true); // forNotification=true

    // Build candidates
    List<PinCandidate> candidates = new ArrayList<>();
    for (PinEntity pin : pins) {
      PinAccessService.AccessEvaluationResult result = accessResults.get(pin.getId());

      if (result.isAllowed()) {
        candidates.add(new PinCandidate(
            pin.getId().toString(),
            new LocationRequest(
                pin.getGeom().getY(),
                pin.getGeom().getX(),
                pin.getAltitudeM()
            ),
            pin.getRevealType(),
            pin.getRevealRadiusM(),
            GeoUtil.toPolygonRequest(pin.getMysteryGeom())
        ));
      }
    }

    return candidates;
  }

  /**
   * Applies map precision blurring to a pin's location.
   * EXACT precision returns actual coordinates.
   * BLURRED precision rounds to ~1.1km grid.
   *
   * @param pin The pin to get location for
   * @param precision Desired precision level
   * @return Location with appropriate precision
   */
  private LocationRequest applyMapPrecision(PinEntity pin, MapPrecision precision) {
    double lat = pin.getGeom().getY();
    double lng = pin.getGeom().getX();

    if (precision == MapPrecision.BLURRED) {
      // Round to 2 decimal places (~1.1km precision)
      lat = Math.round(lat * 100.0) / 100.0;
      lng = Math.round(lng * 100.0) / 100.0;
    }

    return new LocationRequest(lat, lng, pin.getAltitudeM());
  }
}
