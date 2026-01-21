-- Performance optimization indexes for moderation-service
-- Created: 2026-01-10
-- Purpose: Optimize report queries

-- ==================================================================
-- Reports Table Indexes
-- ==================================================================

-- Index for target lookups (find all reports for a target)
CREATE INDEX idx_reports_target ON reports (target_type, target_id, created_at DESC);
COMMENT ON INDEX idx_reports_target IS
  'Optimizes finding all reports for a specific target';

-- Index for reporter queries
CREATE INDEX idx_reports_reporter ON reports (reporter_id, created_at DESC);
COMMENT ON INDEX idx_reports_reporter IS
  'Optimizes listing reports by a specific user';

-- Index for moderation queue (pending reports)
CREATE INDEX idx_reports_pending ON reports (status, created_at ASC)
  WHERE status = 'PENDING';
COMMENT ON INDEX idx_reports_pending IS
  'Optimizes moderation queue queries';

-- Index for reason filtering
CREATE INDEX idx_reports_reason ON reports (reason, created_at DESC);
COMMENT ON INDEX idx_reports_reason IS
  'Optimizes filtering reports by reason';

-- ==================================================================
-- Statistics Update
-- ==================================================================

ANALYZE reports;
