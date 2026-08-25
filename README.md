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

No logo asset was supplied for this build. The site currently uses a
typographic wordmark (`src/components/ui/Logo.tsx`) as the primary mark.
To swap in the real RULANTU logo: drop the file into `public/`, then
replace the `<span>` in `Logo.tsx` with an `<Image>`/`<img>` pointing at
it. `Logo` is used in three places (nav, footer, favicon is separate) so
this is a single-file change.

## Before going live

- **`src/data/content.ts` → `brand.contactEmail`** is a placeholder
  (`hello@rulantu.com`). Replace it with the real inbox before launch —
  it's used as the `mailto:` fallback for the contact form and in the
  footer.
- Swap in the real logo (see above).
- Point the `rulantu.com` DNS at whichever host you deploy to (below).

## Contact form — zero backend

The contact form (`src/components/sections/ContactForm.tsx`) needs no
server:

- **Default (no configuration):** submitting the form opens the visitor's
  email client with a pre-filled `mailto:` to `brand.contactEmail`. Works
  everywhere, costs nothing, needs no setup.
- **Optional upgrade — Formspree free tier:** set the environment variable
  `NEXT_PUBLIC_FORMSPREE_ID` at build time (see below) and submissions
  POST directly to Formspree from the browser instead — a real inbox, no
  server of ours involved, still €0/month on Formspree's free tier
  (50 submissions/month at time of writing — check their current limits
  before relying on it for volume).

### Environment variables

| Variable | Required | Purpose | Cost |
|---|---|---|---|
| `NEXT_PUBLIC_FORMSPREE_ID` | No | Formspree form ID. If unset, the contact form falls back to a `mailto:` link — no functionality is lost. | Free tier |

No other environment variables or secrets are used anywhere in this
project. `NEXT_PUBLIC_*` variables are inlined into the static bundle at
build time by Next.js — they are not sensitive.

## Deployment — Cloudflare Pages (recommended, €0/month)

1. Push this repo to GitHub/GitLab.
2. In the Cloudflare dashboard: **Workers & Pages → Create → Pages →
   Connect to Git**, select this repo.
3. Build settings:
   - Framework preset: **Next.js (Static HTML Export)**
   - Build command: `npm run build`
   - Build output directory: `out`
4. (Optional) add `NEXT_PUBLIC_FORMSPREE_ID` under **Settings →
   Environment variables** if you're using the Formspree upgrade.
5. **Custom domains → Add** `rulantu.com` and follow the DNS instructions
   (Cloudflare Pages issues and renews the TLS certificate for free).

Any other static host works the same way (Netlify, GitHub Pages, Vercel's
free tier) — build command `npm run build`, publish directory `out`.

## Infrastructure audit

| Item | Status |
|---|---|
| Monthly cost | **€0** |
| Supabase | **Not used** |
| Paid hosting | **Not used** — static export on Cloudflare Pages free tier |
| Database | **Not used** — no data layer; the site is entirely static |
| Backend / API server | **Not used** |
| CMS | **Not used** — content lives in `src/data/content.ts`, versioned in git |
| Paid APIs | **Not used** — Formspree is optional and free-tier |
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
