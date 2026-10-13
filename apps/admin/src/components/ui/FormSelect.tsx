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
  /** Shown but not choosable — with a label that says why. */
  disabled?: boolean;
}

/**
 * Form-ready shadcn Select.
 *
 * Radix Select does not post a native form field, so this keeps a hidden input
 * under `name` for server actions / FormData. Controlled via `value` when the
 * parent owns state; otherwise uncontrolled with `defaultValue`.
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
  /* An explicit "" means "nothing chosen yet" — the placeholder shows and
     the caller's `required` decides. Omitting defaultValue keeps the old
     behaviour of preselecting the first option. */
  const fallback = defaultValue === undefined ? (options[0]?.value ?? "") : defaultValue;
  const [internal, setInternal] = useState(fallback);
  const current = value ?? internal;

  return (
    <div className={cn("w-full", className)}>
      <input
        type="hidden"
        name={name}
        value={current}
        required={required}
      />
      <Select
        value={current || undefined}
        onValueChange={(next) => {
          if (value === undefined) setInternal(next);
          onValueChange?.(next);
        }}
        disabled={disabled || options.length === 0}
      >
        <SelectTrigger id={id} className={triggerClassName}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
