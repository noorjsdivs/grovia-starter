"use client";

import { Toaster as SonnerToaster, type ToasterProps } from "sonner";
import { cn } from "@/lib/utils";

/**
 * Site-wide Sonner toaster, themed to Grovia tokens (light only).
 *
 * Mount once near the root chrome. Call `toast` from `sonner` or
 * `@/lib/toast` from any client module.
 */
export function Toaster({ className, ...props }: ToasterProps) {
  return (
    <SonnerToaster
      theme="light"
      position="bottom-right"
      closeButton
      richColors={false}
      expand={false}
      gap={10}
      offset={{ bottom: 16, right: 16 }}
      duration={3500}
      className={cn("grovia-toaster", className)}
      toastOptions={{
        unstyled: false,
        classNames: {
          toast: cn(
            "group toast flex w-full items-start gap-3 rounded-card border border-border bg-card p-4 shadow-pop",
            "text-[14px] font-medium text-foreground",
            "data-[type=success]:border-primary/25",
            "data-[type=error]:border-danger/30",
            "data-[type=warning]:border-warning/35",
            "data-[type=info]:border-info/30",
          ),
          title: "font-display text-[14.5px] font-bold text-brand",
          description: "text-[13px] font-medium text-muted-foreground",
          actionButton: cn(
            "rounded-control bg-primary px-3 py-1.5 text-[12.5px] font-bold text-card",
            "transition-colors hover:bg-primary-hover",
          ),
          cancelButton: cn(
            "rounded-control bg-muted px-3 py-1.5 text-[12.5px] font-semibold text-muted-foreground",
            "transition-colors hover:bg-border",
          ),
          closeButton: cn(
            "rounded-full border border-border bg-card text-muted-foreground",
            "transition-colors hover:bg-muted hover:text-foreground",
          ),
          success: "[&_[data-icon]]:text-primary",
          error: "[&_[data-icon]]:text-danger",
          warning: "[&_[data-icon]]:text-warning",
          info: "[&_[data-icon]]:text-info",
        },
      }}
      {...props}
    />
  );
}
