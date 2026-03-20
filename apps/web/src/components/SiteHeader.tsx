'use client';

import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-background">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="text-lg font-semibold tracking-tight hover:opacity-80">
          3D Stock
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/catalog" className="text-muted-foreground hover:text-foreground">
            Catalog
          </Link>
          <SignedIn>
            <Link href="/account" className="text-muted-foreground hover:text-foreground">
              Account
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <Link
              href="/sign-in"
              className="rounded-md bg-foreground px-3 py-1.5 text-background hover:opacity-90"
            >
              Sign in
            </Link>
          </SignedOut>
        </nav>
      </div>
    </header>
  );
}
