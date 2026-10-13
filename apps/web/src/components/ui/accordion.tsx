"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** shadcn/ui Accordion on Grovia tokens. Height animates via Radix's
 *  --radix-accordion-content-height and the accordion keyframes in globals.css. */
export function Accordion({ className, ...props }: ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" className={cn("w-full", className)} {...props} />;
}

export function AccordionItem({ className, ...props }: ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b border-border last:border-b-0", className)}
      {...props}
    />
  );
}

export function AccordionTrigger({
  className,
  children,
  variant = "default",
  ...props
}: ComponentProps<typeof AccordionPrimitive.Trigger> & {
  /**
   * "default" is the FAQ's circled chevron; "row" is a menu row with a bare
   * chevron that turns, for disclosures inside navigation.
   */
  variant?: "default" | "row";
}) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group flex flex-1 items-center gap-4 text-left font-semibold text-foreground transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
          variant === "default"
            ? "justify-between py-5 text-[15.5px] hover:text-primary focus-visible:rounded-control [&[data-state=open]]:text-primary"
            : "justify-between",
          className,
        )}
        {...props}
      >
        {children}
        {variant === "default" ? (
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground transition-[transform,background-color,color] duration-200 group-hover:bg-primary/10 group-hover:text-primary group-data-[state=open]:rotate-180 group-data-[state=open]:bg-primary group-data-[state=open]:text-card">
            <ChevronDown size={16} strokeWidth={2.4} />
          </span>
        ) : (
          <ChevronDown
            size={16}
            strokeWidth={2.4}
            className="shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180"
          />
        )}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

export function AccordionContent({ className, children, ...props }: ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="overflow-hidden text-[14.5px] leading-relaxed text-muted-foreground data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      {...props}
    >
      <div className={cn("pt-0 pb-5", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}
