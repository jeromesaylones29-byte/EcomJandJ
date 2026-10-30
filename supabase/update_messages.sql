-- Run once in Supabase > SQL Editor (safe to re-run). Sets up the table behind the Contact form.
create table if not exists public.messages (
  id bigserial primary key, name text, email text, message text, created_at timestamptz default now());

-- columns added for the new contact form
alter table public.messages add column if not exists user_id uuid references auth.users on delete set null;
alter table public.messages add column if not exists is_read boolean not null default false;

alter table public.messages enable row level security;

-- visitors (signed in or not) may only INSERT; nobody can read messages through the public API.
-- You read them in Table Editor (dashboard) or with the service role.
drop policy if exists "anyone can message" on public.messages;
create policy "anyone can message" on public.messages for insert to anon, authenticated with check (
  char_length(trim(name)) between 1 and 100
  and char_length(trim(message)) between 1 and 5000
  and email ~* '^\S+@\S+\.\S+$'
  and (user_id is null or user_id = auth.uid()));

grant insert on public.messages to anon, authenticated;
grant usage, select on sequence public.messages_id_seq to anon, authenticated;
