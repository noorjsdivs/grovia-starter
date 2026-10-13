import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

const OPEN_PATHS = ["/api/health", "/api/docs", "/api/docs.json", "/api/docs/info"];

/** How long a request waits for a connection that is still being opened (a cold start). */
const CONNECTING_WAIT_MS = 8_000;

function waitForConnection(ms: number): Promise<boolean> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(false), ms);
    timer.unref();
    mongoose.connection
      .asPromise()
      .then(() => resolve(true), () => resolve(false))
      .finally(() => clearTimeout(timer));
  });
}

function unavailable(req: Request, res: Response) {
  res.status(503).json({
    success: false,
    code: "db_unavailable",
    message: "The database is not connected yet. Try again in a moment.",
    path: req.originalUrl,
    retryAfterSeconds: 5,
  });
}

/**
 * Fails fast while the database is down instead of letting every request hang
 * on Mongoose's buffer timeout. Health and docs stay reachable so operators can
 * see what is wrong. A connection still being opened — the first request after
 * a serverless cold start — is waited for briefly rather than refused.
 *
 * Mounted at `/api`, so `req.path` has the prefix stripped; match on
 * `originalUrl` against the full paths.
 */
export function readinessGate(req: Request, res: Response, next: NextFunction) {
  const { readyState } = mongoose.connection;
  if (readyState === 1) return next();
  const path = req.originalUrl.split("?")[0] ?? "";
  if (OPEN_PATHS.some((p) => path === p || path.startsWith(`${p}/`))) return next();
  if (readyState === 2) {
    void waitForConnection(CONNECTING_WAIT_MS).then((ok) => (ok ? next() : unavailable(req, res)));
    return;
  }
  unavailable(req, res);
}

const DEFAULT_TIMEOUT_MS = 60_000;

/** Ends a request that outlives the timeout with a JSON 503 instead of a hung socket. */
export function requestTimeout(ms = DEFAULT_TIMEOUT_MS) {
  return (req: Request, res: Response, next: NextFunction) => {
    res.setTimeout(ms, () => {
      if (res.headersSent) return;
      res.status(503).json({
        success: false,
        code: "timeout",
        message: `The request took longer than ${Math.round(ms / 1000)} s and was stopped.`,
        path: req.originalUrl,
      });
    });
    next();
  };
}
