-- PostgreSQL + PostGIS schema for Brooks

CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(320) UNIQUE NOT NULL,
  handle VARCHAR(32) UNIQUE NOT NULL,
  display_name VARCHAR(120) NOT NULL,
  password_hash TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE user_devices (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  platform VARCHAR(20) NOT NULL,
  device_token TEXT NOT NULL,
  push_token TEXT,
  last_seen_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE friendships (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  friend_id UUID NOT NULL REFERENCES users(id),
  status VARCHAR(20) NOT NULL,
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT friendships_unique UNIQUE (user_id, friend_id)
);

CREATE TABLE follows (
  id UUID PRIMARY KEY,
  follower_id UUID NOT NULL REFERENCES users(id),
  followee_id UUID NOT NULL REFERENCES users(id),
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT follows_unique UNIQUE (follower_id, followee_id)
);

CREATE TABLE relationship_preferences (
  id UUID PRIMARY KEY,
  viewer_id UUID NOT NULL REFERENCES users(id),
  subject_id UUID NOT NULL REFERENCES users(id),
  can_see_pins BOOLEAN NOT NULL DEFAULT FALSE,
  can_receive_proximity_notifications BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT rel_prefs_unique UNIQUE (viewer_id, subject_id)
);

CREATE TABLE blocks (
  id UUID PRIMARY KEY,
  blocker_id UUID NOT NULL REFERENCES users(id),
  blocked_id UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT blocks_unique UNIQUE (blocker_id, blocked_id)
);

CREATE TABLE lists (
  id UUID PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES users(id),
  list_type VARCHAR(20) NOT NULL,
  name VARCHAR(120) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE list_members (
  id UUID PRIMARY KEY,
  list_id UUID NOT NULL REFERENCES lists(id),
  member_user_id UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT list_members_unique UNIQUE (list_id, member_user_id)
);

CREATE TABLE pins (
  id UUID PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES users(id),
  text TEXT NOT NULL,
  link_url TEXT,
  audience_type VARCHAR(20) NOT NULL,
  available_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  reveal_type VARCHAR(20) NOT NULL,
  reveal_radius_m INTEGER,
  map_precision VARCHAR(20) NOT NULL DEFAULT 'EXACT',
  notify_radius_m INTEGER,
  notify_cooldown_seconds INTEGER NOT NULL DEFAULT 3600,
  notify_repeatable BOOLEAN NOT NULL DEFAULT FALSE,
  altitude_m DOUBLE PRECISION,
  geom GEOMETRY(POINT, 4326) NOT NULL,
  mystery_geom GEOMETRY(POLYGON, 4326),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE pin_acl (
  id UUID PRIMARY KEY,
  pin_id UUID NOT NULL REFERENCES pins(id),
  target_type VARCHAR(10) NOT NULL,
  target_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE pin_media (
  id UUID PRIMARY KEY,
  pin_id UUID NOT NULL REFERENCES pins(id),
  media_type VARCHAR(20) NOT NULL,
  storage_key TEXT NOT NULL,
  url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE pin_notification_state (
  id UUID PRIMARY KEY,
  pin_id UUID NOT NULL REFERENCES pins(id),
  user_id UUID NOT NULL REFERENCES users(id),
  last_notified_at TIMESTAMPTZ,
  unlocked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT pin_notification_unique UNIQUE (pin_id, user_id)
);

CREATE TABLE reports (
  id UUID PRIMARY KEY,
  reporter_id UUID NOT NULL REFERENCES users(id),
  target_type VARCHAR(20) NOT NULL,
  target_id UUID NOT NULL,
  reason VARCHAR(50) NOT NULL,
  details TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_pins_geom ON pins USING GIST (geom);
CREATE INDEX idx_pins_mystery_geom ON pins USING GIST (mystery_geom);
CREATE INDEX idx_pins_expires_at ON pins (expires_at);
CREATE INDEX idx_pins_owner_id ON pins (owner_id);
CREATE INDEX idx_lists_owner_id ON lists (owner_id);
CREATE INDEX idx_follows_followee ON follows (followee_id);
CREATE INDEX idx_friendships_user_id ON friendships (user_id);
CREATE INDEX idx_blocks_blocker_id ON blocks (blocker_id);
