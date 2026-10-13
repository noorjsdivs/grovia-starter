"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * shadcn/ui Select (Radix).
 *
 * Use this for every dropdown in the admin dashboard — never a native
 * `<select>`. When the value must post with a form / server action, wrap with
 * `FormSelect` (hidden input + these primitives).
 */
export const Select = SelectPrimitive.Root;
export const SelectGroup = SelectPrimitive.Group;
export const SelectValue = SelectPrimitive.Value;

export function SelectTrigger({
  className,
  children,
  ...props
}: ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(
        "flex h-11 w-full cursor-pointer items-center justify-between gap-2 rounded-control border border-border bg-card px-3.5 text-sm whitespace-nowrap outline-none transition-colors",
        "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20",
        "data-placeholder:text-subtle-foreground",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

export function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        position={position}
        className={cn(
          "relative z-90 max-h-80 min-w-(--radix-select-trigger-width) overflow-hidden rounded-card border border-border bg-card shadow-pop",
          "data-[state=open]:animate-drop",
          className,
        )}
        {...props}
      >
        <SelectPrimitive.ScrollUpButton className="grid h-6 place-items-center">
          <ChevronUpIcon className="size-4" />
        </SelectPrimitive.ScrollUpButton>

        <SelectPrimitive.Viewport className="p-2">{children}</SelectPrimitive.Viewport>

        <SelectPrimitive.ScrollDownButton className="grid h-6 place-items-center">
          <ChevronDownIcon className="size-4" />
        </SelectPrimitive.ScrollDownButton>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

export function SelectItem({
  className,
  children,
  ...props
}: ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex cursor-pointer items-start gap-2 rounded-control py-2.5 pr-8 pl-3 text-[13.5px] outline-none select-none",
        "focus:bg-muted data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <span className="absolute right-2.5 top-3">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4 text-primary" strokeWidth={3} />
        </SelectPrimitive.ItemIndicator>
      </span>
    </SelectPrimitive.Item>
  );
}

export function SelectLabel({
  className,
  ...props
}: ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("px-3 py-1.5 text-[11.5px] font-bold tracking-wide text-subtle-foreground uppercase", className)}
      {...props}
    />
  );
}
