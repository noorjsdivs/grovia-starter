import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-md border px-2.5 py-0.5 text-[12px] font-medium whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary/10 text-primary",
        secondary: "border-transparent bg-brand/10 text-brand",
        outline: "border-border text-foreground",
        destructive: "border-transparent bg-accent-crimson text-card",
        sale: "border-transparent bg-lime text-brand",
        /* Status tones — `Primitives.Badge` call sites pass these as `tone`. */
        primary: "border-transparent bg-primary/10 text-primary",
        lime: "border-transparent bg-lime text-brand",
        orange: "border-transparent bg-lime/30 text-brand",
        crimson: "border-transparent bg-primary/10 text-primary",
        blue: "border-transparent bg-primary-soft text-brand",
        amber: "border-transparent bg-lime/25 text-brand",
        brand: "border-transparent bg-brand/10 text-brand",
        neutral: "border-transparent bg-muted text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
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
