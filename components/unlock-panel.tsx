"use client";

import { useState } from "react";
import Link from "next/link";
import { SalePanel } from "@/components/sale-cta";
import { Button, buttonVariants } from "@/components/ui/button";
import { trackUnlockClick } from "@/lib/analytics";
import { PRICING } from "@/lib/config";
import { activateUnlock } from "@/lib/storage";
import { useUnlockState } from "@/lib/use-browser-store";
import { cn } from "@/lib/utils";

export function UnlockPanel({
  paypalUnlock,
}: {
  paypalUnlock: string;
}) {
  const { days } = useUnlockState();
  const [justUnlocked, setJustUnlocked] = useState(false);

  function confirmPaid() {
    activateUnlock();
    setJustUnlocked(true);
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <p className="text-sm font-medium">PDF ohne Wasserzeichen</p>
        <p className="mt-1 font-heading text-4xl">
          {PRICING.unlockEur} EUR
          <span className="ml-2 text-lg text-muted-foreground">/ {PRICING.unlockDays} Tage</span>
        </p>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Primärzahlung über PayPal.me. Danach in diesem Browser für {PRICING.unlockDays} Tage
          freischalten. Die App kann Zahlungen nicht serverseitig prüfen.
        </p>
        {days > 0 ? (
          <p className="mt-4 rounded-lg bg-primary/10 px-3 py-2 text-sm text-primary">
            Aktuell freigeschaltet: noch {days} {days === 1 ? "Tag" : "Tage"} in diesem Browser.
          </p>
        ) : null}
        {justUnlocked ? (
          <p className="mt-3 text-sm">
            Freischaltung gespeichert.{" "}
            <Link className="underline" href="/erstellen">
              Zur Rechnung
            </Link>
          </p>
        ) : null}
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <a
            href={paypalUnlock}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackUnlockClick()}
            className={cn(buttonVariants({ size: "lg" }), "h-11 px-5")}
          >
            {PRICING.unlockEur} EUR via PayPal
          </a>
          <Button type="button" variant="outline" className="h-11 px-5" onClick={confirmPaid}>
            Ich habe bezahlt — {PRICING.unlockDays} Tage freischalten
          </Button>
        </div>
      </div>

      <SalePanel />
    </div>
  );
}
