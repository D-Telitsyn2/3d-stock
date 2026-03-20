import Link from 'next/link';
import { createApiClient } from '@repo/sdk';

/** Catalog needs a running API; avoid SSG at build time when API is down. */
export const dynamic = 'force-dynamic';

function apiBaseUrl(): string {
  return (
    process.env.API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    'http://localhost:3001'
  );
}

export default async function CatalogPage() {
  const client = createApiClient(apiBaseUrl());
  const { items, page, limit, total } = await client.listAssets({ page: 1, limit: 24 });

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-baseline justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Catalog</h1>
          <p className="text-muted-foreground mt-1">
            Published models from the API ({total} total, page {page}, {limit} per page)
          </p>
        </div>
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          Home
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="text-muted-foreground">
          No published assets yet. Run{' '}
          <code className="rounded bg-muted px-1.5 py-0.5 text-sm">pnpm db:seed</code> in{' '}
          <code className="rounded bg-muted px-1.5 py-0.5 text-sm">apps/api</code> after migrations.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {items.map(asset => (
            <li
              key={asset.id}
              className="rounded-lg border bg-card p-4 shadow-sm hover:border-foreground/20 transition-colors"
            >
              <h2 className="font-semibold text-lg">{asset.title}</h2>
              <p className="text-sm text-muted-foreground font-mono mt-1">{asset.slug}</p>
              <p className="text-sm mt-3 line-clamp-3">{asset.description}</p>
              <p className="text-sm font-medium mt-4">
                {(asset.priceCents / 100).toFixed(2)} {asset.currency}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
