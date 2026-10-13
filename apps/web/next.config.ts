import path from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";
import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs/config";

/**
 * The monorepo keeps one .env, at the root.
 *
 * Next only reads .env files from the app directory, so it is loaded here
 * before the config object is built. That covers the dev server, the build
 * (where NEXT_PUBLIC_* values are inlined) and `next start`.
 */
/* Not on Vercel: there the project's own environment and this app's
   .env.production (which Next loads itself) are the whole truth, and the
   root .env's development values must not fill a gap. */
if (!process.env.VERCEL) {
  loadEnv({
    path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../.env"),
    quiet: true,
  });
}

/**
 * A production build must know where the API and the sibling apps live —
 * NEXT_PUBLIC_* values are inlined at build time, and every fallback in the
 * code is a localhost URL (the tracked root .env points at localhost too). A
 * missing variable would otherwise ship a site that quietly talks to nothing.
 */
if (process.env.VERCEL_ENV === "production") {
  const missing = ["NEXT_PUBLIC_API_URL", "NEXT_PUBLIC_WEB_URL", "NEXT_PUBLIC_ADMIN_URL"].filter((name) => {
    const value = process.env[name];
    return !value || /^https?:\/\/(localhost|127\.0\.0\.1)(:|\/|$)/.test(value);
  });
  if (missing.length) {
    throw new Error(`Set ${missing.join(", ")} to the production URL(s) before building.`);
  }
}

/** Sent on every response. No CSP yet: Stripe, Sentry and ImageKit need a tested policy. */
const SECURITY_HEADERS = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async headers() {
    return [{ source: "/(.*)", headers: SECURITY_HEADERS }];
  },
  async redirects() {
    return [
      /* The journal moved from /blog to /journal; old links and search results keep working. */
      { source: "/blog", destination: "/journal", permanent: true },
      { source: "/blog/:slug*", destination: "/journal/:slug*", permanent: true },
      {
        source: "/product/kent-strawberries-sweet-tart-picked",
        destination: "/product/kent-strawberries",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "ik.imagekit.io" },
      /* Google profile photos, for accounts that signed in with Google. */
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
};

/**
 * Sentry's build step uploads source maps when SENTRY_AUTH_TOKEN is set (CI,
 * Vercel) and stays silent otherwise, so a local build needs no token.
 */
export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT_WEB,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  telemetry: false,
  widenClientFileUpload: true,
  sourcemaps: { disable: !process.env.SENTRY_AUTH_TOKEN, deleteSourcemapsAfterUpload: true },
});
