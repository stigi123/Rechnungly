import {
  COUNTRY_META,
  computeTotals,
  formatDeDate,
  formatIban,
  formatMoney,
  lineNet,
  type Invoice,
} from "@/lib/invoice";

export function InvoicePreview({
  invoice,
  unlocked,
}: {
  invoice: Invoice;
  unlocked: boolean;
}) {
  const totals = computeTotals(invoice);
  const meta = COUNTRY_META[invoice.country];
  const items = invoice.items.filter((item) => item.description.trim());

  return (
    <div className="overflow-x-auto rounded-xl ring-1 ring-foreground/10">
      <div className="relative mx-auto aspect-[210/297] w-full min-w-[280px] bg-paper p-[6%] text-[10px] leading-snug text-foreground shadow-inner sm:text-[11px]">
        {!unlocked ? (
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <span className="rotate-[-28deg] text-6xl font-bold tracking-widest text-foreground/10 sm:text-7xl">
              DEMO
            </span>
          </div>
        ) : null}

        <div className="flex items-start justify-between gap-3">
          <p className="text-[10px] tracking-[0.2em] text-primary uppercase">Rechnungly</p>
          <div className="text-right">
            <p className="font-heading text-2xl sm:text-3xl">Rechnung</p>
            <p className="text-[10px] text-muted-foreground">
              {unlocked ? "A4 · DACH" : "Demo mit Wasserzeichen"}
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4 border-t border-border pt-4">
          <Address label="Absender" party={invoice.sender} />
          <Address label="Rechnungsempfänger" party={invoice.client} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 rounded-md bg-background/70 p-2 sm:grid-cols-4">
          <Meta label="Nummer" value={invoice.invoiceNumber || "—"} />
          <Meta label="Datum" value={formatDeDate(invoice.issueDate)} />
          <Meta label="Fällig" value={formatDeDate(invoice.dueDate)} />
          <Meta label="Währung" value={invoice.currency} />
        </div>

        <div className="mt-4">
          <div className="grid grid-cols-[1fr_auto_auto] gap-2 border-b border-border pb-1 text-[9px] tracking-wide text-muted-foreground uppercase">
            <span>Beschreibung</span>
            <span>Menge</span>
            <span className="text-right">Betrag</span>
          </div>
          <div className="divide-y divide-border/70">
            {(items.length > 0 ? items : invoice.items.slice(0, 1)).map((item) => (
              <div key={item.id} className="grid grid-cols-[1fr_auto_auto] gap-2 py-1.5">
                <div>
                  <p>{item.description || "Position"}</p>
                  <p className="text-[9px] text-muted-foreground">
                    {formatMoney(item.unitPrice, invoice.currency, invoice.country)} / {item.unit}
                    {invoice.kleinunternehmer ? "" : ` · ${item.vatRate} %`}
                  </p>
                </div>
                <span>
                  {item.quantity} {item.unit}
                </span>
                <span className="text-right">
                  {formatMoney(lineNet(item), invoice.currency, invoice.country)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 ml-auto w-[55%] space-y-1">
          <Row
            label="Netto"
            value={formatMoney(totals.net, invoice.currency, invoice.country)}
          />
          {totals.groups.map((group) => (
            <Row
              key={group.rate}
              label={`${meta.taxShort} ${group.rate} %`}
              value={formatMoney(group.vat, invoice.currency, invoice.country)}
            />
          ))}
          <Row
            label="Brutto"
            value={formatMoney(totals.gross, invoice.currency, invoice.country)}
            strong
          />
        </div>

        {invoice.iban.trim() ? (
          <p className="mt-5 text-[10px]">IBAN {formatIban(invoice.iban)}</p>
        ) : null}
        {invoice.notes.trim() ? (
          <p className="mt-3 whitespace-pre-line text-[10px] text-muted-foreground">
            {invoice.notes}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function Address({
  label,
  party,
}: {
  label: string;
  party: Invoice["sender"];
}) {
  return (
    <div>
      <p className="text-[9px] tracking-[0.16em] text-muted-foreground uppercase">{label}</p>
      <p className="mt-1 font-medium">{party.name || "—"}</p>
      <p className="whitespace-pre-line text-muted-foreground">{party.address || ""}</p>
      {party.taxId ? <p className="text-muted-foreground">{party.taxId}</p> : null}
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[9px] text-muted-foreground">{label}</p>
      <p>{value}</p>
    </div>
  );
}

function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className={`flex justify-between gap-3 ${strong ? "border-t border-foreground/20 pt-1 font-medium" : ""}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
