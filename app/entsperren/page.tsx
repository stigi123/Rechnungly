import { UnlockPanel } from "@/components/unlock-panel";
import { PAYPAL, PRICING } from "@/lib/config";

export const metadata = {
  title: "Entsperren",
  description: `PDF ohne Wasserzeichen für ${PRICING.unlockEur} EUR / ${PRICING.unlockDays} Tage via PayPal.`,
};

export default function EntsperrenPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="text-xs tracking-[0.2em] text-primary uppercase">Freischaltung</p>
      <h1 className="mt-2 text-4xl tracking-tight">Wasserzeichen weg. {PRICING.unlockDays} Tage.</h1>
      <p className="mt-4 text-base leading-7 text-muted-foreground">
        Rechnungly hat kein Nutzerkonto und kein Stripe. Die Freischaltung läuft über PayPal.me.
        PayPal bestätigt die Zahlung nicht automatisch an diese App — danach schaltest du diesen
        Browser selbst frei.
      </p>
      <UnlockPanel paypalUnlock={PAYPAL.unlock} paypalSale={PAYPAL.sale} />
    </div>
  );
}
