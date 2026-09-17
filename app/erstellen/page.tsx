import { InvoiceEditor } from "@/components/invoice-editor";

export const metadata = {
  title: "Rechnung erstellen",
  description: "A4-Rechnung mit Absender, Kunde, Positionen und USt./MWST als PDF im Browser.",
};

export default function ErstellenPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-8 max-w-2xl">
        <p className="text-xs tracking-[0.2em] text-primary uppercase">Editor</p>
        <h1 className="mt-2 text-3xl tracking-tight sm:text-4xl">Rechnung erstellen</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Daten bleiben in diesem Browser. Das PDF wird lokal erzeugt. In der Demo liegt ein
          Wasserzeichen über der Seite.
        </p>
      </div>
      <InvoiceEditor />
    </div>
  );
}
