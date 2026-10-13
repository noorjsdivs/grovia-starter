# apps/api: the Grovia REST API

Express 5 on strict TypeScript and native ES modules (NodeNext), with MongoDB through Mongoose 9. **This is the state at the end of chapter 2.01, Foundation.**

```bash
pnpm run dev:api        # from the repo root: nodemon + tsx on http://localhost:8000
pnpm --filter api run build && pnpm --filter api run start
```

## What's here

| File | Job |
| :-- | :-- |
| `server.ts` | helmet, compression and CORS (the storefront and the dashboard, with cookies), JSON body limits, `/api/health`, JSON 404s, the error handler, keep-alive tuning, graceful shutdown on `SIGTERM` and `SIGINT` |
| `config/env.ts` | Walks up to the repo root, loads the one `.env`, and refuses to start without `MONGO_URI` and `JWT_SECRET` |
| `config/db.ts` | Connects to MongoDB and keeps retrying with backoff (5 s up to 30 s), so the API stays up through an outage |
| `middleware/requestIdMiddleware.ts` | Gives every request an id, echoed as `X-Request-Id` and in error bodies |
| `middleware/readinessMiddleware.ts` | Answers `/api/*` with a JSON 503 while the database is down, and times out hung requests |
| `middleware/errorMiddleware.ts` | One envelope for every failure: `{ success: false, code, message, path, requestId, hint? }` |
| `data/grovia/` | The asset pack's seed data. Nothing reads it yet; the seed script arrives in chapter 2.11 |

## Endpoints

| Method | Path | Answer |
| :-- | :-- | :-- |
| `GET` | `/api/health` | `200 { ok: true, status: "healthy", db: "connected", … }`, or `503` with `db: "disconnected"` |
| any | `/api/<anything else>` | `404 { success: false, code: "not_found", … }` |

## Rules for this app

- Imports end in `.js`, even from `.ts` files: `import connectDB from "./config/db.js"`.
- No `any`. ESLint fails the build on it.
- Throw errors, never hand-roll a response: `res.status(404); throw new Error("Product not found");`.
- Anything that needs the raw request body (the Stripe webhook) mounts **above** `express.json()` in `server.ts`.

## Next in the course

2.02 One vocabulary → 2.03 to 2.06 the data models → 2.07 settings, caching and uploads → 2.08 email and background jobs → 2.09 signing in → 2.10 users → 2.11 the catalogue and the seed → 2.12 cart and order rules → 2.13 orders, payments and refunds → 2.14 staff jobs and sellers → 2.15 dashboard data → 2.16 and 2.17 content → 2.18 wiring it together.
