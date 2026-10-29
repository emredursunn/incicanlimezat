-- Site appearance settings (singleton row)

create table public.site_settings (
  id integer primary key default 1 check (id = 1),
  store_name text not null,
  hero_headline text not null,
  hero_subheadline text not null,
  hero_cta_label text not null default 'Koleksiyonu Keşfet',
  hero_image_path text,
  instagram_url text,
  updated_at timestamptz not null default now()
);

create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row
  execute function public.set_updated_at();

alter table public.site_settings enable row level security;

create policy "Anyone can read site settings"
  on public.site_settings
  for select
  to anon, authenticated
  using (true);

create policy "Admins can update site settings"
  on public.site_settings
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can insert site settings"
  on public.site_settings
  for insert
  to authenticated
  with check (public.is_admin());

insert into public.site_settings (
  id,
  store_name,
  hero_headline,
  hero_subheadline,
  hero_cta_label,
  hero_image_path,
  instagram_url
) values (
  1,
  'İnci Canlı',
  'Zarafetin sade hali',
  'Elbise, çanta ve seçilmiş parçalarla yeni sezon koleksiyonu.',
  'Koleksiyonu Keşfet',
  null,
  'https://www.instagram.com/incicanli'
)
on conflict (id) do nothing;
