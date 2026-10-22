-- Absher core schema: people, delivery zones, merchants and their products, orders and their status history.
-- Row level security is on for every table, because the anon key ships inside the public website and app.

create type public.user_role as enum ('customer', 'courier', 'merchant', 'admin');
create type public.order_status as enum ('new', 'confirmed', 'picked_up', 'on_the_way', 'delivered', 'cancelled');
create type public.payment_method as enum ('cash', 'cliq', 'wallet');
create type public.order_category as enum ('restaurant', 'supermarket', 'produce', 'pharmacy', 'parcel', 'office');

create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  role public.user_role not null default 'customer',
  full_name text,
  phone text unique,
  created_at timestamptz not null default now()
);

create table public.zones (
  id serial primary key,
  name text not null unique,
  delivery_fee numeric(6, 2),
  active boolean not null default true
);

create table public.merchants (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles on delete set null,
  name text not null,
  category public.order_category not null,
  zone_id int references public.zones,
  phone text,
  logo_url text,
  is_open boolean not null default true,
  active boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid not null references public.merchants on delete cascade,
  name text not null,
  description text,
  price numeric(8, 2) not null,
  image_url text,
  available boolean not null default true
);

create table public.orders (
  id bigint generated always as identity primary key,
  customer_id uuid references public.profiles on delete set null,
  merchant_id uuid references public.merchants on delete set null,
  courier_id uuid references public.profiles on delete set null,
  category public.order_category not null,
  details text not null,
  pickup text,
  zone text not null,
  address text not null,
  customer_name text not null,
  phone text not null,
  payment public.payment_method not null default 'cash',
  status public.order_status not null default 'new',
  delivery_fee numeric(6, 2),
  total numeric(8, 2),
  source text not null default 'web',
  courier_lat double precision,
  courier_lng double precision,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_events (
  id bigint generated always as identity primary key,
  order_id bigint not null references public.orders on delete cascade,
  status public.order_status not null,
  actor_id uuid references public.profiles,
  created_at timestamptz not null default now()
);

create index orders_status_idx on public.orders (status, created_at desc);
create index orders_courier_idx on public.orders (courier_id) where courier_id is not null;

-- Helpers used by the policies below.
create function public.my_role() returns public.user_role
language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid()
$$;

create function public.is_admin() returns boolean
language sql stable as $$ select coalesce(public.my_role() = 'admin', false) $$;

alter table public.profiles enable row level security;
alter table public.zones enable row level security;
alter table public.merchants enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_events enable row level security;

-- Profiles: you see and edit yourself; admins see everyone. Role changes are admin only.
create policy "own profile" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "insert own profile" on public.profiles for insert with check (id = auth.uid() and role = 'customer');
create policy "update own profile" on public.profiles for update using (id = auth.uid())
  with check (id = auth.uid() and role = (select p.role from public.profiles p where p.id = auth.uid()));
create policy "admin manages profiles" on public.profiles for all using (public.is_admin());

-- Zones, open merchants and their products are public catalogue data.
create policy "zones are public" on public.zones for select using (true);
create policy "admin manages zones" on public.zones for all using (public.is_admin());

create policy "active merchants are public" on public.merchants for select
  using (active or owner_id = auth.uid() or public.is_admin());
create policy "owner edits merchant" on public.merchants for update using (owner_id = auth.uid());
create policy "admin manages merchants" on public.merchants for all using (public.is_admin());

create policy "products are public" on public.products for select using (true);
create policy "owner manages products" on public.products for all
  using (exists (select 1 from public.merchants m where m.id = merchant_id and m.owner_id = auth.uid()));
create policy "admin manages products" on public.products for all using (public.is_admin());

-- Orders: anyone may place a new order (the website works without login).
-- Only the customer, the assigned courier, the merchant and admins can read it.
create policy "anyone places an order" on public.orders for insert
  with check (status = 'new' and courier_id is null and (customer_id is null or customer_id = auth.uid()));
create policy "read own orders" on public.orders for select using (
  customer_id = auth.uid()
  or courier_id = auth.uid()
  or exists (select 1 from public.merchants m where m.id = merchant_id and m.owner_id = auth.uid())
  or public.is_admin()
);
create policy "courier updates assigned order" on public.orders for update using (courier_id = auth.uid());
create policy "admin manages orders" on public.orders for all using (public.is_admin());

create policy "read events of visible orders" on public.order_events for select
  using (exists (select 1 from public.orders o where o.id = order_id));
create policy "staff writes events" on public.order_events for insert
  with check (public.my_role() in ('courier', 'admin') and actor_id = auth.uid());

-- Keep updated_at fresh and log every status change.
create function public.touch_order() returns trigger language plpgsql security definer set search_path = public as $$
begin
  new.updated_at := now();
  if new.status is distinct from old.status then
    insert into public.order_events (order_id, status, actor_id) values (new.id, new.status, auth.uid());
  end if;
  return new;
end $$;

create trigger orders_touch before update on public.orders for each row execute function public.touch_order();
create function public.log_new_order() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.order_events (order_id, status, actor_id) values (new.id, new.status, auth.uid());
  return new;
end $$;
create trigger orders_log_new after insert on public.orders for each row execute function public.log_new_order();

-- Live tracking for the customer app.
alter publication supabase_realtime add table public.orders;

-- The 26 delivery zones the website lists.
insert into public.zones (name) values
  ('العيادات'), ('دوار الصناعة وما حولها'), ('حنينا والرشاد'), ('الكولا'), ('حي الأزايدة'),
  ('دوار الطيارة'), ('بعد الطيارة والمهندسين'), ('الخطابية'), ('المأمونية (وسطى، شرقية)'),
  ('النديم وما حولها'), ('المخيم'), ('ماعين'), ('مديرية الشرطة'), ('الحي الشرقي'), ('المجمع'),
  ('سوق الجمعة ودوار أبو ركبة'), ('المقبرة الإسلامية'), ('الفيصلية المسجد الكبير'),
  ('الفيصلية بعد المسجد الكبير'), ('التيم الأول'), ('التيم أبو شريف'), ('نتل'), ('حوارة'),
  ('جلول'), ('منشية ماعين'), ('منجا');
