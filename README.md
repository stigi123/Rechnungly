# Rechnungly

Browser-only A4 invoice (`Rechnung`) PDF for freelancers in DE, AT and CH. German UI, no accounts, no Stripe, no Google Analytics cookies.

Demo PDFs are watermarked. Unlock is **9 EUR / 30 days** via PayPal. The whole app can be sold for **20 USD** (source + deploy handoff).

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:43127](http://localhost:43127).

If the UI renders but buttons do nothing, the client bundle did not hydrate (some environments block the Next.js HMR websocket). Use the production server instead:

```bash
npm run build
npm start
```

| Route | Purpose |
| --- | --- |
| `/` | Homepage + sale CTA |
| `/erstellen` | Editor (sender, client, line items, VAT chips, number, dates, optional IBAN) |
| `/entsperren` | PayPal unlock |
| `/impressum` | Imprint |
| `/datenschutz` | Privacy |

Invoice drafts and the 30-day unlock flag live in `localStorage` on this device. PayPal.me does not call back into the app; after paying, use **Ich habe bezahlt** on `/entsperren`.

## PayPal

- Unlock: [paypal.me/NathanStieger/9EUR](https://paypal.me/NathanStieger/9EUR)
- Whole app: [paypal.me/NathanStieger/20USD](https://paypal.me/NathanStieger/20USD)

## Analytics

[`@vercel/analytics`](https://vercel.com/docs/analytics) records page views plus:

- `create_click`
- `pdf_download`
- `unlock_click`

Enable **Web Analytics** on the Vercel project after the first deploy. Nothing is sent to Google Analytics.

## Deploy to Vercel (GitHub under stigi123)

The repo is standard Next.js App Router, so Vercel auto-detects it.

1. Create a GitHub repository (for example `stigi123/rechnungly`).
2. Push this project:

   ```bash
   git remote add github git@github.com:stigi123/rechnungly.git
   git push -u github main
   ```

3. In Vercel, team **stigi123** → **Add New** → **Project** → import that GitHub repo.
4. Framework: Next.js (default). No env vars required.
5. Project Settings → Analytics → enable Web Analytics.

Production URL is then the Vercel domain you assign (for example `rechnungly.vercel.app`).

## Deploy from this Origin repo

If GitHub is not wired yet, import the current `main` branch in Vercel with the Cursor Origin git URL, still under team **stigi123**. Every push to `main` can deploy once the project is linked.

```bash
npm run build
```

must succeed locally before you rely on a production deploy.

## Stack

Next.js App Router, TypeScript, Tailwind, shadcn/ui, jsPDF (client-side A4), `@vercel/analytics`.

## Legal

Impressum: Bernhard Stieger, Staatsstrasse 11, 9463 Oberriet, Schweiz. No extra email, phone, or VAT ID is published here because none was provided. Rechnungly is a layout helper, not tax advice.
