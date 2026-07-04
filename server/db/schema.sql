-- Piotet Memorial — database schema (PostgreSQL)
--
-- Applied automatically on API startup (see server/src/db.js), and safe to run
-- by hand:  psql "$DATABASE_URL" -f db/schema.sql
--
-- Persistence: the tributes guestbook, and editable site content (so the family
-- can edit copy via /admin without a code change or redeploy). Media binaries
-- stay in DO Spaces; only their keys/metadata live here.

-- Editable text content, one row per block (hero/person, service, story, intros).
-- `data` is a JSONB blob whose shape depends on the key; the admin UI edits it.
CREATE TABLE IF NOT EXISTS content_blocks (
  key         TEXT PRIMARY KEY,
  data        JSONB NOT NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tributes (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  author      TEXT NOT NULL,
  quote       TEXT NOT NULL,
  -- Moderation: submissions land 'pending' and are invisible to visitors until
  -- an admin approves them. 'rejected' is kept (not deleted) for an audit trail.
  status      TEXT NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  approved_at TIMESTAMPTZ
);

-- Public reads always filter by approved + newest first.
CREATE INDEX IF NOT EXISTS tributes_status_created_idx
  ON tributes (status, created_at DESC);
