package com.brooks.pins.config;

import com.brooks.pins.LocationBucket;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration for location bucketing.
 * Provides a LocationBucket bean configured with the application's bucket size.
 */
@Configuration
public class LocationBucketConfig {
  /**
   * Creates a LocationBucket configured with the application's bucket size.
   * Default bucket size is 0.01 degrees (~1.1km).
   *
   * @param bucketSizeDeg Bucket size in degrees from application.yml
   * @return Configured location bucket
   */
  @Bean
  public LocationBucket locationBucket(
      @Value("${brooks.proximity.bucket-size-deg}") double bucketSizeDeg
  ) {
    return new LocationBucket(bucketSizeDeg);
  }
}
