-- Lock down the public API. Run this in the Supabase SQL editor.
--
-- Why: every table below was readable, writable AND deletable by anyone
-- holding the publishable key — and that key ships in the site's JavaScript
-- bundle, so it is public by design. Confirmed August 29, 2026 by issuing
-- PATCH and DELETE against all nine tables with the publishable key: every
-- one returned 204.
--
-- What this does: turns on row-level security and grants anon/authenticated
-- SELECT only. The service_role key bypasses RLS entirely, so every
-- server-side write in the app (supabaseAdmin, 32 call sites) keeps working
-- unchanged. Reads are unaffected, so no page changes behavior.
--
-- Before running, confirm SUPABASE_SERVICE_ROLE_KEY is set in the Vercel
-- Production environment. It is — review summaries are being written on page
-- render through supabaseAdmin — but check it anyway, because if it were
-- missing the app falls back to the anon key and every write would start
-- failing the moment this runs.
--
-- Safe to re-run: policies are dropped and recreated.
--
-- THIS FILE IS NOT SUFFICIENT ON ITS OWN. Running it left anon still able to
-- write, because the project already carried policies named "Service write"
-- and "Service update" that were never scoped to a role and therefore applied
-- to PUBLIC. Run drop-public-write-policies.sql next.

do $$
declare t text;
begin
  foreach t in array array[
    'places',
    'events',
    'articles',
    'youtube_videos',
    'fever_events',
    'video_page_associations',
    'photo_cache',
    'place_snapshots',
    'transcripts'
  ]
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists %I on public.%I', 'public_read_' || t, t);
    execute format(
      'create policy %I on public.%I for select to anon, authenticated using (true)',
      'public_read_' || t, t
    );
  end loop;
end $$;

-- Verify: every table should show rowsecurity = true and exactly one policy,
-- cmd = SELECT, roles = {anon,authenticated}.
select c.relname                as table_name,
       c.relrowsecurity         as rls_enabled,
       p.polname                as policy,
       case p.polcmd when 'r' then 'SELECT' else p.polcmd::text end as command
from   pg_class c
join   pg_namespace n on n.oid = c.relnamespace
left   join pg_policy p on p.polrelid = c.oid
where  n.nspname = 'public'
  and  c.relname in ('places','events','articles','youtube_videos','fever_events',
                     'video_page_associations','photo_cache','place_snapshots','transcripts')
order  by c.relname;
