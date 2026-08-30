-- Step 2. Remove the write policies that grant PUBLIC, not the service role.
--
-- Step 1 (enable-rls.sql) turned RLS on, and anon could still write. The
-- reason: this project already had policies named "Service write" and
-- "Service update" that were never scoped to a role. A policy with no role
-- clause applies to PUBLIC — every role, anon included. While RLS was off
-- they sat inert; switching RLS on activated them.
--
-- In pg_policy this shows as polroles = {0}, which is why the audit query
-- rendered their roles as null while the new public_read_* policies showed
-- {authenticated,anon}.
--
-- These policies were never doing any work: service_role bypasses RLS
-- entirely, so it never needed a policy. Their only effect was to grant
-- INSERT and UPDATE to the public. Dropping them costs nothing and closes
-- the hole.
--
-- SELECT policies are deliberately left alone. Reads are meant to be public,
-- and not touching them means this cannot break a page.
--
-- Nothing here reads, changes or deletes a single row. Supabase will warn
-- about "destructive operations" because of the DROP keyword; it is dropping
-- permissions, not data.
--
-- Prerequisite, already deployed: /api/sync-video was upserting through the
-- anon client. It is on supabaseAdmin now. That was the only write in the
-- codebase these policies were propping up.

drop policy if exists "Service write"                on public.places;
drop policy if exists "Service update"               on public.places;
drop policy if exists "Service write"                on public.articles;
drop policy if exists "Service write articles update" on public.articles;
drop policy if exists "Service role insert events"   on public.events;
drop policy if exists "Service role update events"   on public.events;
drop policy if exists "Service write"                on public.transcripts;
drop policy if exists "Service write"                on public.video_page_associations;
drop policy if exists "Service write"                on public.youtube_videos;

-- Verify: every remaining policy should be SELECT. Any row showing INSERT,
-- UPDATE, DELETE or ALL is still open to the public.
select c.relname as table_name,
       p.polname as policy,
       case p.polcmd when 'r' then 'SELECT' when 'a' then 'INSERT'
            when 'w' then 'UPDATE' when 'd' then 'DELETE' else 'ALL' end as command,
       coalesce((select array_agg(r.rolname)::text from pg_roles r where r.oid = any(p.polroles)),
                'PUBLIC') as applies_to
from   pg_class c
join   pg_namespace n on n.oid = c.relnamespace
join   pg_policy p on p.polrelid = c.oid
where  n.nspname = 'public'
order  by 1, 3, 2;
