export const APP_NAME = "Rechnungly";

export const PAYPAL = {
  unlock: "https://paypal.me/NathanStieger/9EUR",
  sale: "https://paypal.me/NathanStieger/20USD",
} as const;

export const PRICING = {
  unlockEur: 9,
  unlockDays: 30,
  saleUsd: 20,
} as const;

/** One 20 USD payment = source + Vercel for both apps. Not the 9 EUR unlock. */
export const BUNDLE = {
  partnerName: "Offertly",
  thisUrl: "https://rechnungly.vercel.app",
  partnerUrl: "https://offertly.vercel.app",
} as const;

export const IMPRESSUM = {
  name: "Bernhard Stieger",
  street: "Staatsstrasse 11",
  zipCity: "9463 Oberriet",
  country: "Schweiz",
} as const;

export const ANALYTICS_EVENTS = {
  createClick: "create_click",
  pdfDownload: "pdf_download",
  unlockClick: "unlock_click",
} as const;
