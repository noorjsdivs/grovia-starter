/**
 * Build a list URL, omitting empty values and defaults so the address bar
 * stays short (`/orders` not `/orders?page=1&perPage=20&sort=newest`).
 */
export function listHref(
  path: string,
  params: Record<string, string | number | undefined>,
  defaults: Record<string, string | number> = {},
): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === "") continue;
    if (key === "page" && Number(value) <= 1) continue;
    if (defaults[key] !== undefined && String(value) === String(defaults[key])) {
      continue;
    }
    search.set(key, String(value));
  }
  const query = search.toString();
  return query ? `${path}?${query}` : path;
}