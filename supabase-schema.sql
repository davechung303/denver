-- Dave Loves Denver — Supabase Schema
-- Run this in the Supabase SQL Editor at:
-- https://supabase.com/dashboard/project/bbmlumdpagxnthyqumif/sql

-- -------------------------------------------------------
-- PLACES (cached Google Places API responses)
-- -------------------------------------------------------
create table if not exists places (
  id uuid primary key default gen_random_uuid(),
  place_id text not null unique,         -- Google Place ID
  neighborhood_slug text not null,
  category_slug text not null,
  name text not null,
  slug text not null,                    -- URL-friendly name
  address text,
  phone text,
  website text,
  lat numeric,
  lng numeric,
  rating numeric,
  review_count integer,
  price_level integer,                   -- 0-4 (Google scale)
  hours jsonb,                           -- opening_hours object from Places API
  photos jsonb,                          -- array of photo references
  types text[],                          -- Google place types
  cached_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists places_neighborhood_category
  on places (neighborhood_slug, category_slug);

create index if not exists places_slug
  on places (neighborhood_slug, category_slug, slug);

-- -------------------------------------------------------
-- YOUTUBE VIDEOS (cached YouTube Data API responses)
-- -------------------------------------------------------
create table if not exists youtube_videos (
  id uuid primary key default gen_random_uuid(),
  video_id text not null unique,         -- YouTube video ID
  title text not null,
  description text,
  thumbnail_url text,
  view_count integer,
  published_at timestamptz,
  tags text[],
  cached_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- -------------------------------------------------------
-- VIDEO PAGE ASSOCIATIONS
-- Maps videos to neighborhood/category pages via keyword matching
-- -------------------------------------------------------
create table if not exists video_page_associations (
  id uuid primary key default gen_random_uuid(),
  video_id text not null references youtube_videos(video_id) on delete cascade,
  neighborhood_slug text,
  category_slug text,
  relevance_score numeric not null default 1.0,
  created_at timestamptz not null default now(),
  unique (video_id, neighborhood_slug, category_slug)
);

create index if not exists video_assoc_neighborhood
  on video_page_associations (neighborhood_slug, category_slug);

-- -------------------------------------------------------
-- USER REVIEWS (our own review layer)
-- -------------------------------------------------------
create table if not exists user_reviews (
  id uuid primary key default gen_random_uuid(),
  place_id text not null,               -- Google Place ID
  author_name text not null,
  rating integer not null check (rating between 1 and 5),
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists user_reviews_place
  on user_reviews (place_id);

-- -------------------------------------------------------
-- ROW LEVEL SECURITY
-- -------------------------------------------------------
alter table places enable row level security;
alter table youtube_videos enable row level security;
alter table video_page_associations enable row level security;
alter table user_reviews enable row level security;

-- Public read access for all tables
create policy "Public read" on places for select using (true);
create policy "Public read" on youtube_videos for select using (true);
create policy "Public read" on video_page_associations for select using (true);
create policy "Public read" on user_reviews for select using (true);

-- Only service role can write (API routes use service role key server-side)
create policy "Service write" on places for insert with check (true);
create policy "Service write" on youtube_videos for insert with check (true);
create policy "Service write" on video_page_associations for insert with check (true);
create policy "Service write" on user_reviews for insert with check (true);
