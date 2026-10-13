"use client";

import { useEffect, useRef, type ChangeEvent, type ComponentProps } from "react";
import {
  DayButton,
  DayPicker,
  getDefaultClassNames,
  type DropdownProps,
} from "react-day-picker";
import { Button, buttonVariants } from "@/components/ui/button";
import { Icon } from "@/components/ui/Icon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

/** shadcn/ui Calendar (react-day-picker) on Grovia tokens — the same file as the storefront's. */
export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: ComponentProps<typeof DayPicker> & {
  buttonVariant?: ComponentProps<typeof Button>["variant"];
}) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "group/calendar bg-card p-3 [--cell-size:2rem]",
        className,
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("en-GB", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn("relative flex flex-col gap-4", defaultClassNames.months),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav,
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant, size: "icon" }),
          "size-8 rounded-tile p-0 select-none aria-disabled:opacity-50",
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant, size: "icon" }),
          "size-8 rounded-tile p-0 select-none aria-disabled:opacity-50",
          defaultClassNames.button_next,
        ),
        month_caption: cn(
          "flex h-8 w-full items-center justify-center px-8",
          defaultClassNames.month_caption,
        ),
        dropdowns: cn(
          "flex h-8 w-full items-center justify-center gap-1.5 text-sm font-medium",
          defaultClassNames.dropdowns,
        ),
        caption_label: cn(
          "select-none font-medium",
          captionLayout === "label"
            ? "text-sm"
            : "flex h-8 items-center gap-1 rounded-control px-2 text-sm text-foreground",
          defaultClassNames.caption_label,
        ),
        month_grid: cn("w-full border-collapse", defaultClassNames.month_grid),
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "flex-1 rounded-tile text-center text-[12px] font-medium text-subtle-foreground select-none",
          defaultClassNames.weekday,
        ),
        week: cn("mt-2 flex w-full", defaultClassNames.week),
        day: cn(
          "group/day relative aspect-square h-full w-full p-0 text-center select-none",
          defaultClassNames.day,
        ),
        today: cn(
          "rounded-tile bg-primary/10 text-primary",
          defaultClassNames.today,
        ),
        outside: cn(
          "text-subtle-foreground",
          defaultClassNames.outside,
        ),
        disabled: cn(
          "text-subtle-foreground opacity-50",
          defaultClassNames.disabled,
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: chevronClass }) => {
          const name =
            orientation === "left"
              ? "chevronLeft"
              : orientation === "right"
                ? "chevronRight"
                : "chevronDown";
          return <Icon name={name} size={16} className={cn(chevronClass)} />;
        },
        DayButton: CalendarDayButton,
        Dropdown: CalendarDropdown,
        ...components,
      }}
      {...props}
    />
  );
}

/**
 * The month and year menus. react-day-picker's own dropdown is a native
 * `<select>` hidden under the caption; this renders the shadcn Select
 * instead, so the menus are popper-positioned and styled like every other
 * select in the app. The library still drives the value and the options.
 */
function CalendarDropdown({
  options = [],
  value,
  onChange,
  className,
  "aria-label": ariaLabel,
}: DropdownProps) {
  return (
    <Select
      value={value === undefined || value === "" ? undefined : String(value)}
      onValueChange={(next) =>
        onChange?.({ target: { value: next } } as unknown as ChangeEvent<HTMLSelectElement>)
      }
    >
      <SelectTrigger
        aria-label={ariaLabel}
        className={cn("h-8 w-auto min-w-0 gap-1 rounded-control px-2.5 text-[13px] font-semibold", className)}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="z-100 max-h-64">
        {options.map((option) => (
          <SelectItem key={option.value} value={String(option.value)} disabled={option.disabled}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames();
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <Button
      ref={ref}
      type="button"
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      className={cn(
        "size-8 rounded-tile p-0 font-normal leading-none",
        "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-card data-[selected-single=true]:hover:bg-primary-hover",
        "group-data-[focused=true]/day:ring-2 group-data-[focused=true]/day:ring-primary/20",
        defaultClassNames.day,
        className,
      )}
      {...props}
    />
  );
}
