package com.brooks.pins;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PinRepository extends JpaRepository<PinEntity, UUID> {
  @Query("select p from PinEntity p where p.expiresAt > :now and p.availableFrom <= :now and "
      + "function('ST_Intersects', p.geom, function('ST_MakeEnvelope', :minLng, :minLat, :maxLng, :maxLat, 4326)) = true")
  List<PinEntity> findInBoundingBox(
      @Param("minLng") double minLng,
      @Param("minLat") double minLat,
      @Param("maxLng") double maxLng,
      @Param("maxLat") double maxLat,
      @Param("now") Instant now
  );

  List<PinEntity> findByBucketInAndExpiresAtAfterAndAvailableFromBefore(
      List<String> buckets,
      Instant now1,
      Instant now2
  );

  /**
   * Deletes expired pins in batches.
   * Used by the cleanup job to remove old pins.
   *
   * @param cutoffTime Delete pins that expired before this time
   * @param limit Maximum number of pins to delete in this batch
   * @return Number of pins deleted
   */
  @Modifying
  @Query(value = "DELETE FROM pins WHERE id IN " +
      "(SELECT id FROM pins WHERE expires_at < :cutoffTime " +
      "ORDER BY expires_at LIMIT :limit)",
      nativeQuery = true)
  int deleteExpiredPins(
      @Param("cutoffTime") Instant cutoffTime,
      @Param("limit") int limit
  );
}
