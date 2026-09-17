"use client";

import Link from "next/link";
import { APP_NAME } from "@/lib/config";
import { useUnlockState } from "@/lib/use-browser-store";

export function SiteHeader() {
  const { days } = useUnlockState();

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-heading text-2xl tracking-tight">{APP_NAME}</span>
          <span className="hidden text-xs tracking-[0.18em] text-muted-foreground uppercase sm:inline">
            A4 Rechnung
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm sm:gap-3">
          <Link className="rounded-md px-2 py-1.5 hover:bg-accent" href="/erstellen">
            Erstellen
          </Link>
          <Link className="rounded-md px-2 py-1.5 hover:bg-accent" href="/entsperren">
            Entsperren
            {days > 0 ? (
              <span className="ml-1.5 hidden rounded-full bg-primary/10 px-1.5 py-0.5 text-[11px] text-primary sm:inline">
                {days} T.
              </span>
            ) : null}
          </Link>
        </nav>
      </div>
    </header>
  );
}
