package com.brooks.pins;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

public class LocationBucket {
  private final double sizeDeg;

  public LocationBucket(double sizeDeg) {
    this.sizeDeg = sizeDeg;
  }

  public String bucket(double lat, double lng) {
    double latBucket = Math.floor(lat / sizeDeg) * sizeDeg;
    double lngBucket = Math.floor(lng / sizeDeg) * sizeDeg;
    return format(latBucket, lngBucket);
  }

  public List<String> neighbors(String bucket) {
    String[] parts = bucket.split(":");
    if (parts.length != 2) {
      return List.of(bucket);
    }
    double baseLat = Double.parseDouble(parts[0]);
    double baseLng = Double.parseDouble(parts[1]);
    List<String> buckets = new ArrayList<>();
    for (int latOffset = -1; latOffset <= 1; latOffset++) {
      for (int lngOffset = -1; lngOffset <= 1; lngOffset++) {
        buckets.add(format(baseLat + latOffset * sizeDeg, baseLng + lngOffset * sizeDeg));
      }
    }
    return buckets;
  }

  private String format(double lat, double lng) {
    return String.format(Locale.US, "%.5f:%.5f", lat, lng);
  }
}
