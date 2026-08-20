This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Supabase setup

Before submitting purchase requests, apply the migration in
`supabase/migrations/20260820123000_add_purchase_status.sql` to the connected
Supabase project. In the Supabase dashboard, open **SQL Editor**, paste the
following SQL, and run it:

```sql
alter table public.bids
	add column if not exists status text not null default 'pending';

alter table public.bids
	drop constraint if exists bids_status_check;

alter table public.bids
	add constraint bids_status_check
	check (status in ('pending', 'accepted'));
```

This adds the status used to distinguish pending requests from purchases
approved by an admin.

To enable admin product creation, also run
`supabase/migrations/20260820133000_add_auction_items.sql` in the SQL Editor.
This creates the table used to store products added from the admin page.

For the product image, use a public direct image URL. A Google Drive sharing
URL usually opens a preview page rather than the image itself and may not
render; upload the image to a public image host or use a direct file URL.

Admin product uploads use the S3-compatible bucket configured by
`S3_BUCKET_NAME`, `S3_BUCKET_REGION`, `S3_ACCESS_KEY_ID`,
`S3_SECRET_ACCESS_KEY`, and optionally `S3_ENDPOINT_URL`. Uploaded objects
must be publicly readable. For S3-compatible providers with a custom public
domain, set `S3_PUBLIC_URL` to the bucket's public base URL.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
