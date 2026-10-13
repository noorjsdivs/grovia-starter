import Link from "next/link";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * shadcn/ui Button, styled with Grovia's semantic tokens.
 *
 * The variant and size names are the ones the storefront already used, so this
 * is a drop-in replacement for the hand-rolled button: `primary` is the green
 * pill, `secondary` the deep-teal one. `asChild` composes with any element,
 * which is what lets a form render a link that looks like a button.
 */
const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-control font-bold leading-none whitespace-nowrap transition-colors duration-300 ease-in-out outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-primary text-card shadow-brand hover:bg-primary-hover",
        secondary: "bg-brand text-card hover:bg-brand-deep",
        ghost: "text-foreground hover:bg-muted",
        outline:
          "border border-border text-foreground hover:border-primary hover:text-primary",
        soft: "bg-primary/8 text-primary hover:bg-primary/16",
        danger: "bg-accent-crimson text-card hover:opacity-90",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 px-4 text-[13px]",
        md: "h-11 px-6 text-sm",
        lg: "h-13 px-7 text-[15px]",
        icon: "size-11 rounded-full p-0",
      },
      full: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      full: false,
    },
  },
);

type ButtonVariants = VariantProps<typeof buttonVariants>;

export function Button({
  className,
  variant,
  size,
  full,
  asChild = false,
  ...props
}: ComponentProps<"button"> & ButtonVariants & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, full, className }))}
      {...props}
    />
  );
}

/** A next/link styled as a button. Kept for the many call sites that use it. */
export function ButtonLink({
  className,
  variant,
  size,
  full,
  ...props
}: ComponentProps<typeof Link> & ButtonVariants) {
  return (
    <Link
      data-slot="button"
      className={cn(buttonVariants({ variant, size, full, className }))}
      {...props}
    />
  );
}

export { buttonVariants };
