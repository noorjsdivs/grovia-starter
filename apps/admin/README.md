# apps/admin: the Grovia dashboard

A second Next.js 16 app on the same design tokens as the storefront, plus a KPI palette for dashboard tiles. **This is the state at the end of chapter 4.01, Foundation.**

```bash
pnpm run dev:admin      # from the repo root: http://localhost:3001
pnpm --filter admin run test
```

## What's here

| Path | Job |
| :-- | :-- |
| `src/app/globals.css` | The storefront's token set plus the dashboard's KPI colours |
| `src/app/layout.tsx` | The document shell. Metadata sets `robots: noindex`, because the dashboard is private |
| `src/app/(dashboard)/page.tsx` | A temporary landing page. Chapter 4.03 wraps it in the sidebar shell, and 4.05 makes it the live overview |
| `src/components/ui/` | shadcn/ui primitives, plus dashboard wrappers: `Drawer` (over Sheet), `ConfirmDialog` (over AlertDialog), `DatePicker`, `FormSelect`, `TableFilters`, `PriceTag`, `Rating`, `Primitives` (`PageHeader`, `Card`…) |
| `src/lib/utils.ts` | `cn()`, `money()`, `price()`, `discountPercent()` and `slugify()` |
| `src/lib/pagination.ts`, `list-query.ts` | Page sizes, the list fetch cap, the "Showing x–y of z" label, and list URLs that leave out default values (tested) |
| `src/lib/recover.ts` | Tells a stale-chunk error, which needs a reload, from an ordinary one, which needs a re-render (tested) |
| `src/lib/observability.ts` | Reports a browser error once per page load, to Sentry (when a DSN is set) and to the API's client-error intake, which arrives in chapter 2.15 |

## Rules for this app

- Same tokens and rules as the storefront: semantic classes only, `cn()`, `@/` imports, no `dark:`.
- Use the wrappers: drawers are `Drawer`, confirmations are `ConfirmDialog`, toggles are `Switch`, icon-only buttons get a `Tooltip`.

## Next in the course

4.02 Sessions, two portals and first-run setup → 4.03 the shell → 4.04 the CRUD registry → 4.05 the overview → 4.06 products and stock → 4.07 orders and returns → 4.08 staff jobs and the cash desk → 4.09 people, sellers and purchasing → 4.10 promotions and Configuration → 4.11 reports and system health → 4.12 the seller portal → 4.13 finishing touches.
