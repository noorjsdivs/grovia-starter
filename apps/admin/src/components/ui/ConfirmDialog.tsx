"use client";

import type { ComponentProps, ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";

/**
 * The modal behind every destructive admin action, on shadcn's AlertDialog.
 * Callers own `open`; the confirm button posts a server-action form so the
 * JWT never leaves the server.
 */
export function ConfirmDialog({
  open,
  onClose,
  title,
  description,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  confirming = false,
  action,
  fields,
  variant = "danger",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  confirming?: boolean;
  action: ComponentProps<"form">["action"];
  fields: Record<string, string>;
  /** "danger" for anything destructive (the default); "primary" for a confirmation that moves work forward. */
  variant?: "danger" | "primary";
}) {
  return (
    <AlertDialog open={open} onOpenChange={(next) => !next && !confirming && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div>{description}</div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className={buttonVariants({ variant: "ghost" })} disabled={confirming}>
            {cancelLabel}
          </AlertDialogCancel>
          <form action={action}>
            {Object.entries(fields).map(([name, value]) => (
              <input key={name} type="hidden" name={name} value={value} />
            ))}
            <Button type="submit" variant={variant} disabled={confirming}>
              {confirming ? "Working…" : confirmLabel}
            </Button>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
