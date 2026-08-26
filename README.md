# RULANTU — rulantu.com

RULANTU builds the complete digital presence of a business — strategy,
branding, websites, content, SEO and growth — as one accountable partner.
This repo is the RULANTU marketing site: a one-page, motion-driven
experience meant to be the company's first portfolio piece.

## Stack

- **Next.js (App Router) + TypeScript**, statically exported (`output: "export"`)
  — no server, no runtime backend.
- **Tailwind CSS v4** for layout/utility styling, with a small custom design
  system layered on top (`src/app/globals.css`).
- **GSAP + ScrollTrigger** for scroll-driven reveals, pinning-style active
  states, and scrubbed animations.
- **Lenis** for inertia smooth scrolling, kept in sync with ScrollTrigger.
- Zero backend, zero database, zero CMS.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export -> ./out
npm run lint
```

`npm run build` produces a fully static `out/` directory — every route in
this project is pre-rendered at build time (see `next.config.ts`,
`output: "export"`).

## Project structure

```
src/
  app/
    [[...locale]]/     # the actual site — layout, page, OG image (see i18n below)
    not-found.tsx       # 404, lives outside [[...locale]] (see i18n below)
    globals.css, robots.ts, sitemap.ts, opengraph-image.tsx
  components/
    layout/            # Nav, Footer, SmoothScroll, CustomCursor
    sections/          # one component per page section (Hero, Philosophy, …)
    ui/                # Reveal, SplitReveal, MagneticButton, Marquee, Logo
  data/content.ts       # every piece of copy, in every language — edit this to change text
  lib/gsap.ts           # GSAP/ScrollTrigger plugin registration + reduced-motion check
```

All site copy lives in `src/data/content.ts` as a `Dictionary` per locale
(`en`, `es`). Every section component takes a `dict: Dictionary` prop rather
than importing copy directly — change wording there, not in components.

## Internationalization (English / Spanish)

English lives at `rulantu.com/` (unprefixed), Spanish at `rulantu.com/es`.
There's no server, so this isn't cookie/header-based locale detection —
it's two fully static, pre-rendered routes, picked with the language
switcher in the nav (or a direct link/bookmark to `/es`).

**How it's wired**, since `output: "export"` rules out Next middleware:

- `src/app/[[...locale]]/` is an **optional catch-all** route.
  `generateStaticParams` (in `src/data/content.ts:generateLocaleParams`)
  emits one entry per locale — `{ locale: [] }` builds `/`, `{ locale: ["es"] }`
  builds `/es`. `resolveLocale()` turns that param back into a `Locale` at
  render time, falling back to English for anything unrecognized.
- `[[...locale]]/layout.tsx` is the **actual root layout** — it renders
  `<html lang={locale}>`, fonts, metadata (title/description/OG/hreflang
  alternates), and JSON-LD, all locale-aware. There's deliberately no
  top-level `app/layout.tsx`: Next allows the outermost layout in a route's
  tree to live inside a dynamic segment, and that's the only way to get a
  correct, per-page `<html lang>` without a server.
- **Trade-off:** `/_not-found` (Next's built-in 404) resolves outside the
  `[[...locale]]` tree, so it can't reach that layout. `src/app/not-found.tsx`
  provides a branded fallback, but it doesn't get the Google fonts loaded
  by the locale layout (system font stack instead) — a deliberate, low-cost
  concession on a rarely-seen page in exchange for correct `lang` everywhere
  that matters.
- **Trade-off:** `opengraph-image.tsx` also can't live inside `[[...locale]]`
  (Next requires an optional catch-all to be the last path segment), so the
  OG/Twitter share image is a single shared image, not localized per page.

To add a third language: add its `Dictionary` entry to
`dictionaries` in `content.ts`, push its code into `locales`, and translate
every field — TypeScript will error on anything missing since both
dictionaries share the `Dictionary` type.

## The logo

`src/components/ui/Logo.tsx` renders the real mark, extracted from the
supplied artwork (a flattened JPEG mockup with no transparency). Two
derived assets live in `public/`, each as WebP with a PNG fallback via
`<picture>`:

- `logo-icon.(png|webp)` — just the mountain/circuit mark, background
  removed. Used small, paired with real "RULANTU" text (`variant="compact"`,
  the default) — nav, mobile menu.
- `logo-lockup.(png|webp)` — the full icon + wordmark together, as
  designed. Used large, where the wordmark's own metallic rendering reads
  clearly (`variant="full"`) — footer.
- `favicon.svg` — a separate, simplified asset: the icon's silhouette
  (traced with `potrace`, fine circuit-line detail dropped) in flat signal
  orange on the ink background. The full metallic icon has too much fine
  detail to read at 16–32px; a bold flat silhouette does.

There's a small soft artifact from AI background removal near the base of
the orange chevron (visible on close inspection, not on a normal page
view) — a cleaner source file (vector or a transparent-background export)
would let this be redone with a clean cut instead. To swap in a better
source later: redo the crop/background-removal pipeline (`rembg` with
`alpha_matting=True` got the cleanest result here) and replace the four
files in `public/`, keeping the same filenames.

## Before going live

- Swap in the real logo (see above).
- Point the `rulantu.com` DNS at whichever host you deploy to (below).

## Email — two separate systems, both free

**Outbound (contact form → Resend).** The form
(`src/components/sections/ContactForm.tsx`) POSTs to `/api/contact`,
handled by `worker.js` — the same one-file Worker that does the `www` →
apex redirect. That route validates the fields, then calls the Resend API
with `env.RESEND_API_KEY` (a Cloudflare secret — never in code, never
client-side) to send from `hello@rulantu.com` to `support@rulantu.com`,
with `reply_to` set to the visitor's address so replying goes straight to
them. This is the entire "backend": one stateless route, no database,
nothing persisted. Resend's free tier covers this comfortably. Domain
verification (DKIM, `send.rulantu.com` MX/SPF, `_dmarc`) lives as DNS
records in the Cloudflare zone.

**Inbound (`support@rulantu.com` → a real inbox).** Resend only sends —
receiving `support@rulantu.com` is handled separately by **Cloudflare
Email Routing** (free), which forwards it to `rulantu.support@gmail.com`.
This replaced the domain's previous Namecheap email forwarding, whose old
MX/SPF records were removed from the zone to avoid conflicting with
Cloudflare's own MX records. Managed entirely in the Cloudflare
dashboard/API (Email Routing → Routing rules) — not part of this repo.
To point it at a different inbox, or add another address, no code change
is needed — just a new routing rule.

Replying from a lead notification already goes straight to the visitor
(via `reply_to`, above). If you also want to compose *new* mail as
`support@rulantu.com` (not just reply to leads), the free path is Gmail's
"Send mail as" using Resend's SMTP credentials as the outgoing server —
ask if you want that set up.

### Secrets

| Secret | Where | Purpose |
|---|---|---|
| `RESEND_API_KEY` | Cloudflare Worker secret (`wrangler secret put RESEND_API_KEY`) | Sends the contact-form email via Resend. Never appears in the repo, the client bundle, or `wrangler.jsonc`. |

For local development, `wrangler dev` reads `RESEND_API_KEY` from
`.dev.vars` (gitignored — create it locally with
`RESEND_API_KEY=re_...` if you need to test the form against real
Resend sends).

## Deployment — Cloudflare Workers Static Assets (live, €0/month)

Live at **rulantu.com** (+ `www.rulantu.com` redirecting to it) and
`carloslens88/rulantu` on GitHub.

Cloudflare's Git-connected "Workers & Pages" import defaults Next.js
projects to building through OpenNext (`npx opennextjs-cloudflare build`),
an adapter for apps that need SSR — this repo doesn't (`output: "export"`,
zero server code), and that build fails since it expects things a static
export doesn't have. So this deploys a different way: `wrangler.jsonc`
serves `./out` directly as **Workers Static Assets**, with a one-file
Worker (`worker.js`) in front of it doing exactly one thing — 301
redirecting `www.rulantu.com` to the apex domain. No SSR, no OpenNext, no
app server; `worker.js` is a stateless edge redirect, not a backend.

To deploy:

```bash
npm run build          # -> ./out
npx wrangler deploy    # reads wrangler.jsonc, uploads ./out, wires up
                        # rulantu.com + www.rulantu.com as custom domains
```

`wrangler deploy` needs a Cloudflare account with **rulantu.com already
added as a Cloudflare zone** (nameservers pointed at Cloudflare's, e.g. via
Namecheap → Domain List → Manage → Nameservers → Custom DNS) — custom
domains and their TLS certs can't provision otherwise. First-time auth:
`npx wrangler login` (opens a browser, no token to manage).

Also needs `RESEND_API_KEY` set (`npx wrangler secret put RESEND_API_KEY`)
for the contact form — see below.

Any static host works the same way in spirit (Netlify, GitHub Pages,
Vercel's free tier) — build command `npm run build`, publish directory
`out` — just without the Worker (the `www` redirect and `/api/contact`
route are Cloudflare-specific; another host would need its own
equivalent for both).

## Infrastructure audit

| Item | Status |
|---|---|
| Monthly cost | **€0** |
| Supabase | **Not used** |
| Paid hosting | **Not used** — Cloudflare Workers Static Assets, free tier |
| Database | **Not used** — no data layer; the site is entirely static |
| Backend / API server | **One route** (`/api/contact` in `worker.js`) — stateless, no database, sends via Resend's free tier |
| CMS | **Not used** — content lives in `src/data/content.ts`, versioned in git |
| Paid APIs | **Not used** — Resend free tier |
| Analytics | **Not installed.** If added, use Cloudflare Web Analytics (free, no cookies, no config needed beyond enabling it in the dashboard). |
| Fonts | Self-hosted at build time via `next/font/google` — no runtime request to Google Fonts, no separate cost or privacy concern |

## Accessibility & motion

- Every scroll-driven and cursor-driven animation is gated behind a
  `prefers-reduced-motion` check (`src/lib/gsap.ts:prefersReducedMotion`)
  and a matching CSS block in `globals.css`. Reduced-motion visitors get
  full content with no scroll-scrubbing, no custom cursor, no parallax.
- The custom cursor and magnetic-button effects are additionally scoped
  to `(pointer: fine)` devices — touch visitors never load or see them.
- Focus states use a visible on-brand outline (`:focus-visible` in
  `globals.css`) rather than the browser default or `outline: none`.
- Color pairings were checked against WCAG AA (4.5:1 body text / 3:1
  large text). Note the CSS layering: Tailwind v4's utilities live in
  `@layer utilities`, so custom base styles in this project are
  deliberately placed in `@layer base` / `@layer components` — an
  unlayered rule would otherwise always beat a layered utility regardless
  of specificity. Keep new global CSS inside a layer for the same reason.
