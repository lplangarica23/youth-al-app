-- ============================================================
-- youth.al — DATABASE SCHEMA (Phase 1: Opportunities + Accounts)
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor → New query)
-- ============================================================

-- Profiles: one row per user, auto-created when someone signs up.
-- Supabase Auth already stores email/password in its own auth.users
-- table (which you never touch directly) — this table holds the
-- extra info that's specific to youth.al.
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  university text,
  city text,
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on profiles for select using (true);

create policy "Users can update their own profile"
  on profiles for update using (auth.uid() = id);

-- Automatically create a profile row whenever someone signs up.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- Opportunities: the actual listings (volunteering, Erasmus+, NGO).
create table if not exists opportunities (
  id uuid default gen_random_uuid() primary key,
  category text not null check (category in ('volunteering', 'erasmus', 'ngo')),
  title_al text not null,
  title_en text not null,
  org text not null,
  location_al text not null,
  location_en text not null,
  deadline date,               -- null means "rolling deadline"
  description_al text not null,
  description_en text not null,
  link text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  submitted_by uuid references auth.users(id),
  created_at timestamptz default now()
);

alter table opportunities enable row level security;

-- Anyone (even logged-out visitors) can see approved opportunities.
create policy "Approved opportunities are public"
  on opportunities for select
  using (status = 'approved');

-- Logged-in users can submit a new opportunity (goes in as 'pending').
create policy "Authenticated users can submit opportunities"
  on opportunities for insert
  with check (auth.uid() = submitted_by);

-- Note: approving/rejecting submissions is handled by the /admin page
-- in the app, which uses Supabase's service_role key (server-side only,
-- gated by an ADMIN_EMAILS check) to update status — deliberately not
-- exposed as a regular RLS policy, since "any logged-in user can
-- approve listings" would defeat the point of having review at all.


-- Saved opportunities: Swipe Mode "likes", persisted per user.
create table if not exists saved_opportunities (
  user_id uuid references auth.users(id) on delete cascade,
  opportunity_id uuid references opportunities(id) on delete cascade,
  saved_at timestamptz default now(),
  primary key (user_id, opportunity_id)
);

alter table saved_opportunities enable row level security;

create policy "Users can view their own saved opportunities"
  on saved_opportunities for select using (auth.uid() = user_id);

create policy "Users can save opportunities for themselves"
  on saved_opportunities for insert with check (auth.uid() = user_id);

create policy "Users can unsave their own saved opportunities"
  on saved_opportunities for delete using (auth.uid() = user_id);


-- Helpful index for the common "browse approved, newest first" query.
create index if not exists opportunities_status_created_idx
  on opportunities (status, created_at desc);
