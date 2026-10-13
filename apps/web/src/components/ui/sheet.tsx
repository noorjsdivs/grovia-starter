"use client";

import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/**
 * shadcn/ui Sheet — slide-over panel on top of a dimmed overlay.
 *
 * Used for the storefront mobile nav. Styled with Grovia tokens and the
 * project's own enter/exit animations (no dark: variants, no raw palette).
 */
export const Sheet = SheetPrimitive.Root;
export const SheetTrigger = SheetPrimitive.Trigger;
export const SheetClose = SheetPrimitive.Close;
export const SheetPortal = SheetPrimitive.Portal;

export function SheetOverlay({
  className,
  ...props
}: ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 z-90 bg-foreground/45",
        "data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out",
        className,
      )}
      {...props}
    />
  );
}

const sheetVariants = cva(
  [
    "fixed z-90 flex flex-col gap-0 overflow-hidden bg-card shadow-pop outline-none",
    "data-[state=open]:duration-300 data-[state=closed]:duration-240",
  ].join(" "),
  {
    variants: {
      side: {
        left: [
          "inset-y-0 left-0 h-full w-[min(100%,22rem)] border-r border-border",
          "data-[state=open]:animate-slide-in-left",
          "data-[state=closed]:animate-slide-out-left",
        ].join(" "),
        right: [
          "inset-y-0 right-0 h-full w-[min(100%,22rem)] border-l border-border",
          "data-[state=open]:animate-slide-in",
          "data-[state=closed]:animate-slide-out",
        ].join(" "),
        top: [
          "inset-x-0 top-0 border-b border-border",
          "data-[state=open]:animate-drop",
        ].join(" "),
        bottom: [
          "inset-x-0 bottom-0 border-t border-border",
          "data-[state=open]:animate-rise",
        ].join(" "),
      },
    },
    defaultVariants: { side: "left" },
  },
);

export function SheetContent({
  side = "left",
  className,
  children,
  showClose = true,
  ...props
}: ComponentProps<typeof SheetPrimitive.Content> &
  VariantProps<typeof sheetVariants> & {
    showClose?: boolean;
  }) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(sheetVariants({ side }), className)}
        {...props}
      >
        {children}
        {showClose && (
          <SheetPrimitive.Close
            data-slot="sheet-close"
            className="absolute top-3.5 right-3.5 grid size-9 cursor-pointer place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close menu"
          >
            <Icon name="close" size={18} />
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Content>
    </SheetPortal>
  );
}

export function SheetHeader({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn(
        "flex flex-col gap-1 border-b border-border px-5 py-4 pr-14",
        className,
      )}
      {...props}
    />
  );
}

export function SheetFooter({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn(
        "mt-auto flex flex-col gap-2 border-t border-border p-4",
        className,
      )}
      {...props}
    />
  );
}

export function SheetTitle({
  className,
  ...props
}: ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn(
        "font-display text-[18px] font-bold tracking-tight text-brand",
        className,
      )}
      {...props}
    />
  );
}

export function SheetDescription({
  className,
  ...props
}: ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-[13px] leading-relaxed text-muted-foreground", className)}
      {...props}
    />
  );
}
