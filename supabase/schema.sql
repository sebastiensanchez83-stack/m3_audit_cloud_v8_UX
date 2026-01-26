-- M3 Audit V8 Online (UX-identical) – minimal Supabase schema
-- Run in Supabase Studio: SQL Editor.

-- 1) AUDITS TABLE (stores full audit JSON + listable metadata)
create table if not exists public.v8_audits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  audit_id text not null,
  site_name text,
  auditor_name text,
  facilities text[] not null default '{}',
  criteria_version text,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, audit_id)
);

-- keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_v8_audits_updated_at on public.v8_audits;
create trigger trg_v8_audits_updated_at
before update on public.v8_audits
for each row execute function public.set_updated_at();

alter table public.v8_audits enable row level security;

drop policy if exists "v8_audits_select_own" on public.v8_audits;
create policy "v8_audits_select_own" on public.v8_audits
for select to authenticated
using (user_id = auth.uid());

drop policy if exists "v8_audits_insert_own" on public.v8_audits;
create policy "v8_audits_insert_own" on public.v8_audits
for insert to authenticated
with check (user_id = auth.uid());

drop policy if exists "v8_audits_update_own" on public.v8_audits;
create policy "v8_audits_update_own" on public.v8_audits
for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "v8_audits_delete_own" on public.v8_audits;
create policy "v8_audits_delete_own" on public.v8_audits
for delete to authenticated
using (user_id = auth.uid());

-- 2) PUBLIC REPORT LINKS (token -> audit JSON)
create table if not exists public.v8_report_links (
  token uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  audit_id text not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

alter table public.v8_report_links enable row level security;

drop policy if exists "v8_report_links_select_own" on public.v8_report_links;
create policy "v8_report_links_select_own" on public.v8_report_links
for select to authenticated
using (user_id = auth.uid());

drop policy if exists "v8_report_links_insert_own" on public.v8_report_links;
create policy "v8_report_links_insert_own" on public.v8_report_links
for insert to authenticated
with check (user_id = auth.uid());

drop policy if exists "v8_report_links_delete_own" on public.v8_report_links;
create policy "v8_report_links_delete_own" on public.v8_report_links
for delete to authenticated
using (user_id = auth.uid());

-- Security definer RPC to allow public access to a report by token (public link)
create or replace function public.get_v8_report(p_token uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v jsonb;
begin
  select a.data into v
  from public.v8_report_links l
  join public.v8_audits a
    on a.user_id = l.user_id
   and a.audit_id = l.audit_id
  where l.token = p_token
    and l.expires_at > now();

  if v is null then
    return null;
  end if;
  return v;
end;
$$;

-- Allow anon/authenticated to call RPC
revoke all on function public.get_v8_report(uuid) from public;
grant execute on function public.get_v8_report(uuid) to anon;
grant execute on function public.get_v8_report(uuid) to authenticated;
