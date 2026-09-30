-- Aura Taki CMS / Supabase kurulumu
-- 1) Supabase SQL Editor'a bu dosyanın tamamını yapıştırıp Run'a bas.
-- 2) Authentication > Users bölümünden yönetici e-posta/şifre kullanıcısını oluştur.
-- 3) Oluşan kullanıcının UUID'sini aşağıdaki INSERT ile site_admins tablosuna ekle.
-- 4) supabase-config.js içine Project URL + Publishable Key yaz.

create table if not exists public.site_settings (
  id text primary key default 'main',
  brand text not null default 'Aura Takı',
  logo_url text not null default '',
  whatsapp text not null default '',
  instagram text not null default '',
  tiktok text not null default '',
  facebook text not null default '',
  phone text not null default '',
  email text not null default '',
  address text not null default '',
  hero_image text not null default '',
  about_image text not null default '',
  story_title text not null default 'Sadelikte saklı bir zarafet.',
  story_text text not null default 'Her parçada özen, her detayda zarafet.',
  seo_description text not null default 'Aura Takı - zarif ve modern takı koleksiyonu.',
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null default 'Diğer',
  price text not null default '',
  description text not null default '',
  image_url text not null default '',
  featured boolean not null default false,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

insert into public.site_settings (id, brand, whatsapp, instagram, tiktok, facebook, story_title, story_text)
values ('main','Aura Takı','','','','','Sadelikte saklı bir zarafet.','Her parçada özen, her detayda zarafet.')
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('site-images','site-images',true)
on conflict (id) do update set public=true;

alter table public.site_settings enable row level security;
alter table public.products enable row level security;
alter table public.site_admins enable row level security;

drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings" on public.site_settings for select using (true);

drop policy if exists "Admins manage site settings" on public.site_settings;
create policy "Admins manage site settings" on public.site_settings for all to authenticated
using (exists (select 1 from public.site_admins a where a.user_id=auth.uid()))
with check (exists (select 1 from public.site_admins a where a.user_id=auth.uid()));

drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products" on public.products for select using (active=true or exists (select 1 from public.site_admins a where a.user_id=auth.uid()));

drop policy if exists "Admins manage products" on public.products;
create policy "Admins manage products" on public.products for all to authenticated
using (exists (select 1 from public.site_admins a where a.user_id=auth.uid()))
with check (exists (select 1 from public.site_admins a where a.user_id=auth.uid()));

drop policy if exists "Admins can read own admin row" on public.site_admins;
create policy "Admins can read own admin row" on public.site_admins for select to authenticated
using (user_id=auth.uid());

drop policy if exists "Public can view site images" on storage.objects;
create policy "Public can view site images" on storage.objects for select using (bucket_id='site-images');

drop policy if exists "Admins upload site images" on storage.objects;
create policy "Admins upload site images" on storage.objects for insert to authenticated
with check (bucket_id='site-images' and exists (select 1 from public.site_admins a where a.user_id=auth.uid()));

drop policy if exists "Admins update site images" on storage.objects;
create policy "Admins update site images" on storage.objects for update to authenticated
using (bucket_id='site-images' and exists (select 1 from public.site_admins a where a.user_id=auth.uid()))
with check (bucket_id='site-images' and exists (select 1 from public.site_admins a where a.user_id=auth.uid()));

drop policy if exists "Admins delete site images" on storage.objects;
create policy "Admins delete site images" on storage.objects for delete to authenticated
using (bucket_id='site-images' and exists (select 1 from public.site_admins a where a.user_id=auth.uid()));

-- Yönetici kullanıcı oluşturduktan sonra:
-- insert into public.site_admins(user_id) values ('KULLANICI_UUID_BURAYA');
