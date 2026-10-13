"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

/**
 * Slide-over panel for edit / create forms and the mobile navigation.
 *
 * A thin wrapper over shadcn's Sheet (Radix Dialog): focus trapping, Escape,
 * overlay click, scroll lock and the mounted-until-the-exit-animation-ends
 * behaviour all come from the primitive. Callers own `open` and pass
 * `onClose`; children are expected to fill the panel (`flex min-h-0 flex-1`).
 */
export function Drawer({
  open,
  onClose,
  title,
  subtitle,
  children,
  className,
  side = "right",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  /** Which edge the panel anchors to. Default right for edit drawers. */
  side?: "left" | "right";
}) {
  return (
    <Sheet open={open} onOpenChange={(next) => !next && onClose()}>
      <SheetContent
        side={side}
        className={cn("w-full max-w-140", className)}
        aria-describedby={subtitle ? undefined : ""}
      >
        <SheetHeader>
          <SheetTitle className="truncate">{title}</SheetTitle>
          {subtitle ? (
            <SheetDescription className="truncate text-[12.5px]">{subtitle}</SheetDescription>
          ) : null}
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  );
}
