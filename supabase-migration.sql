-- ============================================
-- AIStack Builder — Supabase Migration
-- Run this in the Supabase SQL Editor
-- ============================================

-- 1. Businesses (dashboard data)
create table businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id text not null,
  result jsonb not null,
  answers jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index idx_businesses_owner on businesses (owner_id);

-- 2. Employees
create table employees (
  id uuid primary key,
  owner_id text not null,
  name text not null,
  email text not null,
  role text not null,
  department text not null,
  answers jsonb not null default '{}',
  recommended_tools jsonb not null default '[]',
  created_at timestamptz not null default now()
);

create index idx_employees_owner on employees (owner_id);

-- 3. Employee goals
create table employee_goals (
  id uuid primary key,
  employee_id uuid not null references employees (id) on delete cascade,
  title text not null,
  description text not null default '',
  deadline date not null,
  status text not null default 'not-started',
  created_at timestamptz not null default now()
);

create index idx_goals_employee on employee_goals (employee_id);

-- 4. Activity log
create table activity_log (
  id uuid primary key,
  employee_id uuid not null references employees (id) on delete cascade,
  tool_name text not null,
  action text not null,
  created_at timestamptz not null default now()
);

create index idx_activity_employee on activity_log (employee_id);

-- 5. Enterprise subscriptions
create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  owner_id text not null,
  tool_id text not null,
  tool_name text not null,
  website text not null,
  seats int not null default 5,
  seats_used int not null default 0,
  monthly_cost numeric not null default 0,
  created_at timestamptz not null default now()
);

create index idx_subscriptions_owner on subscriptions (owner_id);

-- ============================================
-- Row Level Security (public access for now)
-- Tighten when you add Supabase Auth
-- ============================================

alter table businesses enable row level security;
alter table employees enable row level security;
alter table employee_goals enable row level security;
alter table activity_log enable row level security;
alter table subscriptions enable row level security;

-- Allow all operations via anon key (restrict later with auth)
create policy "Allow all on businesses" on businesses for all using (true) with check (true);
create policy "Allow all on employees" on employees for all using (true) with check (true);
create policy "Allow all on employee_goals" on employee_goals for all using (true) with check (true);
create policy "Allow all on activity_log" on activity_log for all using (true) with check (true);
create policy "Allow all on subscriptions" on subscriptions for all using (true) with check (true);
