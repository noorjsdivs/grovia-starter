import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** shadcn/ui Input on Grovia's control radius and border token. */
export function Input({ className, type, ...props }: ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full rounded-control border border-border bg-card px-3.5 text-sm transition-colors outline-none",
        "placeholder:text-subtle-foreground",
        "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20",
        "aria-invalid:border-danger aria-invalid:ring-2 aria-invalid:ring-danger/15",
        "disabled:cursor-not-allowed disabled:opacity-60",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        className,
      )}
      {...props}
    />
  );
}
