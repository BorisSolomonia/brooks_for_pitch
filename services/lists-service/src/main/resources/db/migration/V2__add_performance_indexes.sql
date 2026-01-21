-- Performance optimization indexes for lists-service
-- Created: 2026-01-10
-- Purpose: Optimize list and membership queries

-- ==================================================================
-- Lists Table Indexes
-- ==================================================================

-- Index for owner's lists
CREATE INDEX idx_lists_owner ON lists (owner_id, list_type, name);
COMMENT ON INDEX idx_lists_owner IS
  'Optimizes user list retrieval grouped by type';

-- Index for list type filtering
CREATE INDEX idx_lists_type ON lists (list_type, owner_id);
COMMENT ON INDEX idx_lists_type IS
  'Optimizes filtering lists by type';

-- ==================================================================
-- List Members Table Indexes
-- ==================================================================

-- Index for list membership queries (critical for ACL checks)
CREATE INDEX idx_list_members_list ON list_members (list_id, member_user_id);
COMMENT ON INDEX idx_list_members_list IS
  'Optimizes membership checks for access control';

-- Index for user membership queries (which lists is user in)
CREATE INDEX idx_list_members_user ON list_members (member_user_id, list_id);
COMMENT ON INDEX idx_list_members_user IS
  'Optimizes queries for user list memberships';

-- Unique constraint to prevent duplicate memberships
CREATE UNIQUE INDEX idx_list_members_unique ON list_members (list_id, member_user_id);
COMMENT ON INDEX idx_list_members_unique IS
  'Prevents duplicate list memberships';

-- ==================================================================
-- Statistics Update
-- ==================================================================

ANALYZE lists;
ANALYZE list_members;
