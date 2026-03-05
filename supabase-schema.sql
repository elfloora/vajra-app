-- ============================================================
-- VAJRA APP — Supabase Schema
-- Supabase Dashboard > SQL Editor'a yapıştır ve çalıştır
-- ============================================================

-- Sessions tablosu
create table public.sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  started_at timestamptz not null,
  completed_at timestamptz not null,
  duration_minutes integer not null default 0,
  depth_reached integer not null default 0,
  response_count integer not null default 0,
  patterns jsonb not null default '{}',
  insight_text text not null default '',
  closing_text text not null default '',
  created_at timestamptz default now()
);

-- Responses tablosu
create table public.responses (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references public.sessions(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  node_id text not null,
  question_text text not null default '',
  answer text not null,
  answered_at timestamptz not null,
  created_at timestamptz default now()
);

-- Profiles tablosu (opsiyonel, genişletmek için)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  avatar_url text,
  total_sessions integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- Row Level Security (RLS) — kullanıcılar sadece kendi verisini görür
-- ============================================================

alter table public.sessions enable row level security;
alter table public.responses enable row level security;
alter table public.profiles enable row level security;

-- Sessions policies
create policy "Users can view own sessions"
  on public.sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert own sessions"
  on public.sessions for insert
  with check (auth.uid() = user_id);

-- Responses policies
create policy "Users can view own responses"
  on public.responses for select
  using (auth.uid() = user_id);

create policy "Users can insert own responses"
  on public.responses for insert
  with check (auth.uid() = user_id);

-- Profiles policies
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- ============================================================
-- Trigger: yeni kullanıcı kaydında otomatik profil oluştur
-- ============================================================

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
