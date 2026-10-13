import { randomUUID } from "node:crypto";
import type { NextFunction, Request, Response } from "express";

/**
 * One id per request, echoed as `X-Request-Id` and carried into the error
 * envelope and the API log, so a customer's "it said error abc-123" can be
 * matched to the row that recorded it. A caller may supply its own id
 * (letters, digits, dashes, up to 64 chars); anything else is replaced.
 */
const SAFE_ID = /^[A-Za-z0-9-]{8,64}$/;

export function requestId(req: Request, res: Response, next: NextFunction): void {
  const supplied = req.get("X-Request-Id") ?? "";
  const id = SAFE_ID.test(supplied) ? supplied : randomUUID();
  res.locals.requestId = id;
  res.setHeader("X-Request-Id", id);
  next();
}

/** The id the middleware stamped, for loggers and the error envelope. */
export function requestIdOf(res: Response): string {
  return typeof res.locals.requestId === "string" ? res.locals.requestId : "";
}
