import { APP_NAME, IMPRESSUM } from "@/lib/config";

export const metadata = {
  title: "Datenschutz",
};

export default function DatenschutzPage() {
  return (
    <article className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-4xl tracking-tight">Datenschutz</h1>
      <div className="mt-8 space-y-6 text-sm leading-7 text-muted-foreground">
        <p>
          {APP_NAME} speichert Rechnungsdaten nur lokal in deinem Browser (localStorage). Es gibt
          keine Benutzerkonten und keine eigene Datenbank.
        </p>
        <p>
          Beim Erzeugen des PDFs verlassen die Inhalte diesen Rechner nicht über {APP_NAME}. Du lädst
          eine Datei herunter, die auf deinem Gerät entsteht.
        </p>
        <p>
          Für Reichweitenmessung wird Vercel Analytics genutzt. Das ist cookieless und ersetzt kein
          Google Analytics. Es werden die Seitenaufrufe sowie die Ereignisse <code>create_click</code>
          , <code>pdf_download</code> und <code>unlock_click</code> erfasst, sobald die App auf Vercel
          läuft.
        </p>
        <p>
          Klickst du auf PayPal, gelten die Datenschutzhinweise von PayPal. {APP_NAME} empfängt keine
          Zahlungsdaten.
        </p>
        <p>
          Verantwortliche Stelle laut Impressum: {IMPRESSUM.name}, {IMPRESSUM.street},{" "}
          {IMPRESSUM.zipCity}, {IMPRESSUM.country}.
        </p>
        <p>
          Es wird hier keine E-Mail, kein Telefon und keine UID erfunden. Auskunfts- und
          Löschanliegen betreffen bei diesem Tool vor allem Daten auf deinem Gerät: Im Browser
          localStorage leeren, und die gespeicherte Rechnung sowie die Freischaltung sind weg.
        </p>
      </div>
    </article>
  );
}
