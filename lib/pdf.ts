import { jsPDF } from "jspdf";
import { APP_NAME } from "@/lib/config";
import {
  COUNTRY_META,
  computeTotals,
  formatDeDate,
  formatIban,
  formatMoney,
  lineNet,
  type Invoice,
} from "@/lib/invoice";

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 18;

function filename(invoice: Invoice): string {
  const safe = invoice.invoiceNumber.replace(/[^\w.-]+/g, "-") || "Rechnung";
  return `${safe}.pdf`;
}

export function downloadInvoicePdf(invoice: Invoice, unlocked: boolean): void {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const totals = computeTotals(invoice);
  const meta = COUNTRY_META[invoice.country];
  const billableItems = invoice.items.filter((item) => item.description.trim());

  const ink: [number, number, number] = [28, 25, 21];
  const muted: [number, number, number] = [110, 102, 92];
  const rule: [number, number, number] = [214, 205, 190];
  const accent: [number, number, number] = [47, 74, 60];

  const setInk = () => doc.setTextColor(...ink);
  const setMuted = () => doc.setTextColor(...muted);

  const drawWatermark = () => {
    if (unlocked) return;
    doc.saveGraphicsState();
    doc.setTextColor(210, 204, 194);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(64);
    doc.text("DEMO", PAGE_W / 2, PAGE_H / 2, {
      align: "center",
      angle: 32,
    });
    doc.restoreGraphicsState();
  };

  let y = MARGIN;
  drawWatermark();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...accent);
  doc.text(APP_NAME, MARGIN, y);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  setInk();
  doc.text("RECHNUNG", PAGE_W - MARGIN, y, { align: "right" });
  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  setMuted();
  doc.text(
    unlocked ? "A4 · DACH · ohne Konto" : "Demo mit Wasserzeichen — nicht zum Versand",
    PAGE_W - MARGIN,
    y,
    { align: "right" },
  );
  y += 8;

  doc.setDrawColor(...rule);
  doc.setLineWidth(0.4);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 10;

  const colW = (PAGE_W - MARGIN * 2) / 2 - 4;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  setMuted();
  doc.text("ABSENDER", MARGIN, y);
  doc.text("RECHNUNGSEMPFÄNGER", MARGIN + colW + 8, y);
  y += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  setInk();
  const senderBlock = [
    invoice.sender.name,
    ...invoice.sender.address.split("\n"),
    invoice.sender.taxId ? `Steuer-Nr. / USt-IdNr.: ${invoice.sender.taxId}` : "",
  ]
    .map((line) => line.trim())
    .filter(Boolean);
  const clientBlock = [
    invoice.client.name,
    ...invoice.client.address.split("\n"),
    invoice.client.taxId ? `Steuer-Nr. / USt-IdNr.: ${invoice.client.taxId}` : "",
  ]
    .map((line) => line.trim())
    .filter(Boolean);

  const leftLines = doc.splitTextToSize(senderBlock.join("\n"), colW) as string[];
  const rightLines = doc.splitTextToSize(clientBlock.join("\n"), colW) as string[];
  doc.text(leftLines, MARGIN, y);
  doc.text(rightLines, MARGIN + colW + 8, y);
  y += Math.max(leftLines.length, rightLines.length) * 5 + 8;

  const metaRows: [string, string][] = [
    ["Rechnungsnummer", invoice.invoiceNumber],
    ["Rechnungsdatum", formatDeDate(invoice.issueDate)],
    ["Fällig am", formatDeDate(invoice.dueDate)],
    ["Land / Währung", `${meta.label} · ${invoice.currency}`],
  ];
  doc.setFillColor(246, 241, 232);
  doc.roundedRect(MARGIN, y, PAGE_W - MARGIN * 2, 16, 1.5, 1.5, "F");
  const metaW = (PAGE_W - MARGIN * 2) / metaRows.length;
  metaRows.forEach(([label, value], index) => {
    const x = MARGIN + 4 + index * metaW;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    setMuted();
    doc.text(label, x, y + 6);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    setInk();
    doc.text(value, x, y + 12);
  });
  y += 24;

  const cols = {
    pos: MARGIN,
    desc: MARGIN + 10,
    qty: PAGE_W - MARGIN - 78,
    unit: PAGE_W - MARGIN - 62,
    price: PAGE_W - MARGIN - 46,
    vat: PAGE_W - MARGIN - 28,
    total: PAGE_W - MARGIN,
  };

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  setMuted();
  doc.text("POS", cols.pos, y);
  doc.text("BESCHREIBUNG", cols.desc, y);
  doc.text("MENGE", cols.qty, y, { align: "right" });
  doc.text("EINH.", cols.unit, y, { align: "right" });
  doc.text("PREIS", cols.price, y, { align: "right" });
  doc.text(meta.taxShort.toUpperCase(), cols.vat, y, { align: "right" });
  doc.text("BETRAG", cols.total, y, { align: "right" });
  y += 2;
  doc.setDrawColor(...rule);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 6;

  const ensureSpace = (needed: number) => {
    if (y + needed < PAGE_H - 22) return;
    doc.addPage();
    drawWatermark();
    y = MARGIN;
    setInk();
  };

  billableItems.forEach((item, index) => {
    const descLines = doc.splitTextToSize(item.description, 70) as string[];
    ensureSpace(descLines.length * 5 + 6);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    setInk();
    doc.text(String(index + 1).padStart(2, "0"), cols.pos, y);
    doc.text(descLines, cols.desc, y);
    doc.text(String(item.quantity), cols.qty, y, { align: "right" });
    doc.text(item.unit, cols.unit, y, { align: "right" });
    doc.text(formatMoney(item.unitPrice, invoice.currency, invoice.country), cols.price, y, {
      align: "right",
    });
    doc.text(
      invoice.kleinunternehmer ? "—" : `${item.vatRate} %`,
      cols.vat,
      y,
      { align: "right" },
    );
    doc.text(formatMoney(lineNet(item), invoice.currency, invoice.country), cols.total, y, {
      align: "right",
    });
    y += descLines.length * 5 + 3;
  });

  y += 2;
  doc.setDrawColor(...rule);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 8;

  ensureSpace(40);
  const totalsX = PAGE_W - MARGIN - 70;
  const writeTotal = (label: string, value: string, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(bold ? 11 : 9);
    setInk();
    doc.text(label, totalsX, y);
    doc.text(value, PAGE_W - MARGIN, y, { align: "right" });
    y += bold ? 7 : 5.5;
  };

  writeTotal("Netto", formatMoney(totals.net, invoice.currency, invoice.country));
  for (const group of totals.groups) {
    writeTotal(
      `${meta.taxShort} ${group.rate} %`,
      formatMoney(group.vat, invoice.currency, invoice.country),
    );
  }
  y += 1;
  doc.setDrawColor(...accent);
  doc.setLineWidth(0.5);
  doc.line(totalsX, y, PAGE_W - MARGIN, y);
  y += 6;
  writeTotal("Brutto", formatMoney(totals.gross, invoice.currency, invoice.country), true);

  if (invoice.iban.trim()) {
    y += 4;
    ensureSpace(16);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    setMuted();
    doc.text("ZAHLUNG", MARGIN, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    setInk();
    doc.text(`IBAN ${formatIban(invoice.iban)}`, MARGIN, y);
    y += 8;
  }

  if (invoice.notes.trim()) {
    ensureSpace(24);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    setMuted();
    doc.text("HINWEIS", MARGIN, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    setInk();
    const noteLines = doc.splitTextToSize(invoice.notes, PAGE_W - MARGIN * 2) as string[];
    doc.text(noteLines, MARGIN, y);
    y += noteLines.length * 4.5 + 6;
  }

  const pageCount = doc.getNumberOfPages();
  const footer = unlocked
    ? `${APP_NAME} · Hilfstool, keine Steuerberatung. Pflichtangaben selbst prüfen.`
    : `${APP_NAME} Demo · Wasserzeichen · PDF nach Freischaltung ohne DEMO-Schriftzug.`;
  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    setMuted();
    doc.text(footer, MARGIN, PAGE_H - 12);
    doc.text(`Seite ${page}/${pageCount}`, PAGE_W - MARGIN, PAGE_H - 12, {
      align: "right",
    });
  }

  doc.save(filename(invoice));
}
