-- Dave Loves Denver — Missing Indexes
-- Run in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/bbmlumdpagxnthyqumif/sql

-- -------------------------------------------------------
-- PHOTO CACHE
-- Hit on every single page render via attachPhotoCdnUrls.
-- Without this, every .in("photo_name", names) is a full table scan.
-- -------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_photo_cache_photo_name
  ON photo_cache (photo_name);

-- -------------------------------------------------------
-- EVENTS
-- All event queries filter on start_time. Neighborhood queries
-- also filter on neighborhood_slug. Venue queries use ILIKE on
-- venue_name — pg_trgm enables that efficiently.
-- -------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_events_start_time
  ON events (start_time);

CREATE INDEX IF NOT EXISTS idx_events_neighborhood_start_time
  ON events (neighborhood_slug, start_time);

-- Trigram index for ILIKE '%venue name%' queries in getEventsForVenue
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS idx_events_venue_name_trgm
  ON events USING gin (venue_name gin_trgm_ops);

-- -------------------------------------------------------
-- PLACES
-- cached_at is used by refresh-places and warm-photo-cache
-- to find stale records. Also used in generate-summaries.
-- -------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_places_cached_at
  ON places (cached_at);

-- review_summary JSONB: used by generate-summaries to find
-- places missing the tldr field (.filter("review_summary->>tldr", "is", null))
-- A partial index covers the common case efficiently.
CREATE INDEX IF NOT EXISTS idx_places_missing_tldr
  ON places (cached_at)
  WHERE review_summary IS NOT NULL
    AND (review_summary->>'tldr') IS NULL;

-- -------------------------------------------------------
-- EVENTS — enriched fields (added July 2026)
-- Store genre, artist, Spotify/YouTube URLs, status, and
-- price ranges from Ticketmaster API.
-- -------------------------------------------------------
ALTER TABLE events ADD COLUMN IF NOT EXISTS genre TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS artist_name TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS spotify_url TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS youtube_url TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS status_code TEXT DEFAULT 'onsale';
ALTER TABLE events ADD COLUMN IF NOT EXISTS min_price NUMERIC;
ALTER TABLE events ADD COLUMN IF NOT EXISTS max_price NUMERIC;
