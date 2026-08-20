alter table public.bids
  add column if not exists status text not null default 'pending';

alter table public.bids
  drop constraint if exists bids_status_check;

alter table public.bids
  add constraint bids_status_check
  check (status in ('pending', 'accepted'));
