-- J&J Computer Shop: run this whole file in Supabase > SQL Editor, then run seed.sql
create table if not exists products (
  id text primary key, sort int default 0, name text not null, brand text, category text not null,
  category_label text, price numeric(12,2) not null, was numeric(12,2), image text, stock int not null default 0,
  description text, specs jsonb not null default '[]', is_prebuilt boolean not null default false,
  badge text, badge_class text, subtitle text, active boolean not null default true, created_at timestamptz default now());
create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade, full_name text, phone text, created_at timestamptz default now());
create table if not exists cart_items (
  user_id uuid references auth.users on delete cascade, product_id text references products(id) on delete cascade,
  qty int not null check (qty > 0), primary key (user_id, product_id));
create sequence if not exists order_seq start 104583;
create table if not exists orders (
  id uuid primary key default gen_random_uuid(), order_no text unique not null, user_id uuid references auth.users,
  email text, ship_name text, ship_phone text, ship_address text, ship_city text, ship_region text,
  payment_method text default 'cod', subtotal numeric(12,2), shipping_fee numeric(12,2), total numeric(12,2),
  status text not null default 'placed' check (status in ('placed','paid','packed','shipped','out_for_delivery','delivered','cancelled')),
  created_at timestamptz default now());
create table if not exists order_items (
  id bigserial primary key, order_id uuid references orders on delete cascade, product_id text, name text, price numeric(12,2), qty int);
create table if not exists messages (id bigserial primary key, name text, email text, message text, user_id uuid references auth.users on delete set null, is_read boolean not null default false, created_at timestamptz default now());
create table if not exists rma_requests (id bigserial primary key, ref text, order_no text, reason text, created_at timestamptz default now());

alter table products enable row level security;  alter table profiles enable row level security;
alter table cart_items enable row level security; alter table orders enable row level security;
alter table order_items enable row level security; alter table messages enable row level security;
alter table rma_requests enable row level security;

create policy "products readable" on products for select using (active);
create policy "own profile" on profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "own cart" on cart_items for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own orders" on orders for select using (auth.uid() = user_id);
create policy "own order items" on order_items for select using (exists (select 1 from orders o where o.id = order_id and o.user_id = auth.uid()));
create policy "anyone can message" on messages for insert with check (
  char_length(trim(name)) between 1 and 100 and char_length(trim(message)) between 1 and 5000
  and email ~* '^\S+@\S+\.\S+$' and (user_id is null or user_id = auth.uid()));
create policy "anyone can request rma" on rma_requests for insert with check (true);

-- create a profile row automatically on sign-up
create or replace function handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin insert into profiles (id, full_name) values (new.id, new.raw_user_meta_data->>'full_name') on conflict do nothing; return new; end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function handle_new_user();

-- checkout: prices and stock are validated on the server, never trusted from the browser
create or replace function place_order(p_items jsonb, p_ship jsonb) returns text language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); it jsonb; prod products%rowtype; q int; sub numeric := 0; fee numeric; oid uuid; ono text;
begin
  if uid is null then raise exception 'Please sign in to place an order'; end if;
  if jsonb_array_length(coalesce(p_items, '[]'::jsonb)) = 0 then raise exception 'Your cart is empty'; end if;
  for it in select * from jsonb_array_elements(p_items) loop
    q := (it->>'qty')::int;
    select * into prod from products where id = it->>'id' and active for update;
    if not found or q < 1 then raise exception 'Invalid item in cart'; end if;
    if prod.stock < q then raise exception 'Not enough stock for %', prod.name; end if;
    sub := sub + prod.price * q;
  end loop;
  fee := case when sub >= 3000 then 0 else 150 end;
  ono := 'JJ-' || nextval('order_seq');
  insert into orders (order_no, user_id, email, ship_name, ship_phone, ship_address, ship_city, ship_region, payment_method, subtotal, shipping_fee, total)
  values (ono, uid, (select email from auth.users where id = uid), p_ship->>'name', p_ship->>'phone', p_ship->>'address',
          p_ship->>'city', p_ship->>'region', coalesce(p_ship->>'payment', 'cod'), sub, fee, sub + fee) returning id into oid;
  for it in select * from jsonb_array_elements(p_items) loop
    select * into prod from products where id = it->>'id';
    insert into order_items (order_id, product_id, name, price, qty) values (oid, prod.id, prod.name, prod.price, (it->>'qty')::int);
    update products set stock = stock - (it->>'qty')::int where id = prod.id;
  end loop;
  delete from cart_items where user_id = uid;
  return ono;
end $$;

-- order tracking by order number + email (works for guests too)
create or replace function track_order(p_order_no text, p_email text) returns json language sql security definer set search_path = public as $$
  select json_build_object('order_no', order_no, 'status', status, 'created_at', created_at)
  from orders where order_no = upper(p_order_no) and lower(email) = lower(p_email) limit 1 $$;

grant execute on function place_order(jsonb, jsonb) to authenticated;
grant execute on function track_order(text, text) to anon, authenticated;
create table if not exists newsletter_subscribers (id bigserial primary key, email text unique not null, created_at timestamptz default now());
alter table newsletter_subscribers enable row level security;
drop policy if exists "anyone can subscribe" on newsletter_subscribers;
create policy "anyone can subscribe" on newsletter_subscribers for insert with check (true);
