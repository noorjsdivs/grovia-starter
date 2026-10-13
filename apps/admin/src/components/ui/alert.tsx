import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * shadcn/ui Alert.
 *
 * Used for form-level feedback — a rejected sign-in, a sent reset code, a
 * permissions refusal. Every variant maps to a status token, so none of them
 * reaches for a raw palette colour.
 */
const alertVariants = cva(
  "relative flex w-full items-start gap-3 rounded-control px-3.5 py-3 text-[13px] leading-relaxed [&>svg]:size-4.5 [&>svg]:shrink-0 [&>svg]:translate-y-0.5",
  {
    variants: {
      variant: {
        info: "bg-primary/8 text-primary",
        success: "bg-success/10 text-success",
        warning: "bg-warning/12 text-accent-amber",
        danger: "bg-danger/8 text-danger",
      },
    },
    defaultVariants: { variant: "info" },
  },
);

export function Alert({
  className,
  variant,
  ...props
}: ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

export function AlertTitle({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      data-slot="alert-title"
      className={cn("font-bold", className)}
      {...props}
    />
  );
}

export function AlertDescription({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn("flex flex-col gap-1", className)}
      {...props}
    />
  );
}

export { alertVariants };
