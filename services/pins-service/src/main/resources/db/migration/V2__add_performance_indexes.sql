-- Performance optimization indexes for pins-service
-- Created: 2026-01-10
-- Purpose: Optimize common query patterns identified in PinRepository

-- ============================================================
-- Composite Indexes for Common Query Patterns
-- ============================================================

-- Optimize bucket-based proximity queries with time filtering
-- Used by: findByBucketInAndExpiresAtAfterAndAvailableFromBefore
-- Query pattern: WHERE bucket IN (...) AND expires_at > NOW() AND available_from < NOW()
CREATE INDEX idx_pins_bucket_time_composite ON pins (bucket, expires_at, available_from)
  WHERE expires_at > NOW();
COMMENT ON INDEX idx_pins_bucket_time_composite IS
  'Optimizes proximity queries filtering by bucket and time window';

-- Optimize bounding box queries (used frequently for map views)
-- Partial index excludes expired pins for better performance
CREATE INDEX idx_pins_active_geom ON pins USING GIST (geom)
  WHERE expires_at > NOW();
COMMENT ON INDEX idx_pins_active_geom IS
  'Optimizes spatial queries for active (non-expired) pins';

-- ============================================================
-- Foreign Key Indexes
-- ============================================================

-- Index for ACL lookups (critical for access control checks)
-- Used by: PinAclRepository.findByPinId
CREATE INDEX idx_pin_acl_pin_id ON pin_acl (pin_id);
COMMENT ON INDEX idx_pin_acl_pin_id IS
  'Optimizes ACL retrieval for access control evaluation';

-- Index for media lookups
CREATE INDEX idx_pin_media_pin_id ON pin_media (pin_id, sort_order);
COMMENT ON INDEX idx_pin_media_pin_id IS
  'Optimizes media retrieval for pins with proper ordering';

-- Index for notification state lookups
CREATE INDEX idx_pin_notification_state_user ON pin_notification_state (user_id, pin_id);
COMMENT ON INDEX idx_pin_notification_state_user IS
  'Optimizes user notification history queries';

-- ============================================================
-- Cleanup and Maintenance Indexes
-- ============================================================

-- Index for finding expired pins (for cleanup job)
CREATE INDEX idx_pins_expired ON pins (expires_at)
  WHERE expires_at < NOW();
COMMENT ON INDEX idx_pins_expired IS
  'Optimizes expired pin cleanup job queries';

-- Index for owner queries (my pins)
CREATE INDEX idx_pins_owner_active ON pins (owner_id, expires_at DESC)
  WHERE expires_at > NOW();
COMMENT ON INDEX idx_pins_owner_active IS
  'Optimizes user pin listing queries';

-- ============================================================
-- Additional Optimizations
-- ============================================================

-- Index for future-self pins (special mode)
CREATE INDEX idx_pins_future_self ON pins (owner_id, future_self)
  WHERE future_self = TRUE AND expires_at > NOW();
COMMENT ON INDEX idx_pins_future_self IS
  'Optimizes future-self mode pin queries';

-- ============================================================
-- Statistics Update
-- ============================================================

-- Analyze tables to update query planner statistics
ANALYZE pins;
ANALYZE pin_acl;
ANALYZE pin_media;
ANALYZE pin_notification_state;
