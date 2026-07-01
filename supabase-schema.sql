-- Run this in Supabase SQL Editor

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  phone text,
  created_at timestamptz default now(),
  onboarding_complete boolean default false,
  sports text[],
  betting_style text,
  experience text,
  fantasy_focus text[],
  time_spent text,
  research_style text,
  found_us text,
  stripe_customer_id text,
  subscription_status text default 'none',
  subscription_tier text,
  trial_ends_at timestamptz
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete set null,
  email text,
  stripe_event_id text,
  stripe_subscription_id text,
  tier text,
  amount_cents int,
  status text,
  created_at timestamptz default now()
);

create table if not exists activity_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  type text,
  input jsonb,
  output jsonb,
  created_at timestamptz default now()
);

alter table profiles enable row level security;
alter table orders enable row level security;
alter table activity_log enable row level security;

create policy "Users view own profile" on profiles for select using (auth.uid() = id);
create policy "Users update own profile" on profiles for update using (auth.uid() = id);
create policy "Users view own activity" on activity_log for select using (auth.uid() = user_id);
create policy "Users insert own activity" on activity_log for insert with check (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
