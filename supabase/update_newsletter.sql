-- Run once if you already ran schema.sql earlier (new installs: already included in schema.sql)
create table if not exists newsletter_subscribers (id bigserial primary key, email text unique not null, created_at timestamptz default now());
alter table newsletter_subscribers enable row level security;
drop policy if exists "anyone can subscribe" on newsletter_subscribers;
create policy "anyone can subscribe" on newsletter_subscribers for insert with check (true);
