import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

function apiBaseUrl(): string {
  return (
    process.env.API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    'http://localhost:3001'
  );
}

export default async function AccountPage() {
  const { userId, getToken } = auth();
  if (!userId) {
    redirect('/sign-in');
  }

  const token = await getToken();
  if (!token) {
    redirect('/sign-in');
  }

  const res = await fetch(`${apiBaseUrl()}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text();
    return (
      <div className="container mx-auto max-w-lg px-4 py-10">
        <h1 className="text-2xl font-bold">Account</h1>
        <p className="mt-4 text-muted-foreground">
          API error {res.status}. Is the backend running on {apiBaseUrl()}?
        </p>
        <pre className="mt-4 overflow-auto rounded-md bg-muted p-4 text-xs">{text}</pre>
        <Link href="/catalog" className="mt-6 inline-block text-blue-600 hover:underline">
          ← Catalog
        </Link>
      </div>
    );
  }

  const me = (await res.json()) as {
    id: string;
    externalId: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    role: string;
    createdAt: string;
    updatedAt: string;
  };

  return (
    <div className="container mx-auto max-w-lg px-4 py-10">
      <h1 className="text-2xl font-bold">Account</h1>
      <p className="mt-2 text-sm text-muted-foreground">Synced from Clerk → API → database</p>
      <dl className="mt-8 space-y-3 text-sm">
        <div>
          <dt className="font-medium text-muted-foreground">Email</dt>
          <dd>{me.email}</dd>
        </div>
        <div>
          <dt className="font-medium text-muted-foreground">Name</dt>
          <dd>
            {[me.firstName, me.lastName].filter(Boolean).join(' ') || '—'}
          </dd>
        </div>
        <div>
          <dt className="font-medium text-muted-foreground">Role</dt>
          <dd>{me.role}</dd>
        </div>
        <div>
          <dt className="font-medium text-muted-foreground">Clerk id</dt>
          <dd className="break-all font-mono text-xs">{me.externalId}</dd>
        </div>
        <div>
          <dt className="font-medium text-muted-foreground">Internal id</dt>
          <dd className="break-all font-mono text-xs">{me.id}</dd>
        </div>
      </dl>
      <Link href="/catalog" className="mt-10 inline-block text-blue-600 hover:underline">
        ← Catalog
      </Link>
    </div>
  );
}
