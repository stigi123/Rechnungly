import Link from "next/link";
import { CreateCta } from "@/components/create-cta";
import { SaleBanner } from "@/components/sale-cta";
import { buttonVariants } from "@/components/ui/button";
import { APP_NAME, PRICING } from "@/lib/config";
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <div>
      <section className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-20">
        <div>
          <p className="text-xs tracking-[0.22em] text-primary uppercase">DE · AT · CH</p>
          <h1 className="mt-3 max-w-xl text-4xl leading-[1.1] tracking-tight sm:text-5xl">
            Die Rechnung. A4. Im Browser.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg">
            {APP_NAME} schreibt eine klassische PDF-Rechnung für Freelancer: Absender, Kunde,
            Positionen, USt./MWST-Chips, Nummer, Datum, Frist, optional IBAN. Nichts wird auf
            einem Server gespeichert.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <CreateCta />
            <Link
              href="/entsperren"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 px-5")}
            >
              {PRICING.unlockEur} EUR / {PRICING.unlockDays} Tage
            </Link>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Demo-PDF trägt ein Wasserzeichen. Sauberes PDF nach PayPal-Freischaltung in diesem
            Browser.
          </p>
        </div>
        <HeroPaper />
      </section>

      <section className="border-y border-border/80 bg-card/60">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3 sm:px-6">
          <Step n="01" title="Daten eintragen">
            Absender, Empfänger, Positionen mit Menge, Einheit und Steuersatz. Land per Chip: DE, AT
            oder CH.
          </Step>
          <Step n="02" title="PDF laden">
            Die Datei entsteht lokal im Browser. A4, deutsche Datumsformate, Netto/Steuer/Brutto.
          </Step>
          <Step n="03" title="Optional entsperren">
            {PRICING.unlockEur} EUR via PayPal für {PRICING.unlockDays} Tage ohne DEMO-Schriftzug.
            Kein Konto, kein Stripe.
          </Step>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
        <h2 className="text-3xl tracking-tight">Ehrlich klein gehalten</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Fact title="Kein Konto">Alles bleibt in deinem Browser (localStorage). Keine Registrierung.</Fact>
          <Fact title="Keine Google-Cookies">Nur Vercel Analytics, cookieless. Kein Google Analytics.</Fact>
          <Fact title="Steuersätze als Chips">DE 19/7/0/% §19, AT 20/13/10/0, CH 8.1/2.6/3.8/0.</Fact>
          <Fact title="Keine Steuerberatung">
            Pflichtangaben (§ 14 UStG / MWST) prüfst du selbst. {APP_NAME} ist ein Layout-Tool.
          </Fact>
        </div>
      </section>

      <section className="mx-auto mb-16 w-full max-w-6xl px-4 sm:px-6">
        <SaleBanner />
      </section>
    </div>
  );
}

function Step({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="font-mono text-xs tracking-widest text-primary">{n}</p>
      <h2 className="mt-2 text-2xl">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{children}</p>
    </div>
  );
}

function Fact({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border/80 bg-card p-5">
      <h3 className="font-medium">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{children}</p>
    </div>
  );
}

function HeroPaper() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="absolute inset-3 translate-x-2 translate-y-3 rounded-md bg-primary/10" />
      <div className="relative rounded-md bg-paper p-6 shadow-[0_20px_50px_-28px_rgba(47,74,60,0.45)] ring-1 ring-foreground/10 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">Absender</p>
            <p className="mt-1 text-sm">Dein Studio</p>
            <p className="text-xs text-muted-foreground">Straße, PLZ Ort</p>
          </div>
          <p className="font-heading text-2xl">Rechnung</p>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-2 border-y border-dashed border-border py-3 text-[11px]">
          <div>
            <p className="text-muted-foreground">Nr.</p>
            <p>RE-2026-0001</p>
          </div>
          <div>
            <p className="text-muted-foreground">Datum</p>
            <p>15.09.2026</p>
          </div>
          <div>
            <p className="text-muted-foreground">Fällig</p>
            <p>29.09.2026</p>
          </div>
        </div>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <span>Konzept, 8 Std</span>
            <span>760,00 €</span>
          </div>
          <div className="flex justify-between gap-4">
            <span>Umsetzung, 12 Std</span>
            <span>1.140,00 €</span>
          </div>
        </div>
        <div className="mt-6 flex items-end justify-between">
          <p className="text-[11px] text-muted-foreground">USt. 19 %</p>
          <p className="font-heading text-2xl">2.261,00 €</p>
        </div>
      </div>
    </div>
  );
}
