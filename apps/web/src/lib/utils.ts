import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind class names with conflict resolution. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
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
