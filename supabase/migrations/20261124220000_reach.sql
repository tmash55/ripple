-- "Things that reached me": what happened after you.
--
-- A device remembers, privately, the id of the story it wrote and the code
-- of the link it made. Given either one, this returns only counts: how many
-- approved stories came after, how many generations further it went, how
-- many places, and roughly how often the link was opened. No text, no
-- places by name, nothing about who.
--
--   p_moment_id  everything descended from that story
--   p_link_code  used when the person passed it on without writing a story:
--                everything recorded on that link and on links made from it
create or replace function public.reach(p_moment_id uuid default null, p_link_code text default null)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_m public.moments%rowtype;
  v_l public.ripples%rowtype;
  v_stories integer := 0;
  v_generations integer := 0;
  v_places integer := 0;
  v_opens integer;
begin
  if p_moment_id is not null then
    select * into v_m from public.moments where id = p_moment_id;
  end if;
  if p_link_code is not null then
    select * into v_l from public.ripples
    where code = upper(trim(p_link_code)) and kind = 'link';
  end if;
  if v_m.id is null and v_l.id is null then
    return null;
  end if;

  if v_m.id is not null then
    with recursive down as (
      select c.id, c.generation, c.place, c.status
      from public.moments c where c.parent_moment_id = v_m.id
      union all
      select c.id, c.generation, c.place, c.status
      from public.moments c join down d on c.parent_moment_id = d.id
    )
    select count(*) filter (where d.status = 'approved'),
           coalesce(max(d.generation) filter (where d.status = 'approved') - v_m.generation, 0),
           count(distinct lower(trim(d.place))) filter (where d.status = 'approved' and d.place is not null)
      into v_stories, v_generations, v_places
      from down d;
  else
    with recursive sub as (
      select r.id from public.ripples r where r.id = v_l.id
      union all
      select r.id from public.ripples r join sub s on r.parent_ripple_id = s.id
    )
    select count(*) filter (where m.status = 'approved'),
           coalesce(max(m.generation) filter (where m.status = 'approved') - v_l.base_generation, 0),
           count(distinct lower(trim(m.place))) filter (where m.status = 'approved' and m.place is not null)
      into v_stories, v_generations, v_places
      from public.moments m
      where m.ripple_id in (select s.id from sub s);
  end if;

  if v_l.id is not null then
    -- Distinct daily sessions, so one person reloading doesn't inflate it.
    select count(distinct coalesce(e.session_hash, e.id::text)) into v_opens
    from public.events e
    where e.ripple_code = v_l.code and e.type = 'scan';
  end if;

  return jsonb_build_object(
    'story_status',      v_m.status,
    'stories_after',     v_stories,
    'generations_after', greatest(v_generations, 0),
    'places_after',      v_places,
    'link_opens',        v_opens
  );
end;
$$;

revoke all on function public.reach(uuid, text) from public, authenticated;
grant execute on function public.reach(uuid, text) to anon;
