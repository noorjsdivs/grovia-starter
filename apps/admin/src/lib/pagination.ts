/** Default page length for every admin list. */
export const PAGE_SIZE = 20;

export const PER_PAGE_OPTIONS = [10, 20, 50, 100] as const;

/**
 * How many rows to pull when a screen paginates in the browser (stock,
 * inventory, resource tables). Dedicated screens like products and orders
 * still fetch `PAGE_SIZE` from the API per request.
 */
export const LIST_FETCH_CAP = 500;

export function parsePerPage(value: string | undefined): number {
  const parsed = Number(value);
  return (PER_PAGE_OPTIONS as readonly number[]).includes(parsed)
    ? parsed
    : PAGE_SIZE;
}

export function showingLabel(
  page: number,
  perPage: number,
  total: number,
): string {
  if (total === 0) return "No rows";
  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);
  return `Showing ${from}–${to} of ${total}`;
}
