import { Badge } from "@/components/ui/Primitives";
import { cn, discountPercent, price } from "@/lib/utils";

const SIZES = {
  /** Table cells and grid tiles. */
  sm: { now: "font-display text-[14px] font-bold text-brand", was: "text-[12px]" },
  /** Cards and drawers. */
  md: { now: "font-display text-[17px] font-bold text-brand", was: "text-[13.5px]" },
  /** The product editor's headline. */
  lg: { now: "font-display text-[28px] font-bold text-brand", was: "text-[15px]" },
} as const;

/**
 * A product price with its compare-at price and saving, the same everywhere
 * in the dashboard: the current amount, the crossed-out former price when the
 * line is on sale, and optionally the percentage as a badge.
 */
export function PriceTag({
  amount,
  compareAt = 0,
  size = "sm",
  discount = "none",
  className,
}: {
  amount: number;
  /** Former price; `0` or below `amount` means not on sale. */
  compareAt?: number;
  size?: keyof typeof SIZES;
  discount?: "none" | "badge";
  className?: string;
}) {
  const onSale = compareAt > amount;
  const off = onSale ? discountPercent(amount, compareAt) : 0;
  const styles = SIZES[size];
  return (
    <span className={cn("inline-flex flex-wrap items-baseline gap-x-2.5 gap-y-1", className)}>
      <span className={cn(styles.now, "tabular-nums")}>{price(amount)}</span>
      {onSale && <span className={cn("text-subtle-foreground line-through tabular-nums", styles.was)}>{price(compareAt)}</span>}
      {onSale && discount === "badge" && off > 0 && <Badge tone="crimson">−{off}%</Badge>}
    </span>
  );
}
