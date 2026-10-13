-- Run once in the Supabase SQL editor.
--
-- /api/places-photo now looks up "any stored photo for this place" with
--   photo_name LIKE 'places/{PLACE_ID}/photos/%'
-- A plain btree index can't serve a LIKE prefix scan unless it uses
-- text_pattern_ops, so add one. Cheap, and keeps the proxy fast as the
-- photo_cache table grows.
create index if not exists photo_cache_place_prefix_idx
  on public.photo_cache (photo_name text_pattern_ops);
