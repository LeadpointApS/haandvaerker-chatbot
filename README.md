# VVS Chatflow MVP

Next.js-prototype til chatbaseret leadkvalificering og prisestimat for VVS-virksomheder.

## Kom i gang lokalt

```bash
npm install
npm run dev
```

Åbn derefter `http://localhost:3000`.

## Deploy på Vercel

1. Opret et GitHub-repo.
2. Upload hele projektmappen.
3. Importér repoet i Vercel.
4. Deploy med standardindstillinger.

## Struktur

- `app/page.tsx` – hovedside med tabs
- `components/chat/*` – chatflow UI
- `components/dashboard/*` – white-label dashboard
- `components/summary/*` – live opsummeringspanel
- `lib/pricing.ts` – prislogik
- `lib/conversation.ts` – spørgsmål og branching
- `lib/address.ts` – autosuggest-demo
- `lib/config.ts` – defaults

## Næste anbefalede iterationer

- Rigtig Google Places API-integration
- Persistens af dashboard-indstillinger
- Send lead til mail / CRM / webhook
- Billedupload til storage
- Admin-login


## Mailopsætning

For at sende forespørgsler fra formularen til virksomhedens mail skal du sætte disse miljøvariabler i Vercel:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`

Virksomhedens modtagermail sættes i `/admin` under feltet **Virksomhedens mail**.

Bemærk: I denne prototype gemmes dashboard-indstillinger lokalt i browseren.
