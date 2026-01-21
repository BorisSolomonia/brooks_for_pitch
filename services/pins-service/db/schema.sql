CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE pins (
  id UUID PRIMARY KEY,
  owner_id UUID NOT NULL,
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
  future_self BOOLEAN NOT NULL DEFAULT FALSE,
  altitude_m DOUBLE PRECISION,
  bucket VARCHAR(32) NOT NULL,
  geom GEOMETRY(POINT, 4326) NOT NULL,
  mystery_geom GEOMETRY(POLYGON, 4326),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE pin_acl (
  id UUID PRIMARY KEY,
  pin_id UUID NOT NULL,
  target_type VARCHAR(10) NOT NULL,
  target_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE pin_media (
  id UUID PRIMARY KEY,
  pin_id UUID NOT NULL,
  media_type VARCHAR(20) NOT NULL,
  storage_key TEXT NOT NULL,
  url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE pin_notification_state (
  id UUID PRIMARY KEY,
  pin_id UUID NOT NULL,
  user_id UUID NOT NULL,
  last_notified_at TIMESTAMPTZ,
  unlocked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT pin_notification_unique UNIQUE (pin_id, user_id)
);

CREATE INDEX idx_pins_geom ON pins USING GIST (geom);
CREATE INDEX idx_pins_mystery_geom ON pins USING GIST (mystery_geom);
CREATE INDEX idx_pins_expires_at ON pins (expires_at);
CREATE INDEX idx_pins_owner_id ON pins (owner_id);
CREATE INDEX idx_pins_bucket ON pins (bucket);
