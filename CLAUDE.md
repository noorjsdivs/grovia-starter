# CLAUDE.md

Ground rules for any AI assistant (and any developer) working in this repo. Claude Code loads this file at the start of every session. Read it before every task.

## Project at a glance

**Grovia** is a fresh-market e-commerce platform: a storefront, an admin dashboard and a REST API. This repo is the **starter**. Each app is at the end of its "Foundation" chapter in the Grovia from scratch course, and the course builds everything else on top.

| Piece | Stack | Port |
| :-- | :-- | :-- |
| Monorepo | Turborepo 2 + pnpm 11 workspaces (`apps/*`, `packages/*`) | — |
| `apps/api` | Express 5 · Mongoose 9 · TypeScript strict (NodeNext ESM) | 8000 |
| `apps/web` | Next.js 16 (App Router) · React 19 · Tailwind v4 · shadcn/ui | 3000 |
| `apps/admin` | Next.js 16 (App Router) · React 19 · Tailwind v4 · shadcn/ui | 3001 |

**Environment: one file, at the repo root.** `.env` is the single source of truth for every app. `apps/api` loads it through `config/env.ts`, and the Next.js apps load it in `next.config.ts`. Never add per-app `.env` files for development. The template is `_.env.example`.

## Hard rules

### TypeScript
- **No `any`.** Use `unknown` and narrow it, `Record<string, unknown>`, an explicit interface, or a generic. ESLint fails on `any`.
- Strict mode is on in every app. Don't silence strict-null errors with `!`. Narrow with a guard instead.
- **`apps/api` imports use `.js` extensions**, even from `.ts` source: `import x from "./foo.js"`.
- **`apps/web` and `apps/admin` import through `@/*`:** `import { cn } from "@/lib/utils"`.
- ESM throughout. No `require()`, no `__dirname`. Use `fileURLToPath(import.meta.url)`.

### Next.js
- `params` and `searchParams` are Promises: `const { id } = await params`.
- Default to Server Components. Add `"use client"` only for state, effects or event handlers.
- Never call `setState` inside an effect to react to a prop change. Adjust during render instead.
- Anything that uses `useSearchParams` sits inside a `<Suspense>` boundary.
- No `Math.random()` or `Date.now()` in a component body. It breaks hydration.
- `<html>` carries `data-scroll-behavior="smooth"` in both apps. Don't remove it: without it, Next 16's scroll-to-top animates and gets interrupted.

### Tailwind and styling
- **Semantic tokens only.** Never raw palette utilities (`text-red-500`, `bg-slate-700`), never inline hex (`bg-[#0b6a5b]`, `style={{ color: "#fff" }}`). If a colour is missing, add a token to the app's `src/app/globals.css` first.
- **Light theme only.** No `dark:` variants.
- **Merge classes with `cn()`** from `@/lib/utils`, never with template strings.
- **Canonical Tailwind v4 classes:** `size-10.5`, not `size-[42px]`; `max-w-135`, not `max-w-[540px]`. Use the radius tokens (`rounded-control`, `rounded-tile`, `rounded-card`). Arbitrary values are only for `clamp()`, `calc()`, `min()` and off-scale font sizes.
- **UI primitives are shadcn/ui**, in `src/components/ui/` with lowercase filenames (`button.tsx`, `dialog.tsx`), restyled onto this repo's tokens. When you add one with the shadcn CLI, swap its default palette classes for the tokens.
- **Clickable things show a pointer.** `globals.css` restores `cursor: pointer` once for buttons and interactive roles, so don't add `cursor-pointer` per component. Give every pressable control a visible `hover:` state.
- Product images are transparent cut-outs. Never `object-cover` them, and never show them on plain white.

### API (`apps/api`)
- Every async controller is wrapped in `asyncHandler` (added in a later chapter).
- Errors use `res.status(code); throw new Error("message");`. Never `return res.status(...).json({ error })`. The error middleware turns every failure into one envelope: `{ success: false, code, message, path, requestId, hint? }`.
- Unknown `/api/*` routes go through `notFoundHandler`, so the API never answers with HTML.
- Every response carries `X-Request-Id`. Don't strip it.
- Raw-body routes, such as a Stripe webhook, mount **before** `express.json()` in `server.ts`.
- Every write endpoint (`POST`, `PUT`, `PATCH`, `DELETE`) is protected by auth middleware once auth exists.

### Conventions
- Two-space indent, double quotes, trailing commas, semicolons. Match the file you're editing.
- File naming: the API uses `camelCase` (`userModel.ts`). The Next.js apps use `PascalCase` for their own components (`ProductCard.tsx`), lowercase route folders, and shadcn's lowercase names inside `components/ui/`.
- Don't add dependencies without a reason. pnpm 11 only runs install scripts listed under `allowBuilds` in `pnpm-workspace.yaml`.

## Workflow

1. **Plan before you scaffold.** For a change that touches three or more files, list the changes first.
2. **Match existing patterns.** Open the closest existing file before you write a new one.
3. **Verify before you call it done:**
   ```bash
   pnpm run type-check && pnpm run lint && pnpm run test && pnpm run build
   ```
   For UI changes, also look at the page: storefront on http://localhost:3000, dashboard on http://localhost:3001.
4. **Never commit `.env`** or any real key. `NEXT_PUBLIC_*` values reach the browser, so they must never hold a secret.
