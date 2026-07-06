-- Supabase SQL 스키마 (무료 티어)
-- Supabase Dashboard > SQL Editor에서 실행하세요

create table if not exists photos (
  id uuid default gen_random_uuid() primary key,
  url text not null,
  caption text default '',
  author text not null,
  created_at timestamptz default now()
);

create table if not exists guestbook (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  message text not null,
  created_at timestamptz default now()
);

-- Storage bucket: Dashboard > Storage > New bucket > "photos" (public)

alter table photos enable row level security;
alter table guestbook enable row level security;

create policy "Anyone can read photos" on photos for select using (true);
create policy "Anyone can insert photos" on photos for insert with check (true);
create policy "Anyone can read guestbook" on guestbook for select using (true);
create policy "Anyone can insert guestbook" on guestbook for insert with check (true);
