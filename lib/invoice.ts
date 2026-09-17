export type Country = "DE" | "AT" | "CH";
export type Currency = "EUR" | "CHF";

export type VatChip = {
  id: string;
  rate: number;
  label: string;
  hint: string;
  kleinunternehmer?: boolean;
};

export type LineItem = {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  vatRate: number;
};

export type Party = {
  name: string;
  address: string;
  taxId: string;
};

export type Invoice = {
  country: Country;
  currency: Currency;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  sender: Party;
  iban: string;
  client: Party;
  items: LineItem[];
  notes: string;
  kleinunternehmer: boolean;
};

export const UNITS = ["Std", "Stk", "Tag", "Psch", "km"] as const;

export const VAT_CHIPS: Record<Country, VatChip[]> = {
  DE: [
    { id: "de-19", rate: 19, label: "19 %", hint: "Regelsteuersatz" },
    { id: "de-7", rate: 7, label: "7 %", hint: "ermäßigt" },
    { id: "de-0", rate: 0, label: "0 %", hint: "steuerfrei" },
    {
      id: "de-19u",
      rate: 0,
      label: "§ 19",
      hint: "Kleinunternehmer",
      kleinunternehmer: true,
    },
  ],
  AT: [
    { id: "at-20", rate: 20, label: "20 %", hint: "Normalsteuersatz" },
    { id: "at-13", rate: 13, label: "13 %", hint: "ermäßigt" },
    { id: "at-10", rate: 10, label: "10 %", hint: "ermäßigt" },
    { id: "at-0", rate: 0, label: "0 %", hint: "steuerfrei" },
  ],
  CH: [
    { id: "ch-81", rate: 8.1, label: "8.1 %", hint: "Normalsatz" },
    { id: "ch-26", rate: 2.6, label: "2.6 %", hint: "reduziert" },
    { id: "ch-38", rate: 3.8, label: "3.8 %", hint: "Beherbergung" },
    { id: "ch-0", rate: 0, label: "0 %", hint: "MWST-befreit" },
  ],
};

export const COUNTRY_META: Record<
  Country,
  { label: string; currency: Currency; taxShort: string; taxLong: string }
> = {
  DE: { label: "Deutschland", currency: "EUR", taxShort: "USt.", taxLong: "Umsatzsteuer" },
  AT: { label: "Österreich", currency: "EUR", taxShort: "USt.", taxLong: "Umsatzsteuer" },
  CH: { label: "Schweiz", currency: "CHF", taxShort: "MWST", taxLong: "Mehrwertsteuer" },
};

export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function createLineItem(vatRate: number): LineItem {
  const id =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `pos-${Math.random().toString(36).slice(2, 10)}`;
  return {
    id,
    description: "",
    quantity: 1,
    unit: "Std",
    unitPrice: 0,
    vatRate,
  };
}

export function defaultVatRate(country: Country): number {
  return VAT_CHIPS[country][0].rate;
}

export function isoDate(date = new Date()): string {
  const tzOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - tzOffset).toISOString().slice(0, 10);
}

export function addDays(iso: string, days: number): string {
  const date = new Date(`${iso}T12:00:00`);
  date.setDate(date.getDate() + days);
  return isoDate(date);
}

export function formatDeDate(iso: string): string {
  if (!iso) return "—";
  const [year, month, day] = iso.split("-");
  if (!year || !month || !day) return iso;
  return `${day}.${month}.${year}`;
}

export function formatMoney(amount: number, currency: Currency, country: Country): string {
  const locale = country === "CH" ? "de-CH" : "de-DE";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatIban(iban: string): string {
  const compact = iban.replace(/\s+/g, "").toUpperCase();
  return compact.replace(/(.{4})/g, "$1 ").trim();
}

export function defaultNotes(country: Country, kleinunternehmer: boolean): string {
  const payment =
    country === "CH"
      ? "Zahlbar innert der angegebenen Frist, ohne Abzug."
      : "Zahlbar ohne Abzug innerhalb der angegebenen Frist.";

  if (country === "DE" && kleinunternehmer) {
    return `${payment}\nGemäß § 19 UStG wird keine Umsatzsteuer berechnet.`;
  }
  if (country === "AT" && kleinunternehmer) {
    return `${payment}\nKleinunternehmerregelung: keine Umsatzsteuer ausgewiesen.`;
  }
  return payment;
}

export function createDefaultInvoice(): Invoice {
  const issueDate = isoDate();
  return {
    country: "DE",
    currency: "EUR",
    invoiceNumber: `RE-${new Date().getFullYear()}-0001`,
    issueDate,
    dueDate: addDays(issueDate, 14),
    sender: { name: "", address: "", taxId: "" },
    iban: "",
    client: { name: "", address: "", taxId: "" },
    items: [createLineItem(19)],
    notes: defaultNotes("DE", false),
    kleinunternehmer: false,
  };
}

export function applyCountry(invoice: Invoice, country: Country): Invoice {
  const rate = defaultVatRate(country);
  const kleinunternehmer = false;
  return {
    ...invoice,
    country,
    currency: COUNTRY_META[country].currency,
    kleinunternehmer,
    items: invoice.items.map((item) => ({ ...item, vatRate: rate })),
    notes: defaultNotes(country, kleinunternehmer),
  };
}

export function applyVatChip(invoice: Invoice, chip: VatChip): Invoice {
  const kleinunternehmer = Boolean(chip.kleinunternehmer);
  return {
    ...invoice,
    kleinunternehmer,
    items: invoice.items.map((item) => ({
      ...item,
      vatRate: kleinunternehmer ? 0 : chip.rate,
    })),
    notes: defaultNotes(invoice.country, kleinunternehmer),
  };
}

export type VatGroup = {
  rate: number;
  net: number;
  vat: number;
};

export type InvoiceTotals = {
  net: number;
  vat: number;
  gross: number;
  groups: VatGroup[];
};

export function lineNet(item: LineItem): number {
  return roundMoney((Number(item.quantity) || 0) * (Number(item.unitPrice) || 0));
}

export function lineVat(item: LineItem, kleinunternehmer: boolean): number {
  if (kleinunternehmer) return 0;
  return roundMoney(lineNet(item) * ((Number(item.vatRate) || 0) / 100));
}

export function computeTotals(invoice: Invoice): InvoiceTotals {
  const map = new Map<number, VatGroup>();
  let net = 0;
  let vat = 0;

  for (const item of invoice.items) {
    const n = lineNet(item);
    const v = lineVat(item, invoice.kleinunternehmer);
    const rate = invoice.kleinunternehmer ? 0 : Number(item.vatRate) || 0;
    net = roundMoney(net + n);
    vat = roundMoney(vat + v);
    const group = map.get(rate) ?? { rate, net: 0, vat: 0 };
    group.net = roundMoney(group.net + n);
    group.vat = roundMoney(group.vat + v);
    map.set(rate, group);
  }

  return {
    net,
    vat,
    gross: roundMoney(net + vat),
    groups: [...map.values()].sort((a, b) => b.rate - a.rate),
  };
}

export function validateInvoice(invoice: Invoice): string[] {
  const errors: string[] = [];
  if (!invoice.sender.name.trim()) errors.push("Absender: Name fehlt.");
  if (!invoice.sender.address.trim()) errors.push("Absender: Adresse fehlt.");
  if (!invoice.client.name.trim()) errors.push("Kunde: Name fehlt.");
  if (!invoice.client.address.trim()) errors.push("Kunde: Adresse fehlt.");
  if (!invoice.invoiceNumber.trim()) errors.push("Rechnungsnummer fehlt.");
  if (!invoice.issueDate) errors.push("Rechnungsdatum fehlt.");
  if (!invoice.dueDate) errors.push("Fälligkeitsdatum fehlt.");
  const filled = invoice.items.filter((item) => item.description.trim());
  if (filled.length === 0) errors.push("Mindestens eine Position mit Beschreibung.");
  if (invoice.items.some((item) => item.description.trim() && (item.quantity <= 0 || item.unitPrice < 0))) {
    errors.push("Menge muss größer 0 sein, Preise nicht negativ.");
  }
  return errors;
}

export function exampleInvoice(): Invoice {
  const issueDate = isoDate();
  return {
    country: "DE",
    currency: "EUR",
    invoiceNumber: `RE-${new Date().getFullYear()}-0042`,
    issueDate,
    dueDate: addDays(issueDate, 14),
    sender: {
      name: "Anna Berger",
      address: "Linienstraße 12\n10119 Berlin",
      taxId: "",
    },
    iban: "DE89370400440532013000",
    client: {
      name: "Musterkunde GmbH",
      address: "Hafenstraße 8\n20459 Hamburg",
      taxId: "",
    },
    items: [
      {
        id: "ex-1",
        description: "Konzept & Gestaltung Website",
        quantity: 8,
        unit: "Std",
        unitPrice: 95,
        vatRate: 19,
      },
      {
        id: "ex-2",
        description: "Umsetzung Startseite (Desktop/Mobil)",
        quantity: 12,
        unit: "Std",
        unitPrice: 95,
        vatRate: 19,
      },
    ],
    notes: defaultNotes("DE", false),
    kleinunternehmer: false,
  };
}
