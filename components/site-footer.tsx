import Link from "next/link";
import { APP_NAME, IMPRESSUM } from "@/lib/config";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/80">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div>
          <p className="font-heading text-lg text-foreground">{APP_NAME}</p>
          <p className="mt-1 max-w-md">
            Browser-Tool für A4-Rechnungen. Kein Konto, keine Buchhaltung, keine Steuerberatung.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          <Link className="hover:text-foreground" href="/impressum">
            Impressum
          </Link>
          <Link className="hover:text-foreground" href="/datenschutz">
            Datenschutz
          </Link>
          <Link className="hover:text-foreground" href="/entsperren">
            Entsperren
          </Link>
        </div>
      </div>
      <div className="mx-auto w-full max-w-6xl px-4 pb-8 text-xs text-muted-foreground sm:px-6">
        {IMPRESSUM.name}, {IMPRESSUM.street}, {IMPRESSUM.zipCity}, {IMPRESSUM.country}
      </div>
    </footer>
  );
}
