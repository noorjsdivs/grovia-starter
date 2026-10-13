"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface FormSelectOption {
  value: string;
  label: string;
}

/**
 * shadcn Select that still posts through FormData.
 *
 * Radix Select has no native `name`, so a hidden input carries the value for
 * server actions. Uncontrolled with `defaultValue`, or controlled with `value`.
 */
export function FormSelect({
  name,
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Choose…",
  required,
  disabled,
  id,
  className,
  triggerClassName,
}: {
  name: string;
  options: FormSelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  className?: string;
  triggerClassName?: string;
}) {
  const fallback = defaultValue || options[0]?.value || "";
  const [internal, setInternal] = useState(fallback);
  const current = value ?? internal;

  return (
    <div className={cn("w-full", className)}>
      <input type="hidden" name={name} value={current} required={required} />
      <Select
        value={current || undefined}
        onValueChange={(next) => {
          if (value === undefined) setInternal(next);
          onValueChange?.(next);
        }}
        disabled={disabled || options.length === 0}
      >
        <SelectTrigger
          id={id}
          className={cn("h-12 w-full", triggerClassName)}
        >
          {/* The label as explicit children renders on the server; Radix alone fills it only once the menu has mounted. */}
          <SelectValue placeholder={placeholder}>{options.find((o) => o.value === current)?.label ?? current}</SelectValue>
        </SelectTrigger>
        <SelectContent className="z-100">
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
