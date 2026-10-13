import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

/**
 * Vitest with jsdom and Testing Library: pure modules and client components
 * alike, every `*.test.ts` / `*.test.tsx` under src, next to what it covers. Server modules
 * (anything reaching `next/headers` or a server action) are mocked in the
 * test with `vi.mock`, never rendered.
 */
export default defineConfig({
  resolve: {
    alias: { "@": path.resolve(path.dirname(fileURLToPath(import.meta.url)), "src") },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    css: false,
    clearMocks: true,
  },
});
