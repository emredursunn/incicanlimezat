# İnci Canlı — Boutique Catalog

Modern, elegant product catalog for the İnci Canlı women's fashion boutique.

This is **not** an e-commerce site. There is no cart, checkout, or payments — only a public catalog and a protected admin panel for managing products and images.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Supabase (Postgres, Auth, Storage)
- Lucide React
- Deployable on Vercel

## Features

**Public**

- Homepage with editorial hero and featured products
- Product catalog (`/urunler`)
- Shareable product detail pages (`/urunler/[slug]`)
- Instagram link in header and footer
- Mobile-first layout and Open Graph metadata

**Admin** (`/admin`)

- Email/password login (Supabase Auth)
- Dashboard with product counts
- Create / edit / delete products
- Image upload to Supabase Storage
- Activate / deactivate and feature products

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Supabase project

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run the migration files in order:

   - [`supabase/migrations/001_initial_schema.sql`](supabase/migrations/001_initial_schema.sql)
   - [`supabase/migrations/002_site_settings.sql`](supabase/migrations/002_site_settings.sql)

   This creates:

   - `products` table + indexes + RLS
   - `admins` table + `is_admin()` helper
   - `product-images` storage bucket + policies
   - `site_settings` (mağaza adı, hero yazıları/görseli, Instagram)

### 3. Environment variables

Copy the example file and fill in values from **Project Settings → API**:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-or-publishable-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Never put the service-role key in `NEXT_PUBLIC_*` variables or client code.

### 4. Create the first administrator

1. In Supabase: **Authentication → Users → Add user**
   - Create a user with email + password
   - Disable “auto confirm” only if you intentionally want email verification; for a single boutique owner, confirming the user is fine
2. Copy the user’s UUID
3. In SQL Editor:

```sql
insert into public.admins (user_id)
values ('PASTE-USER-UUID-HERE');
```

There is no public registration. Only rows in `admins` can manage products.

### 5. Run locally

```bash
npm run dev
```

- Site: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## Configuration

Editable from the admin panel at **`/admin/settings`**:

- Mağaza adı (header / footer)
- Hero başlık, alt yazı, buton metni
- Hero fotoğrafı
- Instagram adresi

Fallback defaults (DB yoksa) live in [`src/lib/site-config.ts`](src/lib/site-config.ts).

Set `NEXT_PUBLIC_SITE_URL` for production.

## Storage notes

- Bucket: `product-images` (public read)
- Paths: `{productId}/{filename}`
- Upload / replace / delete: admins only (RLS + storage policies)
- Replacing or deleting a product removes unreferenced image files

## Deployment (Vercel)

1. Push the repository to GitHub
2. Import the project in Vercel
3. Set the same environment variables as `.env.local`
   - Set `NEXT_PUBLIC_SITE_URL` to your production domain
4. Deploy
5. Confirm the Supabase Auth redirect URL allow-list includes your production domain if you customize auth redirects later

After deploy, log in at `/admin/login`, create a product, upload images, and verify it appears on `/urunler`.

## Verification checklist

- [ ] Public homepage renders with brand styling
- [ ] Active products appear in the catalog
- [ ] Product detail pages work and share clean URLs
- [ ] Inactive / deleted products return not-found
- [ ] Admin login works; non-admins are rejected
- [ ] Create product + upload main/additional images
- [ ] Edit name, price, description, images
- [ ] Toggle active / featured
- [ ] Delete product and confirm images are cleaned up
- [ ] Mobile layout is usable for catalog and admin
- [ ] No secrets committed; only `.env.example` is in git

## Scripts

```bash
npm run dev      # development
npm run build    # production build
npm run start    # run production build
npm run lint     # eslint
```
