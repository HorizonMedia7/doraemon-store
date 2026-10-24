-- ============================================================
-- DORAEMON GADGET STORE: SUPABASE DATABASE & STORAGE SCHEMA
-- Run this in Supabase -> SQL Editor -> Click 'Run'
-- ============================================================

-- 1. Create products table
create table if not exists public.products (
  id text primary key,
  name text not null,
  tagline text default '',
  description text default '',
  highlights jsonb default '[]'::jsonb,
  category text default 'Tech Accessories',
  images jsonb default '[]'::jsonb,
  links jsonb default '[]'::jsonb,
  is_published boolean default true,
  featured boolean default false,
  click_count integer default 0,
  date_added text default to_char(now(), 'YYYY-MM-DD'),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create click analytics table
create table if not exists public.click_events (
  id bigint generated always as identity primary key,
  product_id text references public.products(id) on delete cascade,
  product_name text,
  store text,
  url text,
  price text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Enable Row Level Security (RLS)
alter table public.products enable row level security;
alter table public.click_events enable row level security;

-- Drop existing policies if re-running to avoid errors
drop policy if exists "Public can view published products" on public.products;
drop policy if exists "Admin can view all products" on public.products;
drop policy if exists "Admin can insert products" on public.products;
drop policy if exists "Admin can update products" on public.products;
drop policy if exists "Admin can delete products" on public.products;

drop policy if exists "Public can insert click events" on public.click_events;
drop policy if exists "Admin can view click events" on public.click_events;

-- Products RLS Policies:
-- Visitors can only see published products
create policy "Public can view published products"
  on public.products for select
  using (is_published = true);

-- Logged-in admin can see ALL products (including hidden drafts)
create policy "Admin can view all products"
  on public.products for select
  to authenticated
  using (true);

-- Only logged-in admin can create, modify, or remove products
create policy "Admin can insert products"
  on public.products for insert
  to authenticated
  with check (true);

create policy "Admin can update products"
  on public.products for update
  to authenticated
  using (true);

create policy "Admin can delete products"
  on public.products for delete
  to authenticated
  using (true);

-- Click events RLS Policies:
-- Anyone clicking a link records an analytics entry
create policy "Public can insert click events"
  on public.click_events for insert
  with check (true);

-- Only logged-in admin can read the stats
create policy "Admin can view click events"
  on public.click_events for select
  to authenticated
  using (true);

-- Atomic function to increment product clicks and log event securely
create or replace function public.track_affiliate_click(
  p_product_id text,
  p_product_name text,
  p_store text,
  p_url text,
  p_price text default null
)
returns void
language plpgsql
security definer
as $$
begin
  -- Increment overall product clicks
  update public.products
  set click_count = coalesce(click_count, 0) + 1
  where id = p_product_id;

  -- Insert click log
  insert into public.click_events (product_id, product_name, store, url, price)
  values (p_product_id, p_product_name, p_store, p_url, p_price);
end;
$$;

-- 4. Set up Storage Bucket for Product Images
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Storage policies:
drop policy if exists "Public can view product images" on storage.objects;
drop policy if exists "Admin can upload product images" on storage.objects;
drop policy if exists "Admin can update product images" on storage.objects;
drop policy if exists "Admin can delete product images" on storage.objects;

create policy "Public can view product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "Admin can upload product images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images');

create policy "Admin can update product images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images');

create policy "Admin can delete product images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images');
