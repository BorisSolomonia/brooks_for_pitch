package com.brooks.pins.domain;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Objects;

/**
 * Value object representing a geographic grid bucket.
 * Used for efficient spatial indexing by grouping nearby locations.
 * Immutable to ensure thread safety.
 */
public final class Bucket {
  private final double latitude;
  private final double longitude;
  private final double sizeDegrees;

  private Bucket(double latitude, double longitude, double sizeDegrees) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.sizeDegrees = sizeDegrees;
  }

  /**
   * Creates a bucket for a location with the given bucket size.
   *
   * @param location The location to bucket
   * @param sizeDegrees The bucket size in degrees (e.g., 0.01 = ~1.1km)
   * @return New bucket instance
   */
  public static Bucket forLocation(Location location, double sizeDegrees) {
    double bucketLat = Math.floor(location.getLatitude() / sizeDegrees) * sizeDegrees;
    double bucketLng = Math.floor(location.getLongitude() / sizeDegrees) * sizeDegrees;
    return new Bucket(bucketLat, bucketLng, sizeDegrees);
  }

  /**
   * Parses a bucket from its string representation.
   *
   * @param bucketString String in format "lat:lng"
   * @param sizeDegrees The bucket size in degrees
   * @return Parsed bucket
   * @throws IllegalArgumentException if format is invalid
   */
  public static Bucket parse(String bucketString, double sizeDegrees) {
    String[] parts = bucketString.split(":");
    if (parts.length != 2) {
      throw new IllegalArgumentException("Invalid bucket format: " + bucketString);
    }
    try {
      double lat = Double.parseDouble(parts[0]);
      double lng = Double.parseDouble(parts[1]);
      return new Bucket(lat, lng, sizeDegrees);
    } catch (NumberFormatException e) {
      throw new IllegalArgumentException("Invalid bucket coordinates: " + bucketString, e);
    }
  }

  /**
   * Gets all neighboring buckets including this bucket (3x3 grid = 9 buckets).
   *
   * @return List of this bucket and its 8 neighbors
   */
  public List<Bucket> withNeighbors() {
    List<Bucket> buckets = new ArrayList<>(9);
    for (int latOffset = -1; latOffset <= 1; latOffset++) {
      for (int lngOffset = -1; lngOffset <= 1; lngOffset++) {
        double neighborLat = latitude + latOffset * sizeDegrees;
        double neighborLng = longitude + lngOffset * sizeDegrees;
        buckets.add(new Bucket(neighborLat, neighborLng, sizeDegrees));
      }
    }
    return buckets;
  }

  /**
   * Converts this bucket to its string representation.
   *
   * @return String in format "lat:lng" with 5 decimal places
   */
  public String toIdentifier() {
    return String.format(Locale.US, "%.5f:%.5f", latitude, longitude);
  }

  public double getLatitude() {
    return latitude;
  }

  public double getLongitude() {
    return longitude;
  }

  public double getSizeDegrees() {
    return sizeDegrees;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    Bucket bucket = (Bucket) o;
    return Double.compare(latitude, bucket.latitude) == 0
        && Double.compare(longitude, bucket.longitude) == 0
        && Double.compare(sizeDegrees, bucket.sizeDegrees) == 0;
  }

  @Override
  public int hashCode() {
    return Objects.hash(latitude, longitude, sizeDegrees);
  }

  @Override
  public String toString() {
    return String.format("Bucket[%s, size=%.5f°]", toIdentifier(), sizeDegrees);
  }
}
