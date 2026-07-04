-- Piotet Memorial — database schema (PostgreSQL)
--
-- Applied automatically on API startup (see server/src/db.js), and safe to run
-- by hand:  psql "$DATABASE_URL" -f db/schema.sql
--
-- Only the tributes guestbook needs persistence. Songs/photos are static
-- manifests + media in DO Spaces; story/service are static content.

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
