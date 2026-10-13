/**
 * Browser-side error reporting for the dashboard. The Next error boundaries
 * call `reportClientError`, which posts the error to the API's client-error
 * intake so it shows on the API status page. Fire and forget, once per
 * message per page load. Client-safe: reads only the public API URL.
 */
import * as Sentry from "@sentry/nextjs";
const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:8000";
const APP = "admin";

const reported = new Set<string>();

export function reportClientError(error: unknown, extra: { digest?: string; source?: string } = {}): void {
  if (typeof window === "undefined") return;
  const err = error instanceof Error ? error : new Error(String(error));
  const message = `${extra.source ? `[${extra.source}] ` : ""}${err.message || "Unknown error"}`.slice(0, 500);
  const key = `${message}|${window.location.pathname}`;
  if (reported.has(key)) return;
  reported.add(key);

  Sentry.captureException(err, { tags: { source: extra.source ?? "boundary" }, extra: { digest: extra.digest ?? "" } });

  const body = JSON.stringify({
    app: APP,
    message,
    stack: (err.stack ?? "").slice(0, 4000),
    digest: extra.digest ?? (err as { digest?: string }).digest ?? "",
    url: window.location.href.slice(0, 500),
  });

  try {
    void fetch(`${API_URL}/api/system-metrics/client-errors`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
      credentials: "omit",
    }).catch(() => undefined);
  } catch {
    /* offline, blocked, or the page is unloading — nothing to do */
  }
}
