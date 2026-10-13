"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Icon } from "@/components/ui/Icon";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

/**
 * A form date field on the shadcn Calendar: the visible control is a button
 * that opens the calendar in a popover, and the value travels as a hidden
 * `YYYY-MM-DD` input so server actions read it exactly as they read a native
 * date input. Local dates only — no timezone shift on the way out.
 */

const displayFormat = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function parseIsoDate(value: string | null | undefined): Date | undefined {
  if (!value) return undefined;
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) return undefined;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export function toIsoDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function DatePicker({
  name,
  id,
  defaultValue,
  placeholder = "Pick a date",
  /** Earliest selectable day. Omit to allow any day. */
  fromDate,
  /** How many years ahead the year menu offers. Delivery dates are near; birthdays are not. */
  yearsAhead = 2,
  className,
}: {
  name: string;
  id?: string;
  defaultValue?: string | null;
  placeholder?: string;
  fromDate?: Date;
  yearsAhead?: number;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(() => parseIsoDate(defaultValue));

  /* The year menu spans from the earliest month that matters — the floor, or
     an existing value before it — to a short horizon, instead of the
     library's century. */
  const thisMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const floor = fromDate ?? thisMonth;
  const startMonth = date && date < floor ? new Date(date.getFullYear(), date.getMonth(), 1) : floor;
  const endMonth = new Date(thisMonth.getFullYear() + yearsAhead, 11, 1);

  return (
    <div className={cn("flex flex-col", className)}>
      <input type="hidden" name={name} value={date ? toIsoDate(date) : ""} />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            id={id}
            aria-haspopup="dialog"
            aria-expanded={open}
            className={cn(
              "flex h-11 w-full cursor-pointer items-center gap-3 rounded-control border border-border bg-card px-3.5 text-left text-sm transition-colors outline-none",
              "hover:border-primary focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20",
              open && "border-primary",
            )}
          >
            <Icon name="calendar" size={17} className="shrink-0 text-muted-foreground" />
            <span className={cn("min-w-0 flex-1 truncate", date ? "text-foreground" : "text-subtle-foreground")}>
              {date ? displayFormat.format(date) : placeholder}
            </span>
            {date && (
              <span
                role="button"
                tabIndex={0}
                aria-label="Clear date"
                onClick={(e) => {
                  e.stopPropagation();
                  setDate(undefined);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    setDate(undefined);
                  }
                }}
                className="grid size-6 shrink-0 place-items-center rounded-full text-subtle-foreground hover:bg-muted hover:text-foreground"
              >
                <Icon name="close" size={13} />
              </span>
            )}
          </button>
        </PopoverTrigger>
        {/* As wide as the field it opens from; the grid stretches to fill it. */}
        <PopoverContent align="start" className="w-(--radix-popover-trigger-width) min-w-72 p-2">
          <Calendar
            mode="single"
            className="w-full p-1"
            classNames={{
              root: "w-full",
              months: "w-full",
              month: "w-full",
              weekday: "flex-1",
              day: "flex-1",
              day_button: "h-auto w-full aspect-square",
            }}
            selected={date}
            onSelect={(next) => {
              setDate(next);
              if (next) setOpen(false);
            }}
            defaultMonth={date ?? floor}
            startMonth={startMonth}
            endMonth={endMonth}
            disabled={fromDate ? { before: fromDate } : undefined}
            captionLayout="dropdown"
            navLayout="around"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
