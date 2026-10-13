import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * shadcn/ui Badge on Grovia tokens. Variants are named after the dashboard's
 * status tones so `statusTone()` maps straight onto them; `tone` is accepted as
 * an alias of `variant` for the many existing call sites.
 */
const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-md border border-transparent px-2.5 py-1 text-[11.5px] font-bold whitespace-nowrap",
  {
    variants: {
      variant: {
        neutral: "bg-muted text-muted-foreground",
        primary: "bg-primary/10 text-primary",
        orange: "bg-accent-orange/10 text-accent-orange",
        crimson: "bg-accent-crimson/10 text-accent-crimson",
        blue: "bg-accent-blue/10 text-accent-blue",
        amber: "bg-accent-amber/15 text-accent-amber",
        brand: "bg-brand/10 text-brand",
        outline: "border-border bg-card text-foreground",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
);

export type BadgeTone = NonNullable<VariantProps<typeof badgeVariants>["variant"]>;

export function Badge({
  className,
  variant,
  tone,
  ...props
}: ComponentProps<"span"> & VariantProps<typeof badgeVariants> & { tone?: BadgeTone }) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant: variant ?? tone }), className)}
      {...props}
    />
  );
}

export { badgeVariants };
