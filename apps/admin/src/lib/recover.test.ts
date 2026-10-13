/** Runs on Vitest: which boundary errors need a reload rather than a re-render. */
import { describe, expect, it, vi } from "vitest";
import { isChunkError, retry } from "./recover";

describe("isChunkError", () => {
  it("spots chunk and module-loading failures", () => {
    const chunk = new Error("Loading chunk 42 failed.");
    chunk.name = "ChunkLoadError";
    expect(isChunkError(chunk)).toBe(true);
    expect(isChunkError(new Error("Module [project]/x.js was instantiated … but the module factory is not available."))).toBe(true);
    expect(isChunkError(new Error("Failed to fetch dynamically imported module: /_next/a.js"))).toBe(true);
  });

  it("leaves ordinary errors to a re-render", () => {
    expect(isChunkError(new Error("Cannot read properties of undefined (reading 'map')"))).toBe(false);
  });
});

describe("retry", () => {
  it("re-renders an ordinary error", () => {
    const reset = vi.fn();
    retry(new Error("boom"), reset);
    expect(reset).toHaveBeenCalledOnce();
  });
});
