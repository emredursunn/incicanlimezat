# Supabase

Run migrations in order in the Supabase SQL Editor:

1. [`migrations/001_initial_schema.sql`](migrations/001_initial_schema.sql)
2. [`migrations/002_site_settings.sql`](migrations/002_site_settings.sql)

After creating the first Auth user, insert their UUID into `public.admins` (see the root README).
