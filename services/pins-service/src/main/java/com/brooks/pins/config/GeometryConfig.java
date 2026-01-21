package com.brooks.pins.config;

import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration for JTS Geometry components.
 * Provides a shared GeometryFactory with WGS84 (SRID 4326) coordinate system.
 */
@Configuration
public class GeometryConfig {
  /**
   * Creates a GeometryFactory configured for WGS84 coordinates (SRID 4326).
   * This is the standard coordinate reference system used by GPS and web maps.
   *
   * @return Configured geometry factory
   */
  @Bean
  public GeometryFactory geometryFactory() {
    return new GeometryFactory(new PrecisionModel(), 4326);
  }
}
