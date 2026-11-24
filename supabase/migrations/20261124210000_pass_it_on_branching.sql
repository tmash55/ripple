-- Pass It On branching.
--
-- A ripple is now one of two kinds:
--   card  a printed card. It changes hands, so its stories form a CHAIN:
--         each new story's parent is the latest story on the card.
--   link  a personal link someone made with "Pass it on". Everyone who opens
--         that link received it from the same person, so their stories are
--         SIBLINGS: each one's parent is the story the link branched from.
--
-- Generation = how many recorded stories lie between the original card and
-- this one, counting this one. A person who passes a link on without
-- recording anything is invisible, so chains are under-counted, never
-- over-counted.
--
-- Additive and backward compatible: record_moment() keeps its signature and
-- behaviour for cards.

alter table public.ripples
  add column if not exists kind text not null default 'card' check (kind in ('card', 'link')),
  add column if not exists parent_ripple_id uuid references public.ripples (id),
  add column if not exists root_ripple_id   uuid references public.ripples (id),
  add column if not exists base_generation  integer not null default 0 check (base_generation >= 0);

create index if not exists ripples_parent_idx       on public.ripples (parent_ripple_id);
create index if not exists ripples_kind_created_idx on public.ripples (kind, created_at);

-- ── a fresh, unused code in the same alphabet as the printed cards ───────
create or replace function private.new_ripple_code()
returns text
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_alphabet constant text := '23456789BCDFGHJKMNPQRSTVWXYZ';
  v_code text;
begin
  loop
    select string_agg(substr(v_alphabet, 1 + floor(random() * length(v_alphabet))::int, 1), '')
      into v_code
      from generate_series(1, 6);
    exit when not exists (select 1 from public.ripples r where r.code = v_code);
  end loop;
  return v_code;
end;
$$;
revoke all on function private.new_ripple_code() from public, anon, authenticated;

-- ── recording a story (returns its id so the device can remember it) ─────
create or replace function public.add_moment(p_code text, p_text text, p_place text default null)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ripple public.ripples%rowtype;
  v_parent public.moments%rowtype;
  v_parent_id uuid;
  v_generation integer;
  v_id uuid;
begin
  select * into v_ripple from public.ripples where code = upper(trim(coalesce(p_code, '')));
  if not found then
    raise exception 'unknown ripple code';
  end if;

  -- Abuse brakes; everything still lands as 'pending' for a person to read.
  if (select count(*) from public.moments
      where ripple_id = v_ripple.id and created_at > now() - interval '1 hour') >= 20 then
    raise exception 'this ripple has had a lot of entries in the last hour — try again later';
  end if;
  if (select count(*) from public.moments
      where created_at > now() - interval '1 hour') >= 300 then
    raise exception 'ripple is receiving a lot of entries right now — try again later';
  end if;

  if v_ripple.kind = 'link' then
    -- Siblings: everyone on this link got it from the same place.
    v_parent_id  := v_ripple.parent_moment_id;
    v_generation := v_ripple.base_generation + 1;
  else
    -- Chain: the card moved on from whoever wrote the latest story.
    select * into v_parent
    from public.moments
    where ripple_id = v_ripple.id and status <> 'hidden'
    order by generation desc, created_at desc, id desc
    limit 1;

    if found then
      v_parent_id  := v_parent.id;
      v_generation := v_parent.generation + 1;
    else
      v_parent_id  := v_ripple.parent_moment_id;
      v_generation := v_ripple.base_generation + 1;
    end if;
  end if;

  insert into public.moments (ripple_id, ripple_code, parent_moment_id, generation, text, place, status)
  values (
    v_ripple.id,
    v_ripple.code,
    v_parent_id,
    v_generation,
    trim(p_text),
    nullif(trim(coalesce(p_place, '')), ''),
    'pending'
  )
  returning id into v_id;

  return v_id;
end;
$$;

-- Kept for the previous version of the site, which calls it by this name.
create or replace function public.record_moment(p_code text, p_text text, p_place text default null)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.add_moment(p_code, p_text, p_place);
end;
$$;

-- ── pass it on: make a personal link that branches from here ─────────────
-- p_moment_id is the story this device recorded on p_code, if it recorded
-- one. It is only trusted if it really belongs to that ripple.
create or replace function public.pass_it_on(p_code text, p_moment_id uuid default null)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_from public.ripples%rowtype;
  v_moment public.moments%rowtype;
  v_parent_moment uuid;
  v_base integer;
  v_code text;
begin
  select * into v_from from public.ripples where code = upper(trim(coalesce(p_code, '')));
  if not found then
    raise exception 'unknown ripple code';
  end if;

  if (select count(*) from public.ripples
      where parent_ripple_id = v_from.id and created_at > now() - interval '1 hour') >= 30 then
    raise exception 'this ripple has been passed on a lot in the last hour — try again later';
  end if;
  if (select count(*) from public.ripples
      where kind = 'link' and created_at > now() - interval '1 hour') >= 500 then
    raise exception 'ripple is making a lot of links right now — try again later';
  end if;

  if p_moment_id is not null then
    select * into v_moment from public.moments
    where id = p_moment_id and ripple_id = v_from.id and status <> 'hidden';
  end if;

  if v_moment.id is not null then
    -- The sharer told their story here: the link continues from it.
    v_parent_moment := v_moment.id;
    v_base          := v_moment.generation;
  elsif v_from.kind = 'link' then
    -- No story from the sharer: the link continues from wherever theirs did.
    v_parent_moment := v_from.parent_moment_id;
    v_base          := v_from.base_generation;
  else
    -- A card with no story from the sharer: continue from the card's latest stop.
    select * into v_moment from public.moments
    where ripple_id = v_from.id and status <> 'hidden'
    order by generation desc, created_at desc, id desc
    limit 1;
    v_parent_moment := v_moment.id;
    v_base          := coalesce(v_moment.generation, v_from.base_generation);
  end if;

  v_code := private.new_ripple_code();

  insert into public.ripples
    (code, kind, number, batch_id, message, parent_ripple_id, parent_moment_id, base_generation, root_ripple_id)
  values
    (v_code, 'link', null, v_from.batch_id, v_from.message, v_from.id, v_parent_moment, v_base,
     coalesce(v_from.root_ripple_id, v_from.id));

  return v_code;
end;
$$;

-- ── everything a ripple's page needs, in one call ────────────────────────
-- Returns null for an unknown code. Only approved stories are returned, but
-- the walk back to the original card passes through unapproved ones.
create or replace function public.ripple_journey(p_code text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_r     public.ripples%rowtype;
  v_root  public.ripples%rowtype;
  v_batch public.batches%rowtype;
  v_moments jsonb;
begin
  select * into v_r from public.ripples where code = upper(trim(coalesce(p_code, '')));
  if not found then
    return null;
  end if;
  select * into v_root  from public.ripples where id = coalesce(v_r.root_ripple_id, v_r.id);
  select * into v_batch from public.batches where id = v_root.batch_id;

  with recursive up as (
    select m.id, m.parent_moment_id, m.text, m.place, m.generation, m.created_at, m.status
    from public.moments m where m.id = v_r.parent_moment_id
    union all
    select p.id, p.parent_moment_id, p.text, p.place, p.generation, p.created_at, p.status
    from public.moments p join up on p.id = up.parent_moment_id
  ),
  shown as (
    select u.id, u.text, u.place, u.generation, u.created_at, false as here
    from up u where u.status = 'approved'
    union all
    select m.id, m.text, m.place, m.generation, m.created_at, true
    from public.moments m where m.ripple_id = v_r.id and m.status = 'approved'
  )
  select coalesce(jsonb_agg(jsonb_build_object(
           'id', s.id, 'text', s.text, 'place', s.place,
           'generation', s.generation, 'created_at', s.created_at, 'here', s.here)
         order by s.generation, s.created_at, s.id), '[]'::jsonb)
    into v_moments
    from shown s;

  return jsonb_build_object(
    'code',        v_r.code,
    'kind',        v_r.kind,
    'message',     v_r.message,
    'number',      v_r.number,
    'root_number', v_root.number,
    'root_code',   v_root.code,
    'batch_name',  v_batch.name,
    'place',       v_batch.place,
    'released_on', v_batch.released_on,
    'moments',     v_moments
  );
end;
$$;

-- ── review: show which card a link traces back to ────────────────────────
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
      select m.id, m.ripple_code, r.kind as ripple_kind, r.number as ripple_number,
             root.number as root_number, r.message as ripple_message,
             m.generation, m.text, m.place, m.status, m.created_at, m.reviewed_at
      from public.moments m
      join public.ripples r on r.id = m.ripple_id
      join public.ripples root on root.id = coalesce(r.root_ripple_id, r.id)
      where m.status = p_status
      order by m.created_at desc
      limit least(greatest(coalesce(p_limit, 200), 1), 500)
    ) x
  ), '[]'::jsonb);
end;
$$;

-- ── review: the numbers, now lineage-aware ───────────────────────────────
-- longest_chain counts APPROVED stories along a line of descent, so hidden
-- or unread entries can never inflate it.
create or replace function public.review_stats(p_token text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_longest integer;
begin
  if not private.is_reviewer(p_token) then
    raise exception 'not authorised' using errcode = '42501';
  end if;

  with recursive walk as (
    select m.id as leaf, m.parent_moment_id as next_id, 1 as depth
    from public.moments m where m.status = 'approved'
    union all
    select w.leaf, p.parent_moment_id, w.depth + (p.status = 'approved')::int
    from walk w join public.moments p on p.id = w.next_id
  )
  select coalesce(max(depth), 0) into v_longest from walk;

  return jsonb_build_object(
    'cards',            (select count(*) from public.ripples where kind = 'card'),
    'links',            (select count(*) from public.ripples where kind = 'link'),
    'scans',            (select count(*) from public.events e join public.ripples r on r.code = e.ripple_code
                           where e.type = 'scan' and r.kind = 'card'),
    'link_opens',       (select count(*) from public.events e join public.ripples r on r.code = e.ripple_code
                           where e.type = 'scan' and r.kind = 'link'),
    'scan_sessions',    (select count(distinct session_hash) from public.events where type = 'scan'),
    'cards_scanned',    (select count(distinct e.ripple_code) from public.events e join public.ripples r on r.code = e.ripple_code
                           where e.type = 'scan' and r.kind = 'card'),
    'shares',           (select count(*) from public.events where type = 'share'),
    'pending',          (select count(*) from public.moments where status = 'pending'),
    'approved',         (select count(*) from public.moments where status = 'approved'),
    'hidden',           (select count(*) from public.moments where status = 'hidden'),
    'cards_with_story', (select count(distinct ripple_code) from public.moments where status = 'approved'),
    'longest_chain',    v_longest,
    'places',           (select count(distinct lower(trim(place))) from public.moments
                           where status = 'approved' and place is not null)
  );
end;
$$;

-- ── who may call what ────────────────────────────────────────────────────
revoke all on function public.add_moment(text, text, text)   from public, authenticated;
revoke all on function public.pass_it_on(text, uuid)         from public, authenticated;
revoke all on function public.ripple_journey(text)           from public, authenticated;
grant execute on function public.add_moment(text, text, text) to anon;
grant execute on function public.pass_it_on(text, uuid)       to anon;
grant execute on function public.ripple_journey(text)         to anon;
