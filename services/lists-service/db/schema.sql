CREATE TABLE lists (
  id UUID PRIMARY KEY,
  owner_id UUID NOT NULL,
  list_type VARCHAR(20) NOT NULL,
  name VARCHAR(120) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE list_members (
  id UUID PRIMARY KEY,
  list_id UUID NOT NULL,
  member_user_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT list_members_unique UNIQUE (list_id, member_user_id)
);

CREATE INDEX idx_lists_owner_id ON lists (owner_id);
CREATE INDEX idx_list_members_list_id ON list_members (list_id);
