import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind class names with conflict resolution. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Format a number as a two-decimal money string (no currency symbol). */
export function money(value: number): string {
  return value.toFixed(2);
}

/** Format a number as a display price with the store's default currency. */
export function price(value: number): string {
  return `$${money(value)}`;
}

/** Percentage saved between a former and current price. Returns 0 when not on sale. */
export function discountPercent(current: number, was: number): number {
  if (!was || was <= current) return 0;
  return Math.round(((was - current) / was) * 100);
}

/** URL-safe slug from an arbitrary label. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
