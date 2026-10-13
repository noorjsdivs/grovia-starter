import { StarIcon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/**
 * The dashboard's only rating renderers. Ratings are derived from approved
 * customer reviews, so zero reads "No reviews yet" rather than 0.0.
 *
 *   <Stars value={4} />                   five stars, amber filled
 *   <Rating value={4.2} count={12} />     ★★★★☆ 4.2 (12) — tables, facts, summaries
 */
const FILLED = "text-accent-amber";
const EMPTY = "text-border";

export function Stars({ value, size = 13, className }: { value: number; size?: number; className?: string }) {
  const filled = Math.round(Math.min(5, Math.max(0, value)));
  return (
    <span className={cn("inline-flex gap-0.5", className)} role="img" aria-label={`${value.toFixed(1)} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <StarIcon key={n} size={size} className={n <= filled ? FILLED : EMPTY} />
      ))}
    </span>
  );
}

export function Rating({
  value,
  count,
  size = 13,
  className,
}: {
  value: number;
  /** Approved review count; zero shows "No reviews yet". */
  count?: number;
  size?: number;
  className?: string;
}) {
  const none = count === 0 || (count === undefined && value <= 0);
  if (none) {
    return (
      <span className={cn("inline-flex items-center gap-1.5 text-[12.5px] text-subtle-foreground", className)}>
        <Stars value={0} size={size} />
        No reviews yet
      </span>
    );
  }
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[12.5px] text-muted-foreground", className)}>
      <Stars value={value} size={size} />
      <span className="font-semibold text-foreground tabular-nums">{value.toFixed(1)}</span>
      {count !== undefined && <span className="tabular-nums">({count})</span>}
    </span>
  );
}
