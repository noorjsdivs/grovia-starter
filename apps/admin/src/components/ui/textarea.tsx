import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** shadcn/ui Textarea on Grovia's control radius and border token. */
export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "w-full min-h-20 rounded-control border border-border bg-card px-3.5 py-3 text-sm transition-colors outline-none",
        "placeholder:text-subtle-foreground",
        "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20",
        "aria-invalid:border-danger aria-invalid:ring-2 aria-invalid:ring-danger/15",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      {...props}
    />
  );
}
