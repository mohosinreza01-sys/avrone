# AVRONE admin and POS setup

The admin panel uses Supabase Auth and Postgres. Do not put a service-role key in the browser or commit credentials.

## 1. Connect the project

1. Create a Supabase project at [supabase.com](https://supabase.com/).
2. Copy `.env.example` to `.env.local`.
3. In Supabase **Project Settings → API**, copy the project URL and the anon/publishable key into `.env.local`:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-public-anon-or-publishable-key
   ```

4. Restart the Next.js development server after editing environment variables.

## 2. Create the tables and policies

Run the SQL files in [`migrations/`](./migrations/) in filename order in the Supabase SQL Editor. They create the product catalog, stock by size, customers, orders and order items; install row-level security; seed the existing eight products with curated sample images; and create the public product-image bucket. The image refresh migration only updates seeded products that still have their original sample image, so admin-managed images are preserved.

The initial stock for the seeded products is intentionally zero. Before taking orders, open **Admin → Products & stock → Edit & stock** and enter the actual available quantity for each size. Both online checkout and POS check and decrement inventory in the database transaction.

## 3. Create the first admin

1. In Supabase **Authentication → Users**, create an email/password user for the store owner. Keep public sign-up disabled.
2. In the SQL Editor, replace the example email and run:

   ```sql
   insert into public.admin_users (user_id)
   select id
   from auth.users
   where lower(email) = lower('owner@example.com')
   on conflict (user_id) do nothing;
   ```

Only users listed in `admin_users` can access the admin API, dashboard, POS, and private customer/order data.

## What is included

- `/admin/login` — email/password login; no public admin sign-up.
- `/admin` — store summary, order queue/status updates, product CRUD and size-level stock, customer records/notes, and POS sales.
- `/api/orders` — public cash-on-delivery order creation and order-number + phone tracking.
- Product and order changes are stored in Supabase; past sales keep product/price snapshots.
- Product image uploads are limited to JPG, PNG, or WebP up to 5 MB.

Orders created in the previous localStorage-only demo are not automatically migrated. They remain in the browser where they were placed; only orders placed after the Supabase migration are shared with the admin panel.
