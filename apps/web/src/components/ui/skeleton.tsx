import { cn } from "@/lib/utils";

/**
 * shadcn/ui Skeleton — the one grey pulse every placeholder is built from.
 *
 * Compose it in `src/components/skeletons/` (one file per screen) and mount
 * those from route `loading.tsx` files and Suspense fallbacks. Never invent a
 * one-off grey box inside a page.
 */
export function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn("animate-pulse rounded-control bg-muted", className)}
      {...props}
    />
  );
}
