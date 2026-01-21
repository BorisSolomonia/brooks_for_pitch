-- Performance optimization indexes for social-service
-- Created: 2026-01-10
-- Purpose: Optimize social graph queries

-- ==================================================================
-- Friendships Table Indexes
-- ==================================================================

-- Composite index for friend lookup (most common query)
CREATE INDEX idx_friendships_lookup ON friendships (user_id, friend_id, status);
COMMENT ON INDEX idx_friendships_lookup IS
  'Optimizes friendship status checks';

-- Reverse index for bidirectional queries
CREATE INDEX idx_friendships_reverse ON friendships (friend_id, user_id, status);
COMMENT ON INDEX idx_friendships_reverse IS
  'Optimizes reverse friendship lookups';

-- Index for pending friend requests
CREATE INDEX idx_friendships_pending ON friendships (friend_id, status, requested_at DESC)
  WHERE status = 'PENDING';
COMMENT ON INDEX idx_friendships_pending IS
  'Optimizes friend request inbox queries';

-- Index for accepted friendships
CREATE INDEX idx_friendships_accepted ON friendships (user_id, accepted_at DESC)
  WHERE status = 'ACCEPTED';
COMMENT ON INDEX idx_friendships_accepted IS
  'Optimizes friends list queries';

-- ==================================================================
-- Follows Table Indexes
-- ==================================================================

-- Index for follower queries
CREATE INDEX idx_follows_follower ON follows (follower_id, status);
COMMENT ON INDEX idx_follows_follower IS
  'Optimizes following list queries';

-- Index for followee queries
CREATE INDEX idx_follows_followee ON follows (followee_id, status);
COMMENT ON INDEX idx_follows_followee IS
  'Optimizes followers list queries';

-- Index for active follows only
CREATE INDEX idx_follows_active ON follows (follower_id, followee_id)
  WHERE status = 'ACTIVE';
COMMENT ON INDEX idx_follows_active IS
  'Optimizes active follow checks';

-- ==================================================================
-- Blocks Table Indexes
-- ==================================================================

-- Index for block checks (bidirectional)
CREATE INDEX idx_blocks_blocker ON blocks (blocker_id, blocked_id);
COMMENT ON INDEX idx_blocks_blocker IS
  'Optimizes block status checks';

-- Reverse index for blocked-by queries
CREATE INDEX idx_blocks_reverse ON blocks (blocked_id, blocker_id);
COMMENT ON INDEX idx_blocks_reverse IS
  'Optimizes checking if user is blocked by someone';

-- ==================================================================
-- Relationship Preferences Table Indexes
-- ==================================================================

-- Composite index for preference lookups (critical for access control)
CREATE UNIQUE INDEX idx_relationship_prefs_lookup
  ON relationship_preferences (viewer_id, subject_id);
COMMENT ON INDEX idx_relationship_prefs_lookup IS
  'Optimizes relationship preference checks in access control';

-- Index for subject queries (who can see my pins)
CREATE INDEX idx_relationship_prefs_subject
  ON relationship_preferences (subject_id, can_see_pins)
  WHERE can_see_pins = TRUE;
COMMENT ON INDEX idx_relationship_prefs_subject IS
  'Optimizes queries for users who can see subject pins';

-- ==================================================================
-- Statistics Update
-- ==================================================================

ANALYZE friendships;
ANALYZE follows;
ANALYZE blocks;
ANALYZE relationship_preferences;
