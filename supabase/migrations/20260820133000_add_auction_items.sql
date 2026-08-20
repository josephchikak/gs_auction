create table if not exists public.auction_items (
  id text primary key,
  name text not null,
  description text not null,
  category text not null,
  image text not null,
  starting_bid integer not null check (starting_bid >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.auction_items enable row level security;

drop policy if exists "Anyone can view active auction items" on public.auction_items;

create policy "Anyone can view active auction items"
  on public.auction_items
  for select
  using (is_active = true);
