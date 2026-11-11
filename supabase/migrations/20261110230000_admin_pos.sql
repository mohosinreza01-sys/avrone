create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id text primary key,
  slug text not null unique,
  name text not null,
  category text not null,
  brand text not null default 'AVRONE',
  price integer not null check (price >= 0),
  compare_at_price integer check (compare_at_price is null or compare_at_price >= price),
  badge text,
  color text not null default '',
  sizes text[] not null default '{}',
  stock jsonb not null default '{}',
  image text not null default '',
  description text not null default '',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text unique,
  email text,
  address text not null default '',
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_id uuid references public.customers(id) on delete set null,
  channel text not null check (channel in ('online', 'pos')),
  status text not null check (status in ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_method text not null,
  payment_status text not null check (payment_status in ('unpaid', 'paid')),
  subtotal integer not null check (subtotal >= 0),
  delivery_fee integer not null default 0 check (delivery_fee >= 0),
  total integer not null check (total >= 0),
  customer_name text not null,
  customer_phone text not null,
  customer_address text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text references public.products(id) on delete set null,
  product_name text not null,
  size text not null,
  quantity integer not null check (quantity > 0),
  unit_price integer not null check (unit_price >= 0)
);

create index if not exists orders_created_at_idx on public.orders(created_at desc);
create index if not exists orders_customer_phone_idx on public.orders(customer_phone);
create index if not exists order_items_order_id_idx on public.order_items(order_id);
create index if not exists customers_name_idx on public.customers(name);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

alter table public.admin_users enable row level security;
alter table public.products enable row level security;
alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

grant select on public.products to anon, authenticated;
grant select, insert, update, delete on public.admin_users to authenticated;
grant select, insert, update, delete on public.products to authenticated;
grant select, insert, update, delete on public.customers, public.orders, public.order_items to authenticated;

create policy "Admins can read their own admin record"
  on public.admin_users for select to authenticated
  using (user_id = (select auth.uid()));
create policy "Public can read active products"
  on public.products for select to anon, authenticated
  using (active);
create policy "Admins can manage products"
  on public.products for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));
create policy "Admins can manage customers"
  on public.customers for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));
create policy "Admins can manage orders"
  on public.orders for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));
create policy "Admins can manage order items"
  on public.order_items for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));
create policy "Public can view product images"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'product-images');
create policy "Admins can upload product images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'product-images' and (select public.is_admin()));
create policy "Admins can update product images"
  on storage.objects for update to authenticated
  using (bucket_id = 'product-images' and (select public.is_admin()))
  with check (bucket_id = 'product-images' and (select public.is_admin()));
create policy "Admins can delete product images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'product-images' and (select public.is_admin()));

create or replace function public.create_order(
  p_customer jsonb,
  p_items jsonb,
  p_channel text default 'online',
  p_payment_method text default 'Cash on delivery'
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_customer_id uuid;
  v_order_id uuid;
  v_order_number text;
  v_name text;
  v_phone text;
  v_address text;
  v_subtotal integer := 0;
  v_delivery_fee integer := 0;
  v_item jsonb;
  v_line jsonb;
  v_order_lines jsonb := '[]'::jsonb;
  v_product public.products%rowtype;
  v_size text;
  v_quantity integer;
  v_available integer;
  v_payment_status text;
  v_status text;
begin
  if p_channel not in ('online', 'pos') then
    raise exception 'Invalid order channel';
  end if;
  if p_channel = 'pos' and not (select public.is_admin()) then
    raise exception 'Not authorized to create POS sales';
  end if;

  v_name := trim(coalesce(p_customer->>'name', ''));
  v_phone := trim(coalesce(p_customer->>'phone', ''));
  v_address := trim(coalesce(p_customer->>'address', ''));
  if p_channel = 'pos' and v_phone = '' then
    v_phone := null;
  end if;
  if length(v_name) < 2 or length(v_name) > 100
    or (p_channel = 'online' and (
      length(v_phone) < 7
      or length(v_phone) > 20
      or v_phone !~ '^[+0-9 ()-]{7,20}$'
      or v_phone !~ '[0-9]'
    ))
    or (p_channel = 'pos' and v_phone is not null and (
      length(v_phone) < 7
      or length(v_phone) > 20
      or v_phone !~ '^[+0-9 ()-]{7,20}$'
      or v_phone !~ '[0-9]'
    ))
    or length(v_address) > 500 then
    raise exception 'Enter a valid customer name and phone number';
  end if;
  if p_channel = 'online' and length(v_address) < 8 then
    raise exception 'A complete delivery address is required';
  end if;
  if jsonb_typeof(p_items) is distinct from 'array' then
    raise exception 'An order must contain a list of products';
  end if;
  if jsonb_array_length(p_items) = 0 then
    raise exception 'An order must contain at least one product';
  end if;
  if jsonb_array_length(p_items) > 30 then
    raise exception 'An order cannot contain more than 30 line items';
  end if;
  if p_channel = 'online' and p_payment_method <> 'Cash on delivery' then
    raise exception 'Online orders currently support cash on delivery';
  end if;
  if p_channel = 'pos' and p_payment_method not in ('Cash', 'bKash', 'Nagad', 'Card') then
    raise exception 'Invalid POS payment method';
  end if;

  if v_phone is not null then
    insert into public.customers (name, phone, address)
    values (v_name, v_phone, v_address)
    on conflict (phone) do update
      set name = excluded.name,
          address = case when excluded.address <> '' then excluded.address else customers.address end,
          updated_at = now()
    returning id into v_customer_id;
  end if;

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    if jsonb_typeof(v_item->'quantity') is distinct from 'number'
      or (v_item->>'quantity') !~ '^[1-9][0-9]*$'
      or (v_item->>'quantity')::integer > 50 then
      raise exception 'Invalid item quantity';
    end if;
    v_quantity := (v_item->>'quantity')::integer;
    v_size := trim(coalesce(v_item->>'size', ''));
    select * into v_product
      from public.products
      where id = v_item->>'productId' and active
      for update;
    if not found or not (v_size = any(v_product.sizes)) then
      raise exception 'Product or size is not available';
    end if;

    v_available := coalesce((v_product.stock->>v_size)::integer, 0);
    if v_available < v_quantity then
      raise exception 'Insufficient stock for % (size %)', v_product.name, v_size;
    end if;
    update public.products
      set stock = jsonb_set(stock, array[v_size], to_jsonb(v_available - v_quantity), true),
          updated_at = now()
      where id = v_product.id;

    v_subtotal := v_subtotal + (v_product.price * v_quantity);
    v_order_lines := v_order_lines || jsonb_build_array(jsonb_build_object(
      'product_id', v_product.id,
      'product_name', v_product.name,
      'size', v_size,
      'quantity', v_quantity,
      'unit_price', v_product.price
    ));
  end loop;

  if p_channel = 'online' and v_subtotal < 3000 then
    v_delivery_fee := 150;
  end if;
  v_payment_status := case when p_channel = 'pos' then 'paid' else 'unpaid' end;
  v_status := case when p_channel = 'pos' then 'delivered' else 'pending' end;
  v_order_number := 'AVR-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10));

  insert into public.orders (
    order_number, customer_id, channel, status, payment_method, payment_status,
    subtotal, delivery_fee, total, customer_name, customer_phone, customer_address
  ) values (
    v_order_number, v_customer_id, p_channel, v_status, p_payment_method,
    v_payment_status, v_subtotal, v_delivery_fee, v_subtotal + v_delivery_fee,
    v_name, coalesce(v_phone, ''), v_address
  ) returning id into v_order_id;

  for v_line in select value from jsonb_array_elements(v_order_lines)
  loop
    insert into public.order_items (order_id, product_id, product_name, size, quantity, unit_price)
    values (
      v_order_id,
      v_line->>'product_id',
      v_line->>'product_name',
      v_line->>'size',
      (v_line->>'quantity')::integer,
      (v_line->>'unit_price')::integer
    );
  end loop;

  return jsonb_build_object(
    'id', v_order_id,
    'order_number', v_order_number,
    'channel', p_channel,
    'status', v_status,
    'payment_method', p_payment_method,
    'subtotal', v_subtotal,
    'delivery_fee', v_delivery_fee,
    'total', v_subtotal + v_delivery_fee,
    'customer_name', v_name,
    'customer_phone', coalesce(v_phone, ''),
    'customer_address', v_address,
    'items', v_order_lines
  );
end;
$$;

revoke all on function public.create_order(jsonb, jsonb, text, text) from public;
grant execute on function public.create_order(jsonb, jsonb, text, text) to anon, authenticated;

create or replace function public.track_order(
  p_order_number text,
  p_phone text
)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'order_number', o.order_number,
    'status', o.status,
    'payment_method', o.payment_method,
    'payment_status', o.payment_status,
    'total', o.total,
    'created_at', o.created_at,
    'items', coalesce((
      select jsonb_agg(jsonb_build_object(
        'name', i.product_name,
        'size', i.size,
        'quantity', i.quantity
      ) order by i.id)
      from public.order_items i
      where i.order_id = o.id
    ), '[]'::jsonb)
  )
  from public.orders o
  where upper(o.order_number) = upper(trim(p_order_number))
    and o.customer_phone = trim(p_phone)
    and length(trim(p_phone)) between 7 and 20
    and trim(p_phone) ~ '^[+0-9 ()-]{7,20}$'
    and trim(p_phone) ~ '[0-9]'
  limit 1;
$$;

revoke all on function public.track_order(text, text) from public;
grant execute on function public.track_order(text, text) to anon, authenticated;

create or replace function public.update_order_status(
  p_order_id uuid,
  p_status text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not (select public.is_admin()) then
    raise exception 'Not authorized';
  end if;
  if p_status not in ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled') then
    raise exception 'Invalid order status';
  end if;
  update public.orders
    set status = p_status,
        payment_status = case
          when p_status = 'delivered' then 'paid'
          when p_status = 'cancelled' then 'unpaid'
          else payment_status
        end,
        updated_at = now()
    where id = p_order_id;
  if not found then
    raise exception 'Order not found';
  end if;
end;
$$;

revoke all on function public.update_order_status(uuid, text) from public;
grant execute on function public.update_order_status(uuid, text) to authenticated;

create or replace function public.admin_dashboard_summary()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_result jsonb;
begin
  if not (select public.is_admin()) then
    raise exception 'Not authorized';
  end if;
  select jsonb_build_object(
    'products', (select count(*) from public.products where active),
    'customers', (select count(*) from public.customers),
    'orders', (select count(*) from public.orders),
    'pendingOrders', (select count(*) from public.orders where status = 'pending'),
    'revenue', (select coalesce(sum(total), 0) from public.orders where payment_status = 'paid' and status <> 'cancelled')
  ) into v_result;
  return v_result;
end;
$$;

revoke all on function public.admin_dashboard_summary() from public;
grant execute on function public.admin_dashboard_summary() to authenticated;

create or replace function public.restore_cancelled_order_stock()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_item record;
  v_stock integer;
begin
  if old.status <> 'cancelled' and new.status = 'cancelled' then
    for v_item in
      select product_id, size, quantity from public.order_items where order_id = new.id
    loop
      if v_item.product_id is not null then
        update public.products
          set stock = jsonb_set(
            stock,
            array[v_item.size],
            to_jsonb(coalesce((stock->>v_item.size)::integer, 0) + v_item.quantity),
            true
          ),
          updated_at = now()
          where id = v_item.product_id;
      end if;
    end loop;
  elsif old.status = 'cancelled' and new.status <> 'cancelled' then
    for v_item in
      select product_id, size, quantity from public.order_items where order_id = new.id
    loop
      if v_item.product_id is not null then
        select coalesce((stock->>v_item.size)::integer, 0) into v_stock
          from public.products where id = v_item.product_id for update;
        if v_stock < v_item.quantity then
          raise exception 'Insufficient stock to reactivate cancelled order';
        end if;
        update public.products
          set stock = jsonb_set(stock, array[v_item.size], to_jsonb(v_stock - v_item.quantity), true),
          updated_at = now()
          where id = v_item.product_id;
      end if;
    end loop;
  end if;
  return new;
end;
$$;

create trigger orders_restore_stock_on_cancel
  after update of status on public.orders
  for each row execute function public.restore_cancelled_order_stock();

insert into public.products (
  id, slug, name, category, brand, price, compare_at_price, badge, color, sizes, stock, image, description
) values
  ('avr-001', 'signature-textured-panjabi', 'Signature Textured Panjabi', 'Panjabi', 'AVRONE Signature', 2890, 3490, 'Bestseller', 'Deep olive', array['38','40','42','44','46'], '{"38":0,"40":0,"42":0,"44":0,"46":0}', 'https://images.unsplash.com/photo-1767775498862-d4740ce574ce?auto=format&fit=crop&w=1000&q=80', 'A refined everyday Panjabi with a clean silhouette, subtle texture, and an easy fit for gatherings and special occasions.'),
  ('avr-002', 'classic-cotton-panjabi', 'Classic Cotton Panjabi', 'Panjabi', 'AVRONE Signature', 2390, null, 'Everyday classic', 'Soft ivory', array['38','40','42','44','46'], '{"38":0,"40":0,"42":0,"44":0,"46":0}', 'https://images.unsplash.com/photo-1774527929835-282b1b85cd3a?auto=format&fit=crop&w=1000&q=80', 'A breathable cotton Panjabi with understated detailing and a relaxed, comfortable fit for everyday wear.'),
  ('avr-003', 'premium-embroidered-panjabi', 'Premium Embroidered Panjabi', 'Panjabi', 'AVRONE Signature', 4290, null, 'Occasion wear', 'Warm sand', array['38','40','42','44','46'], '{"38":0,"40":0,"42":0,"44":0,"46":0}', 'https://images.unsplash.com/photo-1774267230662-575d1f4ec1bd?auto=format&fit=crop&w=1000&q=80', 'A polished occasion-ready Panjabi with considered embroidery, a comfortable fit, and a timeless finish.'),
  ('avr-004', 'everyday-casual-panjabi', 'Everyday Casual Panjabi', 'Panjabi', 'AVRONE Everyday', 2590, null, null, 'Midnight blue', array['38','40','42','44','46'], '{"38":0,"40":0,"42":0,"44":0,"46":0}', 'https://images.unsplash.com/photo-1770359993283-a2c2f386584e?auto=format&fit=crop&w=1000&q=80', 'An easy-to-wear Panjabi with a clean collar and versatile styling, made for relaxed plans and family occasions.'),
  ('avr-005', 'everyday-cotton-shirt', 'Everyday Cotton Shirt', 'Shirts', 'AVRONE Everyday', 1890, null, 'New', 'Classic white', array['S','M','L','XL','XXL'], '{"S":0,"M":0,"L":0,"XL":0,"XXL":0}', 'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=1000&q=80', 'A versatile cotton shirt with a neat fit and easy styling, suited to workdays, outings, and everyday wear.'),
  ('avr-006', 'premium-casual-shirt', 'Premium Casual Shirt', 'Shirts', 'AVRONE Studio', 2290, null, 'New', 'Charcoal', array['S','M','L','XL','XXL'], '{"S":0,"M":0,"L":0,"XL":0,"XXL":0}', 'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?auto=format&fit=crop&w=1000&q=80', 'A smart-casual shirt with a contemporary shape and considered details, easy to dress up or down.'),
  ('avr-007', 'relaxed-cotton-pajama', 'Relaxed Cotton Pajama', 'Bottomwear', 'AVRONE Essentials', 1290, null, 'New', 'Natural beige', array['M','L','XL','XXL'], '{"M":0,"L":0,"XL":0,"XXL":0}', 'https://images.unsplash.com/photo-1645944692361-721984d57b6c?auto=format&fit=crop&w=1000&q=80', 'Soft, breathable cotton pajama bottoms with a relaxed fit for all-day ease and comfortable lounging.'),
  ('avr-008', 'woven-leather-belt', 'Woven Leather Belt', 'Accessories', 'AVRONE Studio', 1490, null, 'New', 'Dark brown', array['S','M','L','XL'], '{"S":0,"M":0,"L":0,"XL":0}', 'https://images.unsplash.com/photo-1711443982852-b3df5c563448?auto=format&fit=crop&w=1000&q=80', 'A versatile woven belt with a classic finish, designed to complete everyday and occasion looks.')
on conflict (id) do nothing;
