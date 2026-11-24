-- ════════════════════════════════════════════════════════════════════════
-- DRAFT — NOT APPLIED ANYWHERE. No Supabase project exists for Ripple yet.
-- Review, then apply to a NEW project (never the Unjuiced database).
-- lib/store.ts is written against exactly this shape.
-- ════════════════════════════════════════════════════════════════════════
--
-- Model: events and lineage, not people. There is no users table.
--
--   batch   a seeding run                    "GENESIS — Ankeny, Iowa — Nov/Dec 2026"
--   ripple  one artifact with one permanent  a printed card today; later also a
--           code / QR                        personal share link (a branch)
--   moment  one recorded stop in a ripple's  "what reached you", optional town
--           story
--   event   anonymous funnel logging         scan → record → share
--
-- Lineage: every moment points at the moment before it (parent_moment_id),
-- and a ripple created by "Pass it on" points at the moment it branched
-- from (ripples.parent_moment_id). Generation = depth along those pointers.
-- A card fresh from the printer is generation 0; the first person to record
-- on it is generation 1.

create extension if not exists pgcrypto;

-- ── batches ──────────────────────────────────────────────────────────────
create table public.batches (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,              -- 'genesis'
  name        text not null,                     -- 'GENESIS'
  title       text not null,                     -- 'GENESIS — Ankeny, Iowa — November/December 2026'
  place       text,                              -- 'Ankeny, Iowa' (town level only)
  released_on date,
  created_at  timestamptz not null default now()
);

-- ── ripples ──────────────────────────────────────────────────────────────
create table public.ripples (
  id               uuid primary key default gen_random_uuid(),
  code             text not null unique
                     check (code ~ '^[2-9BCDFGHJKMNPQRSTVWXYZ]{6}$'),
  number           integer,                      -- 1…50 within the batch; null for digital branches
  batch_id         uuid references public.batches (id),
  message          text not null,
  parent_moment_id uuid,                         -- set when this ripple branched from a moment (FK added below)
  created_at       timestamptz not null default now(),
  unique (batch_id, number)
);

-- ── moments ──────────────────────────────────────────────────────────────
create table public.moments (
  id               uuid primary key default gen_random_uuid(),
  ripple_id        uuid not null references public.ripples (id),
  ripple_code      text not null references public.ripples (code),  -- denormalised for simple public reads
  parent_moment_id uuid references public.moments (id),
  generation       integer not null check (generation >= 1),
  text             text not null check (char_length(text) between 1 and 500),
  place            text check (place is null or char_length(place) <= 80),  -- typed by hand; never GPS
  status           text not null default 'pending'
                     check (status in ('pending', 'approved', 'hidden')),
  created_at       timestamptz not null default now(),
  reviewed_at      timestamptz
);

alter table public.ripples
  add constraint ripples_parent_moment_fk
  foreign key (parent_moment_id) references public.moments (id);

create index moments_ripple_created_idx on public.moments (ripple_code, created_at, id);
create index moments_status_idx         on public.moments (status, created_at);
create index moments_parent_idx         on public.moments (parent_moment_id);

-- ── events ───────────────────────────────────────────────────────────────
-- Funnel only. session_hash is sha256(salt | UTC day | ip | user agent),
-- truncated, computed in the app (lib/store.ts → hashSession). It rotates
-- daily. Raw IP addresses are never written to this database.
create table public.events (
  id           bigint generated always as identity primary key,
  ripple_code  text not null references public.ripples (code),
  type         text not null check (type in ('scan', 'record', 'share')),
  session_hash text,
  created_at   timestamptz not null default now()
);
create index events_ripple_type_idx on public.events (ripple_code, type, created_at);

-- ── recording a moment ───────────────────────────────────────────────────
-- The public never inserts into moments directly. This function is the one
-- door: it resolves the card, works out parent + generation, and always
-- writes status = 'pending' no matter what the caller sends.
create or replace function public.record_moment(p_code text, p_text text, p_place text default null)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ripple public.ripples%rowtype;
  v_parent public.moments%rowtype;
  v_parent_id uuid;
  v_generation integer;
begin
  select * into v_ripple from public.ripples where code = upper(trim(p_code));
  if not found then
    raise exception 'unknown ripple code';
  end if;

  -- Parent = the latest stop on this ripple that hasn't been hidden…
  select * into v_parent
  from public.moments
  where ripple_id = v_ripple.id and status <> 'hidden'
  order by created_at desc, id desc
  limit 1;

  if found then
    v_parent_id  := v_parent.id;
    v_generation := v_parent.generation + 1;
  elsif v_ripple.parent_moment_id is not null then
    -- …or, for the first stop on a branched ripple, the moment it branched from.
    select generation + 1 into v_generation
    from public.moments where id = v_ripple.parent_moment_id;
    v_parent_id := v_ripple.parent_moment_id;
  else
    v_parent_id  := null;
    v_generation := 1;
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
  );
end;
$$;

revoke all on function public.record_moment(text, text, text) from public;
grant execute on function public.record_moment(text, text, text) to anon;

-- ── row level security ───────────────────────────────────────────────────
alter table public.batches enable row level security;
alter table public.ripples enable row level security;
alter table public.moments enable row level security;
alter table public.events  enable row level security;

-- Batches and ripples hold nothing private (a code and a kind sentence).
create policy "batches are public"  on public.batches for select to anon using (true);
create policy "ripples are public"  on public.ripples for select to anon using (true);

-- Moments: the public reads APPROVED rows only. No insert/update/delete
-- policy for anon — writes go through record_moment(), which forces
-- 'pending'. Pending and hidden moments are visible only to the service
-- role (the moderation page, when it exists, runs server-side).
create policy "approved moments are public" on public.moments
  for select to anon using (status = 'approved');

-- Events: insert-only for the public; nobody but the service role reads them.
create policy "anyone may log an event" on public.events
  for insert to anon with check (type in ('scan', 'record', 'share'));

-- ── seed ─────────────────────────────────────────────────────────────────
insert into public.batches (slug, name, title, place, released_on)
values ('genesis', 'GENESIS', 'GENESIS — Ankeny, Iowa — November/December 2026', 'Ankeny, Iowa', '2026-11-24');

-- The 50 ripples are NOT seeded here on purpose: their codes live in
-- data/genesis-codes.json (permanent) and their messages in
-- data/genesis-messages.ts (draft until the client signs off). Generate the
-- insert from those two files once the wording is final, so the database
-- and the printed cards can't drift apart.

-- ── open questions before applying ───────────────────────────────────────
-- 1. Abuse: nothing here rate-limits record_moment(). Add a per-session
--    daily cap (events.session_hash) or put Vercel BotID / a firewall rule
--    in front of the form before the cards are in the wild at scale.
-- 2. A pending moment counts as a parent. If it is later hidden, its
--    children keep their generation number. Decide whether moderation
--    should re-parent, or whether generation should only ever be computed
--    over approved moments at read time.
-- 3. Dashboard numbers ("longest known chain", "beyond our view") are
--    recursive queries over parent_moment_id — add views when the
--    dashboard is built rather than guessing their shape now.
