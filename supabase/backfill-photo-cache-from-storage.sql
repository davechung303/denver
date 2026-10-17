-- One-off backfill. Run in the Supabase SQL editor after the places-photo fix ships.
--
-- For months /api/places-photo uploaded every Google photo it fetched to the
-- place-photos bucket but never wrote the matching photo_cache row (the upsert
-- was an un-awaited supabase-js builder, which never sends its request). So
-- Storage knows about far more photos than photo_cache does, and every hit on
-- one of those places is still a paid Google fetch instead of a free 301.
--
-- This reads the bucket's object list straight from storage.objects and inserts
-- the rows photo_cache is missing. Idempotent: re-running inserts nothing new.

-- 1. Dry run — how many rows would be added?
select count(*) as missing_rows
from storage.objects o
left join public.photo_cache pc
  on pc.photo_name = regexp_replace(o.name, '\.(jpe?g|png|webp)$', '')
where o.bucket_id = 'place-photos'
  and o.name ~ '^places/[A-Za-z0-9_-]+/photos/[A-Za-z0-9_-]+\.(jpe?g|png|webp)$'
  and pc.photo_name is null;

-- 2. Backfill.
insert into public.photo_cache (photo_name, cdn_url)
select
  regexp_replace(o.name, '\.(jpe?g|png|webp)$', '') as photo_name,
  'https://bbmlumdpagxnthyqumif.supabase.co/storage/v1/object/public/place-photos/' || o.name as cdn_url
from storage.objects o
where o.bucket_id = 'place-photos'
  and o.name ~ '^places/[A-Za-z0-9_-]+/photos/[A-Za-z0-9_-]+\.(jpe?g|png|webp)$'
on conflict (photo_name) do nothing;

-- 3. Sanity check — distinct places now covered.
select count(*) as cached_photos,
       count(distinct split_part(photo_name, '/', 2)) as cached_places
from public.photo_cache;
