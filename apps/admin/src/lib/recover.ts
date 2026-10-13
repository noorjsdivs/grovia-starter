/**
 * Errors a re-render cannot fix: the browser failed to load or instantiate a
 * JavaScript chunk (a deploy replaced it, the dev server rebuilt its module
 * graph, a flaky network). `reset()` would re-run the same broken module —
 * only a full reload fetches fresh code.
 */
export function isChunkError(error: Error): boolean {
  return (
    error.name === "ChunkLoadError" ||
    /loading (css )?chunk|module factory is not available|failed to fetch dynamically imported module|importing a module script failed/i.test(
      error.message,
    )
  );
}

/** Retry an error boundary: re-render when that can work, otherwise reload the page. */
export function retry(error: Error, reset: () => void): void {
  if (isChunkError(error)) window.location.reload();
  else reset();
}
