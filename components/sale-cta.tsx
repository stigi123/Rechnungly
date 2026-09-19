import { buttonVariants } from "@/components/ui/button";
import { APP_NAME, BUNDLE, PAYPAL, PRICING } from "@/lib/config";
import { cn } from "@/lib/utils";

function BundlePaypalLink({
  className,
  variant,
}: {
  className?: string;
  variant: "secondary" | "outline";
}) {
  return (
    <a
      href={PAYPAL.sale}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(buttonVariants({ variant, size: "lg" }), "inline-flex h-11 px-5", className)}
    >
      Beide Apps für {PRICING.saleUsd} USD via PayPal
    </a>
  );
}

function AppLinks({ className }: { className?: string }) {
  return (
    <span className={className}>
      <a
        href={BUNDLE.thisUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2"
      >
        {APP_NAME}
      </a>{" "}
      und{" "}
      <a
        href={BUNDLE.partnerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2"
      >
        {BUNDLE.partnerName}
      </a>
    </span>
  );
}

export function SaleBanner() {
  return (
    <div className="rounded-2xl bg-primary px-6 py-8 text-primary-foreground sm:px-10">
      <p className="text-xs tracking-[0.2em] uppercase opacity-80">Doppel-Paket</p>
      <h2 className="mt-2 text-3xl tracking-tight">
        {APP_NAME} + {BUNDLE.partnerName} für {PRICING.saleUsd} USD
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-primary-foreground/85">
        Eine Zahlung: Source und Vercel für beide Apps — <AppLinks />. Danach Nachricht an
        denselben PayPal-Account für die Übergabe. Kein automatischer Download, kein erfundener
        Support-Kanal. Die {PRICING.unlockEur}-EUR-Freischaltung bleibt separat.
      </p>
      <BundlePaypalLink className="mt-6" variant="secondary" />
    </div>
  );
}

export function SalePanel() {
  return (
    <div className="rounded-2xl border border-dashed border-border p-5">
      <p className="text-sm font-medium">
        Optional: beide Apps für {PRICING.saleUsd} USD
      </p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Eine Zahlung umfasst Source und Vercel-Handoff für <AppLinks />. Das ist nicht die{" "}
        {PRICING.unlockEur}-EUR-Freischaltung. Kein automatischer Git-Zugang, Übergabe nach
        PayPal-Nachricht.
      </p>
      <BundlePaypalLink className="mt-4" variant="outline" />
    </div>
  );
}
