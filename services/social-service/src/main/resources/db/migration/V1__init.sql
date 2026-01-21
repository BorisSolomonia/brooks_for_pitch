CREATE TABLE friendships (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  friend_id UUID NOT NULL,
  status VARCHAR(20) NOT NULL,
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT friendships_unique UNIQUE (user_id, friend_id)
);

CREATE TABLE follows (
  id UUID PRIMARY KEY,
  follower_id UUID NOT NULL,
  followee_id UUID NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT follows_unique UNIQUE (follower_id, followee_id)
);

CREATE TABLE relationship_preferences (
  id UUID PRIMARY KEY,
  viewer_id UUID NOT NULL,
  subject_id UUID NOT NULL,
  can_see_pins BOOLEAN NOT NULL DEFAULT FALSE,
  can_receive_proximity_notifications BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT rel_prefs_unique UNIQUE (viewer_id, subject_id)
);

CREATE TABLE blocks (
  id UUID PRIMARY KEY,
  blocker_id UUID NOT NULL,
  blocked_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT blocks_unique UNIQUE (blocker_id, blocked_id)
);

CREATE INDEX idx_follows_followee ON follows (followee_id);
CREATE INDEX idx_friendships_user_id ON friendships (user_id);
CREATE INDEX idx_blocks_blocker_id ON blocks (blocker_id);
