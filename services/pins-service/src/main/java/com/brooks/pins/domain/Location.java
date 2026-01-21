package com.brooks.pins.domain;

import java.util.Objects;

/**
 * Value object representing a geographic location.
 * Encapsulates latitude, longitude, and optional altitude.
 * Immutable to ensure thread safety and prevent accidental modifications.
 */
public final class Location {
  private final double latitude;
  private final double longitude;
  private final Double altitudeMeters;

  private Location(double latitude, double longitude, Double altitudeMeters) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.altitudeMeters = altitudeMeters;
  }

  /**
   * Creates a new location with latitude and longitude.
   *
   * @param latitude Latitude in degrees (-90 to 90)
   * @param longitude Longitude in degrees (-180 to 180)
   * @return New location instance
   * @throws IllegalArgumentException if coordinates are out of valid range
   */
  public static Location of(double latitude, double longitude) {
    validateCoordinates(latitude, longitude);
    return new Location(latitude, longitude, null);
  }

  /**
   * Creates a new location with latitude, longitude, and altitude.
   *
   * @param latitude Latitude in degrees (-90 to 90)
   * @param longitude Longitude in degrees (-180 to 180)
   * @param altitudeMeters Altitude in meters
   * @return New location instance
   * @throws IllegalArgumentException if coordinates are out of valid range
   */
  public static Location of(double latitude, double longitude, Double altitudeMeters) {
    validateCoordinates(latitude, longitude);
    return new Location(latitude, longitude, altitudeMeters);
  }

  /**
   * Calculates the distance to another location using the Haversine formula.
   * Accurate for small distances but may have errors near poles.
   *
   * @param other The other location
   * @return Distance in meters
   */
  public Distance distanceTo(Location other) {
    double earthRadiusMeters = 6371000.0;

    double dLat = Math.toRadians(other.latitude - this.latitude);
    double dLng = Math.toRadians(other.longitude - this.longitude);
    double rLat1 = Math.toRadians(this.latitude);
    double rLat2 = Math.toRadians(other.latitude);

    double sinLat = Math.sin(dLat / 2.0);
    double sinLng = Math.sin(dLng / 2.0);
    double a = sinLat * sinLat + Math.cos(rLat1) * Math.cos(rLat2) * sinLng * sinLng;
    double c = 2.0 * Math.atan2(Math.sqrt(a), Math.sqrt(1.0 - a));

    return Distance.meters(earthRadiusMeters * c);
  }

  /**
   * Applies blurring to this location by rounding to a coarser grid.
   * Used for privacy when displaying pins on maps.
   *
   * @param decimalPlaces Number of decimal places to round to (2 = ~1.1km precision)
   * @return New blurred location
   */
  public Location blur(int decimalPlaces) {
    double multiplier = Math.pow(10, decimalPlaces);
    double blurredLat = Math.round(latitude * multiplier) / multiplier;
    double blurredLng = Math.round(longitude * multiplier) / multiplier;
    return new Location(blurredLat, blurredLng, altitudeMeters);
  }

  private static void validateCoordinates(double latitude, double longitude) {
    if (latitude < -90.0 || latitude > 90.0) {
      throw new IllegalArgumentException(
          String.format("Latitude must be between -90 and 90, got: %.6f", latitude)
      );
    }
    if (longitude < -180.0 || longitude > 180.0) {
      throw new IllegalArgumentException(
          String.format("Longitude must be between -180 and 180, got: %.6f", longitude)
      );
    }
  }

  public double getLatitude() {
    return latitude;
  }

  public double getLongitude() {
    return longitude;
  }

  public Double getAltitudeMeters() {
    return altitudeMeters;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    Location location = (Location) o;
    return Double.compare(latitude, location.latitude) == 0
        && Double.compare(longitude, location.longitude) == 0
        && Objects.equals(altitudeMeters, location.altitudeMeters);
  }

  @Override
  public int hashCode() {
    return Objects.hash(latitude, longitude, altitudeMeters);
  }

  @Override
  public String toString() {
    if (altitudeMeters != null) {
      return String.format("Location(%.6f, %.6f, %.1fm)", latitude, longitude, altitudeMeters);
    }
    return String.format("Location(%.6f, %.6f)", latitude, longitude);
  }
}
