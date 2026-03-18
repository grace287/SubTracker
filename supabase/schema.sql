-- SubTracker Supabase Schema
-- Supabase SQL Editor에서 실행하세요

-- ── 구독 테이블 ──────────────────────────────────────────
create table if not exists public.subscriptions (
  id                 text primary key,
  user_id            uuid references auth.users(id) on delete cascade not null,
  name               text not null,
  category           text not null default 'other',
  amount             integer not null default 0,
  currency           text not null default 'KRW',
  billing_cycle      text not null default 'monthly',
  start_date         date not null,
  next_billing_date  date not null,
  is_trial           boolean not null default false,
  trial_end_date     date,
  usage_frequency    integer not null default 10,
  color              text not null default '#8B5CF6',
  notes              text,
  is_active          boolean not null default true,
  created_at         timestamptz not null default now()
);

-- ── RLS 활성화 ────────────────────────────────────────────
alter table public.subscriptions enable row level security;

-- 본인 데이터만 CRUD 가능
create policy "Users can view own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id);

create policy "Users can insert own subscriptions"
  on public.subscriptions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own subscriptions"
  on public.subscriptions for update
  using (auth.uid() = user_id);

create policy "Users can delete own subscriptions"
  on public.subscriptions for delete
  using (auth.uid() = user_id);

-- ── 인덱스 ────────────────────────────────────────────────
create index if not exists idx_subscriptions_user_id on public.subscriptions(user_id);
create index if not exists idx_subscriptions_next_billing on public.subscriptions(next_billing_date);
