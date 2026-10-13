/**
 * Loads the monorepo's single .env file.
 *
 * There is exactly one environment file, at the repo root. This module walks up
 * from apps/api until it finds it, so the API behaves the same whether it is
 * started by turbo from the root, by pnpm from apps/api, or by a script.
 *
 * Import this before anything that reads `process.env` — server.ts does so on
 * its first line.
 */
import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

function findRootEnv(): string | null {
  let dir = path.dirname(fileURLToPath(import.meta.url));

  /* apps/api/config → apps/api → apps → <root>. Six levels is ample; the loop
     stops at the filesystem root regardless. */
  for (let depth = 0; depth < 6; depth += 1) {
    const candidate = path.join(dir, ".env");
    const isRoot = fs.existsSync(path.join(dir, "pnpm-workspace.yaml"));
    if (isRoot && fs.existsSync(candidate)) return candidate;

    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

const envPath = findRootEnv();

if (envPath) {
  dotenv.config({ path: envPath, quiet: true });
} else {
  /* Hosted runtimes (Vercel, Render, Railway) inject variables directly and
     ship no .env — that is expected, not an error. */
  dotenv.config({ quiet: true });
}

/** Variables the API cannot start without. */
const REQUIRED = ["MONGO_URI", "JWT_SECRET"] as const;

const missing = REQUIRED.filter((key) => !process.env[key]);

if (missing.length > 0 && process.env.NODE_ENV !== "test") {
  throw new Error(
    `Missing required environment variables: ${missing.join(", ")}. ` +
      `Copy _.env.example to .env at the repo root and fill them in.`,
  );
}

/**
 * Typed accessors for the values where a wrong value is a security problem
 * rather than a broken feature. Everything else still reads `process.env`.
 */
export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV === "development",

  jwtSecret: process.env.JWT_SECRET ?? "",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "30d",

  clientUrl: process.env.CLIENT_URL ?? "http://localhost:3000",
  adminUrl: process.env.ADMIN_URL ?? "http://localhost:3001",
} as const;

export default env;
