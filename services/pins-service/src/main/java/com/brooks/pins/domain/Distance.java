package com.brooks.pins.domain;

import java.util.Objects;

/**
 * Value object representing a distance measurement.
 * Provides type safety and prevents accidental mixing of units.
 * Immutable to ensure thread safety.
 */
public final class Distance implements Comparable<Distance> {
  private final double meters;

  private Distance(double meters) {
    if (meters < 0) {
      throw new IllegalArgumentException("Distance cannot be negative: " + meters);
    }
    this.meters = meters;
  }

  /**
   * Creates a distance from meters.
   *
   * @param meters Distance in meters
   * @return New distance instance
   * @throws IllegalArgumentException if meters is negative
   */
  public static Distance meters(double meters) {
    return new Distance(meters);
  }

  /**
   * Creates a distance from kilometers.
   *
   * @param kilometers Distance in kilometers
   * @return New distance instance
   * @throws IllegalArgumentException if kilometers is negative
   */
  public static Distance kilometers(double kilometers) {
    return new Distance(kilometers * 1000.0);
  }

  /**
   * Creates a distance from miles.
   *
   * @param miles Distance in miles
   * @return New distance instance
   * @throws IllegalArgumentException if miles is negative
   */
  public static Distance miles(double miles) {
    return new Distance(miles * 1609.34);
  }

  /**
   * Checks if this distance is less than or equal to another distance.
   *
   * @param other The other distance
   * @return true if this distance is less than or equal to the other
   */
  public boolean isWithin(Distance other) {
    return this.meters <= other.meters;
  }

  /**
   * Checks if this distance is greater than another distance.
   *
   * @param other The other distance
   * @return true if this distance is greater than the other
   */
  public boolean isGreaterThan(Distance other) {
    return this.meters > other.meters;
  }

  /**
   * Gets the distance in meters.
   *
   * @return Distance in meters
   */
  public double toMeters() {
    return meters;
  }

  /**
   * Gets the distance in kilometers.
   *
   * @return Distance in kilometers
   */
  public double toKilometers() {
    return meters / 1000.0;
  }

  /**
   * Gets the distance in miles.
   *
   * @return Distance in miles
   */
  public double toMiles() {
    return meters / 1609.34;
  }

  @Override
  public int compareTo(Distance other) {
    return Double.compare(this.meters, other.meters);
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    Distance distance = (Distance) o;
    return Double.compare(distance.meters, meters) == 0;
  }

  @Override
  public int hashCode() {
    return Objects.hash(meters);
  }

  @Override
  public String toString() {
    if (meters >= 1000.0) {
      return String.format("%.2f km", toKilometers());
    }
    return String.format("%.0f m", meters);
  }
}
