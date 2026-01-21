-- Performance optimization indexes for auth-service
-- Created: 2026-01-10
-- Purpose: Optimize common query patterns

-- ==================================================================
-- Users Table Indexes
-- ==================================================================

-- Index for login queries (email lookup)
CREATE UNIQUE INDEX idx_users_email ON users (LOWER(email));
COMMENT ON INDEX idx_users_email IS
  'Optimizes login queries with case-insensitive email lookup';

-- Index for handle lookups (unique usernames)
CREATE UNIQUE INDEX idx_users_handle ON users (LOWER(handle));
COMMENT ON INDEX idx_users_handle IS
  'Optimizes user search by handle with case-insensitive matching';

-- Index for active users (excludes suspended/deleted)
CREATE INDEX idx_users_active ON users (status, created_at DESC)
  WHERE status = 'ACTIVE';
COMMENT ON INDEX idx_users_active IS
  'Optimizes queries for active users only';

-- ==================================================================
-- Refresh Tokens Table Indexes
-- ==================================================================

-- Index for token lookup (most common query)
CREATE INDEX idx_refresh_tokens_hash ON refresh_tokens (token_hash)
  WHERE revoked_at IS NULL AND expires_at > NOW();
COMMENT ON INDEX idx_refresh_tokens_hash IS
  'Optimizes refresh token validation with active tokens only';

-- Index for user token lookup
CREATE INDEX idx_refresh_tokens_user ON refresh_tokens (user_id, expires_at DESC);
COMMENT ON INDEX idx_refresh_tokens_user IS
  'Optimizes listing user sessions and cleanup queries';

-- Index for cleanup job (expired tokens)
CREATE INDEX idx_refresh_tokens_expired ON refresh_tokens (expires_at)
  WHERE revoked_at IS NULL AND expires_at < NOW();
COMMENT ON INDEX idx_refresh_tokens_expired IS
  'Optimizes expired token cleanup job';

-- ==================================================================
-- User Devices Table Indexes
-- ==================================================================

-- Index for device lookup by user
CREATE INDEX idx_user_devices_user ON user_devices (user_id, platform);
COMMENT ON INDEX idx_user_devices_user IS
  'Optimizes device listing per user';

-- Index for push token lookup
CREATE INDEX idx_user_devices_push_token ON user_devices (push_token)
  WHERE push_token IS NOT NULL;
COMMENT ON INDEX idx_user_devices_push_token IS
  'Optimizes push notification targeting';

-- ==================================================================
-- Statistics Update
-- ==================================================================

ANALYZE users;
ANALYZE refresh_tokens;
ANALYZE user_devices;
