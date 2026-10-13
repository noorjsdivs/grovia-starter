# apps/web: the Grovia storefront

Next.js 16 (App Router, Turbopack) with React 19, Tailwind CSS v4 and shadcn/ui on Grovia's own design tokens. **This is the state at the end of chapter 3.01, Foundation.**

```bash
pnpm run dev:web        # from the repo root: http://localhost:3000
pnpm --filter web run test
```

## What's here

| Path | Job |
| :-- | :-- |
| `src/app/globals.css` | The whole design in one file: colours, semantic tokens, radii, shadows, motion, and base-layer typography. Every utility in the app resolves to a token here |
| `src/app/layout.tsx` | The document shell: Public Sans through `next/font`, TikTok Sans from Google Fonts, metadata, `data-scroll-behavior="smooth"` |
| `src/app/(storefront)/page.tsx` | A temporary page that proves the fonts, tokens and primitives render. Chapter 3.08 replaces it with the real home page |
| `src/components/ui/` | shadcn/ui primitives (button, dialog, sheet, select, tabs, slider, calendar…) restyled onto the tokens, plus `Icon.tsx` and `SmartImage.tsx` |
| `src/components/Logo.tsx` | The Grovia mark and wordmark |
| `src/components/site/SiteSettingsProvider.tsx` | Runtime site settings for client components, starting with one switch: whether remote images go through `next/image` (`SmartImage` reads it) |
| `src/lib/utils.ts` | `cn()`, `discountPercent()` and `slugify()`, with tests |
| `public/images/` | The asset pack: product cut-outs, plus journal, editorial, home-promo, people and shop photos |
| `next.config.ts` | Loads the root `.env`, security headers, image hosts, and an optional Sentry wrapper (silent without a DSN) |

## Rules for this app

- Semantic tokens only: `bg-primary`, `text-muted-foreground`, `rounded-tile`. No raw palette classes, no hex, no `dark:`.
- Merge classes with `cn()`.
- Import through `@/`.
- Product photos are transparent cut-outs. Never `object-cover` them.

## Next in the course

3.02 The data layer → 3.03 sessions and server actions → 3.04 client state → 3.05 product building blocks → 3.06 the Header → 3.07 signing in → 3.08 the home page → 3.09 shop and product pages → 3.10 basket, checkout and tracking → 3.11 the account area → 3.12 journal, sellers and finishing touches.
