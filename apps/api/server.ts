import "./config/env.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import { errorHandler, notFoundHandler } from "./middleware/errorMiddleware.js";
import { readinessGate, requestTimeout } from "./middleware/readinessMiddleware.js";
import { requestId } from "./middleware/requestIdMiddleware.js";

// Connect to the database — tests connect to their own.
if (process.env.NODE_ENV !== "test") {
  void connectDB();
}

const app = express();

// Behind a proxy (Vercel, Nginx, a load balancer), read the real client IP.
app.set("trust proxy", 1);

// Security headers
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// Compression
app.use(compression());

// CORS — the storefront and the dashboard, with cookies
const allowedOrigins = [process.env.CLIENT_URL, process.env.ADMIN_URL].filter(Boolean) as string[];

app.use(
  cors({
    origin(origin, callback) {
      // Server-to-server calls and curl send no Origin header.
      if (!origin) return callback(null, true);
      // In development, allow every origin for easier testing.
      if (process.env.NODE_ENV === "development") return callback(null, true);
      callback(null, allowedOrigins.includes(origin));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Anything that needs the raw body — the Stripe webhook — mounts above this line.
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ limit: "2mb", extended: true }));

/* One id per request — echoed as X-Request-Id and in the error envelope. */
app.use(requestId);

/* Fail fast while MongoDB is down, and never leave a request hanging. */
app.use("/api", readinessGate);
app.use(requestTimeout());

/** Machine-readable health: is this process up, and can it reach the database? */
app.get("/api/health", (_req: express.Request, res: express.Response) => {
  const db = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  res.status(db === "connected" ? 200 : 503).json({
    ok: db === "connected",
    status: db === "connected" ? "healthy" : "degraded",
    db,
    uptime: Math.round(process.uptime()),
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

/* Unknown API routes answer JSON, never Express's HTML "Cannot GET". */
app.use("/api", notFoundHandler);

// Error handler — always last
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 8000;
if (process.env.VERCEL !== "1" && process.env.NODE_ENV !== "test") {
  const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
  /* Keep-alive slightly above typical load-balancer idle timeouts. */
  server.keepAliveTimeout = 65_000;
  server.headersTimeout = 66_000;

  /* A rejected promise nobody awaited must not take the whole API down. */
  process.on("unhandledRejection", (reason) => {
    console.error("[api] unhandled rejection:", reason instanceof Error ? reason.stack ?? reason.message : reason);
  });
  process.on("uncaughtException", (error) => {
    console.error("[api] uncaught exception — shutting down:", error.stack ?? error.message);
    shutdown("uncaughtException", 1);
  });

  let closing = false;
  function shutdown(signal: string, exitCode = 0) {
    if (closing) return;
    closing = true;
    console.log(`[api] ${signal} received — closing connections`);
    const force = setTimeout(() => process.exit(exitCode), 10_000);
    force.unref();
    server.close(() => {
      mongoose
        .disconnect()
        .catch(() => undefined)
        .finally(() => process.exit(exitCode));
    });
  }
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

export default app;
