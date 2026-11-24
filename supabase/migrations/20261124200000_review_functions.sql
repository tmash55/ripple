-- Story review (moderation) and the small behaviour dashboard.
--
-- The website has no database admin key. Instead the server holds one long
-- random "review token" (env RIPPLE_REVIEW_TOKEN). Only its SHA-256 hash is
-- stored here, in a schema the public API cannot reach. Each function below
-- checks the token first and then does exactly one narrow job, so the worst
-- a leaked token can do is read stories and change their status — it cannot
-- edit cards, delete anything, or reach other tables.

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table if not exists private.review_tokens (
  token_sha256 text primary key check (token_sha256 ~ '^[0-9a-f]{64}$'),
  label        text not null,
  created_at   timestamptz not null default now()
);
revoke all on private.review_tokens from public, anon, authenticated;

create or replace function private.is_reviewer(p_token text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from private.review_tokens t
    where t.token_sha256 = encode(sha256(convert_to(coalesce(p_token, ''), 'UTF8')), 'hex')
  );
$$;
revoke all on function private.is_reviewer(text) from public, anon, authenticated;

-- ── list stories by status ───────────────────────────────────────────────
create or replace function public.review_list(p_token text, p_status text default 'pending', p_limit integer default 200)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not private.is_reviewer(p_token) then
    raise exception 'not authorised' using errcode = '42501';
  end if;
  if p_status not in ('pending', 'approved', 'hidden') then
    raise exception 'unknown status';
  end if;

  return coalesce((
    select jsonb_agg(row_to_json(x) order by x.created_at desc)
    from (
      select m.id, m.ripple_code, r.number as ripple_number, r.message as ripple_message,
             m.generation, m.text, m.place, m.status, m.created_at, m.reviewed_at
      from public.moments m
      join public.ripples r on r.id = m.ripple_id
      where m.status = p_status
      order by m.created_at desc
      limit least(greatest(coalesce(p_limit, 200), 1), 500)
    ) x
  ), '[]'::jsonb);
end;
$$;

-- ── approve / hide / send back to pending ────────────────────────────────
create or replace function public.review_set_status(p_token text, p_id uuid, p_status text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not private.is_reviewer(p_token) then
    raise exception 'not authorised' using errcode = '42501';
  end if;
  if p_status not in ('pending', 'approved', 'hidden') then
    raise exception 'unknown status';
  end if;

  update public.moments
  set status = p_status,
      reviewed_at = case when p_status = 'pending' then null else now() end
  where id = p_id;

  if not found then
    raise exception 'moment not found';
  end if;
end;
$$;

-- ── the numbers worth watching ───────────────────────────────────────────
-- scans → records → shares, plus how far the longest approved chain has
-- gone. "Sessions" are the daily-rotating hashes, so they count devices per
-- day, not people.
create or replace function public.review_stats(p_token text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not private.is_reviewer(p_token) then
    raise exception 'not authorised' using errcode = '42501';
  end if;

  return jsonb_build_object(
    'cards',            (select count(*) from public.ripples),
    'scans',            (select count(*) from public.events where type = 'scan'),
    'scan_sessions',    (select count(distinct session_hash) from public.events where type = 'scan'),
    'cards_scanned',    (select count(distinct ripple_code) from public.events where type = 'scan'),
    'shares',           (select count(*) from public.events where type = 'share'),
    'pending',          (select count(*) from public.moments where status = 'pending'),
    'approved',         (select count(*) from public.moments where status = 'approved'),
    'hidden',           (select count(*) from public.moments where status = 'hidden'),
    'cards_with_story', (select count(distinct ripple_code) from public.moments where status = 'approved'),
    'longest_chain',    (select coalesce(max(n), 0) from (
                           select count(*) as n from public.moments
                           where status = 'approved' group by ripple_id) c),
    'places',           (select count(distinct lower(trim(place))) from public.moments
                           where status = 'approved' and place is not null)
  );
end;
$$;

revoke all on function public.review_list(text, text, integer)      from public, authenticated;
revoke all on function public.review_set_status(text, uuid, text)   from public, authenticated;
revoke all on function public.review_stats(text)                    from public, authenticated;
grant execute on function public.review_list(text, text, integer)    to anon;
grant execute on function public.review_set_status(text, uuid, text) to anon;
grant execute on function public.review_stats(text)                  to anon;
