import { IMPRESSUM } from "@/lib/config";

export const metadata = {
  title: "Impressum",
};

export default function ImpressumPage() {
  return (
    <article className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-4xl tracking-tight">Impressum</h1>
      <p className="mt-6 whitespace-pre-line text-base leading-7">
        {`${IMPRESSUM.name}
${IMPRESSUM.street}
${IMPRESSUM.zipCity}
${IMPRESSUM.country}`}
      </p>
      <p className="mt-8 text-sm leading-6 text-muted-foreground">
        Rechnungly ist ein Browser-Hilfstool zur Gestaltung von PDF-Rechnungen. Es ersetzt keine
        Steuerberatung und keine Buchhaltung. Es werden hier keine E-Mail-Adresse, keine Telefonnummer
        und keine UID/USt-IdNr. angegeben, die nicht vorliegen.
      </p>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">
        Haftungsausschluss: Trotz sorgfältiger Erstellung wird für die Richtigkeit der erzeugten
        Dokumente und für externe PayPal-Seiten keine Gewähr übernommen.
      </p>
    </article>
  );
}
