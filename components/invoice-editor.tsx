"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { InvoicePreview } from "@/components/invoice-preview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trackPdfDownload } from "@/lib/analytics";
import {
  COUNTRY_META,
  UNITS,
  VAT_CHIPS,
  applyCountry,
  applyVatChip,
  computeTotals,
  createLineItem,
  exampleInvoice,
  formatMoney,
  validateInvoice,
  type Country,
  type Invoice,
  type LineItem,
} from "@/lib/invoice";
import { downloadInvoicePdf } from "@/lib/pdf";
import { useInvoiceDraft, useUnlockState } from "@/lib/use-browser-store";
import { cn } from "@/lib/utils";

export function InvoiceEditor() {
  const [invoice, setInvoice] = useInvoiceDraft();
  const { unlocked } = useUnlockState();
  const [errors, setErrors] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  const totals = useMemo(() => computeTotals(invoice), [invoice]);
  const chips = VAT_CHIPS[invoice.country];
  const meta = COUNTRY_META[invoice.country];
  const activeChipId = invoice.kleinunternehmer
    ? chips.find((chip) => chip.kleinunternehmer)?.id
    : chips.find((chip) => !chip.kleinunternehmer && invoice.items.every((item) => item.vatRate === chip.rate))
        ?.id;

  function update<K extends keyof Invoice>(key: K, value: Invoice[K]) {
    setInvoice((current) => ({ ...current, [key]: value }));
  }

  function updateSender(patch: Partial<Invoice["sender"]>) {
    setInvoice((current) => ({ ...current, sender: { ...current.sender, ...patch } }));
  }

  function updateClient(patch: Partial<Invoice["client"]>) {
    setInvoice((current) => ({ ...current, client: { ...current.client, ...patch } }));
  }

  function updateItem(id: string, patch: Partial<LineItem>) {
    setInvoice((current) => ({
      ...current,
      items: current.items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }));
  }

  async function onDownload() {
    const nextErrors = validateInvoice(invoice);
    setErrors(nextErrors);
    if (nextErrors.length > 0) {
      requestAnimationFrame(() => {
        document.getElementById("pdf-errors")?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
      return;
    }
    setBusy(true);
    try {
      downloadInvoicePdf(invoice, unlocked);
      trackPdfDownload();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.92fr)]">
      <form
        className="space-y-6"
        onSubmit={(event) => {
          event.preventDefault();
          void onDownload();
        }}
      >
        <section className="rounded-xl border border-border/80 bg-card p-4 sm:p-5">
          <h2 className="text-lg">Land und Steuer</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {(["DE", "AT", "CH"] as Country[]).map((country) => (
              <Chip
                key={country}
                active={invoice.country === country}
                onClick={() => setInvoice((current) => applyCountry(current, country))}
              >
                {country}
              </Chip>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {chips.map((chip) => (
              <Chip
                key={chip.id}
                active={activeChipId === chip.id}
                onClick={() => setInvoice((current) => applyVatChip(current, chip))}
              >
                {chip.label}
                <span className="ml-1 text-[11px] opacity-70">{chip.hint}</span>
              </Chip>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Währung <span className="font-medium text-foreground">{meta.currency}</span>
            {invoice.country === "CH" ? " (Schweiz)" : null}. Chips setzen den Satz für alle
            Positionen. Einzelne Zeilen kannst du danach noch anpassen.
          </p>
        </section>

        <section className="grid gap-4 rounded-xl border border-border/80 bg-card p-4 sm:grid-cols-2 sm:p-5">
          <PartyFields
            title="Absender"
            party={invoice.sender}
            onChange={updateSender}
            namePlaceholder="Name / Studio"
            addressPlaceholder={"Straße Nr.\nPLZ Ort"}
          />
          <PartyFields
            title="Kunde"
            party={invoice.client}
            onChange={updateClient}
            namePlaceholder="Kundenname"
            addressPlaceholder={"Straße Nr.\nPLZ Ort"}
          />
          <Field label="IBAN (optional)" className="sm:col-span-2">
            <Input
              value={invoice.iban}
              onChange={(event) => update("iban", event.target.value)}
              placeholder="DE89 3704 0044 0532 0130 00"
              autoComplete="off"
            />
          </Field>
        </section>

        <section className="grid gap-3 rounded-xl border border-border/80 bg-card p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-4">
          <Field label="Rechnungsnummer">
            <Input
              value={invoice.invoiceNumber}
              onChange={(event) => update("invoiceNumber", event.target.value)}
            />
          </Field>
          <Field label="Datum">
            <Input
              type="date"
              value={invoice.issueDate}
              onChange={(event) => update("issueDate", event.target.value)}
            />
          </Field>
          <Field label="Fällig am">
            <Input
              type="date"
              value={invoice.dueDate}
              onChange={(event) => update("dueDate", event.target.value)}
            />
          </Field>
          <div className="flex items-end text-sm text-muted-foreground">
            {COUNTRY_META[invoice.country].label} · {invoice.currency}
          </div>
        </section>

        <section className="rounded-xl border border-border/80 bg-card p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg">Positionen</h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setInvoice((current) => ({
                  ...current,
                  items: [
                    ...current.items,
                    createLineItem(
                      current.kleinunternehmer ? 0 : (current.items[0]?.vatRate ?? 19),
                    ),
                  ],
                }))
              }
            >
              <Plus />
              Zeile
            </Button>
          </div>
          <div className="mt-4 space-y-4">
            {invoice.items.map((item, index) => (
              <div key={item.id} className="grid gap-2 rounded-lg border border-border/70 p-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Pos. {String(index + 1).padStart(2, "0")}</span>
                  {invoice.items.length > 1 ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      onClick={() =>
                        setInvoice((current) => ({
                          ...current,
                          items: current.items.filter((row) => row.id !== item.id),
                        }))
                      }
                    >
                      <Trash2 />
                      Entfernen
                    </Button>
                  ) : null}
                </div>
                <Input
                  value={item.description}
                  placeholder="Leistung"
                  onChange={(event) => updateItem(item.id, { description: event.target.value })}
                />
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <Field label="Menge">
                    <Input
                      type="number"
                      min="0"
                      step="0.25"
                      value={item.quantity}
                      onChange={(event) =>
                        updateItem(item.id, { quantity: Number(event.target.value) })
                      }
                    />
                  </Field>
                  <Field label="Einheit">
                    <select
                      className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
                      value={item.unit}
                      onChange={(event) => updateItem(item.id, { unit: event.target.value })}
                    >
                      {UNITS.map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Einzelpreis">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(event) =>
                        updateItem(item.id, { unitPrice: Number(event.target.value) })
                      }
                    />
                  </Field>
                  <Field label={meta.taxShort}>
                    <select
                      className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
                      value={item.vatRate}
                      disabled={invoice.kleinunternehmer}
                      onChange={(event) =>
                        updateItem(item.id, { vatRate: Number(event.target.value) })
                      }
                    >
                      {chips
                        .filter((chip) => !chip.kleinunternehmer)
                        .map((chip) => (
                          <option key={chip.id} value={chip.rate}>
                            {chip.label}
                          </option>
                        ))}
                    </select>
                  </Field>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-border/80 bg-card p-4 sm:p-5">
          <Field label="Hinweis auf der Rechnung">
            <Textarea
              value={invoice.notes}
              onChange={(event) => update("notes", event.target.value)}
              rows={4}
            />
          </Field>
        </section>

        {errors.length > 0 ? (
          <div
            id="pdf-errors"
            role="alert"
            className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          >
            <p className="font-medium">PDF noch nicht vollständig</p>
            <ul className="mt-1 list-disc pl-4">
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="sticky bottom-3 z-20 flex flex-col gap-3 rounded-xl border border-border bg-card/95 p-3 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Brutto</p>
            <p className="font-heading text-2xl">
              {formatMoney(totals.gross, invoice.currency, invoice.country)}
            </p>
            {!unlocked ? (
              <p className="text-xs text-muted-foreground">
                Demo-Wasserzeichen ·{" "}
                <Link className="underline" href="/entsperren">
                  entsperren
                </Link>
              </p>
            ) : (
              <p className="text-xs text-primary">Freigeschaltet in diesem Browser</p>
            )}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setErrors([]);
                setInvoice(exampleInvoice());
              }}
            >
              Muster laden
            </Button>
            <Button type="button" disabled={busy} className="h-10 px-4" onClick={() => void onDownload()}>
              {busy ? "Erzeuge PDF…" : "PDF herunterladen"}
            </Button>
          </div>
        </div>
      </form>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <p className="mb-3 hidden text-xs tracking-[0.18em] text-muted-foreground uppercase lg:block">
          Vorschau A4
        </p>
        <InvoicePreview invoice={invoice} unlocked={unlocked} />
      </aside>
    </div>
  );
}

function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-left text-sm transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background hover:bg-accent",
      )}
    >
      {children}
    </button>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-1.5", className)}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function PartyFields({
  title,
  party,
  onChange,
  namePlaceholder,
  addressPlaceholder,
}: {
  title: string;
  party: Invoice["sender"];
  onChange: (patch: Partial<Invoice["sender"]>) => void;
  namePlaceholder: string;
  addressPlaceholder: string;
}) {
  return (
    <div className="grid gap-3">
      <h2 className="text-lg">{title}</h2>
      <Field label="Name">
        <Input
          value={party.name}
          placeholder={namePlaceholder}
          onChange={(event) => onChange({ name: event.target.value })}
        />
      </Field>
      <Field label="Adresse">
        <Textarea
          value={party.address}
          placeholder={addressPlaceholder}
          rows={3}
          onChange={(event) => onChange({ address: event.target.value })}
        />
      </Field>
      <Field label="Steuer-Nr. / USt-IdNr. (optional)">
        <Input
          value={party.taxId}
          onChange={(event) => onChange({ taxId: event.target.value })}
        />
      </Field>
    </div>
  );
}
