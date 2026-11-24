-- Contact messages.
--
-- Ripple publishes no email address. Someone who wants a story removed, or
-- wants to report a problem, writes a message on /contact. It lands here and
-- is read on the review page. `reply_to` is whatever they chose to give so
-- they can be answered (often nothing). It is the only personal contact
-- detail in this database, so it is locked down hardest: no public reads at
-- all, and reviewers reach it only through the token-gated functions.

create table if not exists public.messages (
  id          uuid primary key default gen_random_uuid(),
  topic       text not null check (topic in ('remove', 'problem', 'other')),
  text        text not null check (char_length(text) between 1 and 2000),
  reply_to    text check (reply_to is null or char_length(reply_to) <= 160),
  ripple_code text check (ripple_code is null or char_length(ripple_code) <= 12),  -- as typed; may not exist
  status      text not null default 'new' check (status in ('new', 'done')),
  created_at  timestamptz not null default now(),
  handled_at  timestamptz
);
create index if not exists messages_status_idx on public.messages (status, created_at);

alter table public.messages enable row level security;
revoke all on public.messages from public, anon, authenticated;

-- ── the one way in ───────────────────────────────────────────────────────
create or replace function public.send_message(
  p_topic text, p_text text, p_reply_to text default null, p_code text default null)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_topic not in ('remove', 'problem', 'other') then
    raise exception 'unknown topic';
  end if;
  if (select count(*) from public.messages where created_at > now() - interval '1 hour') >= 40 then
    raise exception 'a lot of messages have come in — please try again later';
  end if;

  insert into public.messages (topic, text, reply_to, ripple_code)
  values (
    p_topic,
    trim(p_text),
    nullif(trim(coalesce(p_reply_to, '')), ''),
    nullif(upper(trim(coalesce(p_code, ''))), '')
  );
end;
$$;

-- ── review ───────────────────────────────────────────────────────────────
create or replace function public.review_messages(p_token text, p_status text default 'new')
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
  if p_status not in ('new', 'done') then
    raise exception 'unknown status';
  end if;

  return coalesce((
    select jsonb_agg(row_to_json(x) order by x.created_at desc)
    from (
      select m.id, m.topic, m.text, m.reply_to, m.ripple_code, m.status, m.created_at, m.handled_at
      from public.messages m
      where m.status = p_status
      order by m.created_at desc
      limit 200
    ) x
  ), '[]'::jsonb);
end;
$$;

create or replace function public.review_message_set(p_token text, p_id uuid, p_status text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not private.is_reviewer(p_token) then
    raise exception 'not authorised' using errcode = '42501';
  end if;
  if p_status not in ('new', 'done') then
    raise exception 'unknown status';
  end if;

  update public.messages
  set status = p_status,
      handled_at = case when p_status = 'done' then now() else null end
  where id = p_id;

  if not found then
    raise exception 'message not found';
  end if;
end;
$$;

-- How many are waiting, for the review page's tab. Kept separate from
-- review_stats() so that function stays about the ripples themselves.
create or replace function public.review_message_count(p_token text)
returns integer
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not private.is_reviewer(p_token) then
    raise exception 'not authorised' using errcode = '42501';
  end if;
  return (select count(*)::int from public.messages where status = 'new');
end;
$$;

revoke all on function public.send_message(text, text, text, text)       from public, authenticated;
revoke all on function public.review_messages(text, text)                from public, authenticated;
revoke all on function public.review_message_set(text, uuid, text)       from public, authenticated;
revoke all on function public.review_message_count(text)                 from public, authenticated;
grant execute on function public.send_message(text, text, text, text)    to anon;
grant execute on function public.review_messages(text, text)             to anon;
grant execute on function public.review_message_set(text, uuid, text)    to anon;
grant execute on function public.review_message_count(text)              to anon;
