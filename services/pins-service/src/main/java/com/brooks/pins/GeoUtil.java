package com.brooks.pins;

import java.util.ArrayList;
import java.util.List;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.Polygon;

public final class GeoUtil {
  private static final double EARTH_RADIUS_METERS = 6371000.0;

  private GeoUtil() {
  }

  public static Point toPoint(LocationRequest location, GeometryFactory factory) {
    return factory.createPoint(new Coordinate(location.lng(), location.lat()));
  }

  public static Polygon toPolygon(PolygonRequest polygonRequest, GeometryFactory factory) {
    List<List<Double>> coords = polygonRequest.coordinates();
    Coordinate[] coordinates = new Coordinate[coords.size() + 1];
    for (int i = 0; i < coords.size(); i++) {
      List<Double> pair = coords.get(i);
      coordinates[i] = new Coordinate(pair.get(0), pair.get(1));
    }
    coordinates[coords.size()] = coordinates[0];
    return factory.createPolygon(coordinates);
  }

  public static PolygonRequest toPolygonRequest(Polygon polygon) {
    if (polygon == null) {
      return null;
    }
    Coordinate[] coordinates = polygon.getExteriorRing().getCoordinates();
    List<List<Double>> pairs = new ArrayList<>();
    for (int i = 0; i < coordinates.length - 1; i++) {
      pairs.add(List.of(coordinates[i].x, coordinates[i].y));
    }
    return new PolygonRequest(pairs);
  }

  public static boolean withinPolygon(Point point, Polygon polygon) {
    return polygon != null && point != null && polygon.contains(point);
  }

  public static double distanceMeters(LocationRequest a, LocationRequest b) {
    return distanceMeters(a.lat(), a.lng(), b.lat(), b.lng());
  }

  public static double distanceMeters(double lat1, double lng1, double lat2, double lng2) {
    double dLat = Math.toRadians(lat2 - lat1);
    double dLng = Math.toRadians(lng2 - lng1);
    double rLat1 = Math.toRadians(lat1);
    double rLat2 = Math.toRadians(lat2);

    double sinLat = Math.sin(dLat / 2.0);
    double sinLng = Math.sin(dLng / 2.0);
    double a = sinLat * sinLat + Math.cos(rLat1) * Math.cos(rLat2) * sinLng * sinLng;
    double c = 2.0 * Math.atan2(Math.sqrt(a), Math.sqrt(1.0 - a));
    return EARTH_RADIUS_METERS * c;
  }
}
