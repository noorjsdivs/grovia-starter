"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/Icon";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { listHref } from "@/lib/list-query";
import { cn } from "@/lib/utils";
import { PAGE_SIZE, PER_PAGE_OPTIONS, showingLabel } from "@/lib/pagination";

export const PER_PAGE_ITEMS = PER_PAGE_OPTIONS.map((count) => ({
  value: String(count),
  label: `${count} / page`,
}));

export const DATE_SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
] as const;

export function FilterSelect({
  id,
  label,
  value,
  onValueChange,
  items,
  disabled = false,
}: {
  id: string;
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  items: { value: string; label: string }[];
  disabled?: boolean;
}) {
  return (
    <div className={cn("flex min-w-36 flex-col gap-1.5", disabled && "opacity-60")}>
      <Label htmlFor={id}>{label}</Label>
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger id={id} className="h-9.5 w-auto min-w-36">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function TableFilterBar({
  search,
  children,
  perPage,
  onPerPageChange,
  clearHref,
  onClear,
  filtersActive,
  extra,
  disabled = false,
}: {
  /** Nothing to filter yet — the search and the page size are switched off. */
  disabled?: boolean;
  search?: {
    action?: string;
    name?: string;
    value: string;
    placeholder?: string;
    hidden?: Record<string, string | number | undefined>;
    onChange?: (value: string) => void;
  };
  children?: ReactNode;
  perPage: number;
  onPerPageChange: (n: number) => void;
  clearHref?: string;
  onClear?: () => void;
  filtersActive?: boolean;
  extra?: ReactNode;
}) {
  const searchField = search ? (
    <>
      {search.hidden
        ? Object.entries(search.hidden).map(([key, value]) =>
            value !== undefined && value !== "" ? (
              <input key={key} type="hidden" name={key} value={String(value)} />
            ) : null,
          )
        : null}
      <Icon name="search" size={16} className="text-subtle-foreground" />
      {search.onChange ? (
        <input
          value={search.value}
          onChange={(event) => search.onChange?.(event.target.value)}
          placeholder={search.placeholder ?? "Search…"}
          aria-label={search.placeholder ?? "Search"}
          disabled={disabled}
          className="min-w-0 flex-1 bg-transparent text-[13px] outline-none disabled:cursor-not-allowed"
        />
      ) : (
        <input
          name={search.name ?? "q"}
          defaultValue={search.value}
          placeholder={search.placeholder ?? "Search…"}
          aria-label={search.placeholder ?? "Search"}
          disabled={disabled}
          className="min-w-0 flex-1 bg-transparent text-[13px] outline-none disabled:cursor-not-allowed"
        />
      )}
    </>
  ) : null;

  const searchWrapClass = cn(
    "flex h-9.5 min-w-56 flex-1 items-center gap-2 rounded-full border border-border bg-muted px-3.5 focus-within:border-primary",
    disabled && "opacity-60",
  );

  return (
    <div className="flex flex-col gap-3 border-b border-border p-3">
      <div className="flex flex-wrap items-end gap-3">
        {search ? (
          search.action ? (
            <form action={search.action} className={searchWrapClass}>
              {searchField}
            </form>
          ) : (
            <div className={searchWrapClass}>{searchField}</div>
          )
        ) : null}

        {children}

        <FilterSelect
          id="table-per-page"
          label="Per page"
          value={String(perPage)}
          onValueChange={(value) => onPerPageChange(Number(value))}
          items={PER_PAGE_ITEMS}
          disabled={disabled}
        />

        <div className="ml-auto flex items-center gap-2 pb-0.5">
          {filtersActive && !disabled && clearHref ? (
            <Button asChild variant="ghost" size="sm">
              <Link href={clearHref}>Clear</Link>
            </Button>
          ) : null}
          {filtersActive && !disabled && onClear ? (
            <Button type="button" variant="ghost" size="sm" onClick={onClear}>
              Clear
            </Button>
          ) : null}
          {extra}
        </div>
      </div>
    </div>
  );
}

export function UrlFilterBar({
  path,
  values,
  defaults = {},
  searchPlaceholder,
  searchName = "q",
  selects = [],
}: {
  path: string;
  values: Record<string, string | number>;
  defaults?: Record<string, string | number>;
  searchPlaceholder?: string;
  searchName?: string;
  selects?: {
    id: string;
    key: string;
    label: string;
    items: { value: string; label: string }[];
    allValue?: string;
  }[];
}) {
  const router = useRouter();
  const query = String(values[searchName] ?? "");
  const perPage = Number(values.perPage) || PAGE_SIZE;

  function href(next: Record<string, string | number | undefined>) {
    return listHref(
      path,
      { ...values, ...next, page: 1 },
      { page: 1, perPage: PAGE_SIZE, ...defaults },
    );
  }

  const hidden: Record<string, string | number | undefined> = { ...values };
  delete hidden[searchName];
  delete hidden.page;

  const filtersActive = Object.entries(values).some(([key, value]) => {
    if (key === "page") return false;
    const fallback = defaults[key];
    return value !== undefined && value !== "" && String(value) !== String(fallback ?? "");
  });

  return (
    <TableFilterBar
      search={
        searchPlaceholder
          ? {
              action: path,
              name: searchName,
              value: query,
              placeholder: searchPlaceholder,
              hidden,
            }
          : undefined
      }
      perPage={perPage}
      onPerPageChange={(next) => router.push(href({ perPage: next }))}
      clearHref={path}
      filtersActive={filtersActive}
    >
      {selects.map((select) => {
        const allValue = select.allValue ?? "";
        const current = String(values[select.key] || allValue || select.items[0]?.value || "");
        return (
          <FilterSelect
            key={select.id}
            id={select.id}
            label={select.label}
            value={current}
            onValueChange={(value) => {
              const next = value === allValue ? "" : value;
              router.push(href({ [select.key]: next }));
            }}
            items={select.items}
          />
        );
      })}
    </TableFilterBar>
  );
}

export function TablePager({
  page,
  pages,
  total,
  perPage,
  itemLabel,
  prevHref,
  nextHref,
  onPrev,
  onNext,
}: {
  page: number;
  pages: number;
  total: number;
  perPage: number;
  itemLabel: string;
  prevHref?: string;
  nextHref?: string;
  onPrev?: () => void;
  onNext?: () => void;
}) {
  if (total === 0) return null;

  return (
    <nav className="flex items-center justify-between gap-4">
      <span className="text-[13px] text-muted-foreground">
        {showingLabel(page, perPage, total)} {itemLabel}
        {" · "}
        {perPage} per page
      </span>
      {pages > 1 ? (
        <div className="flex gap-2">
          {prevHref ? (
            <Button asChild variant="outline" size="sm">
              <Link href={prevHref}>Previous</Link>
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!onPrev || page <= 1}
              onClick={onPrev}
            >
              Previous
            </Button>
          )}
          {nextHref ? (
            <Button asChild variant="outline" size="sm">
              <Link href={nextHref}>Next</Link>
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!onNext || page >= pages}
              onClick={onNext}
            >
              Next
            </Button>
          )}
        </div>
      ) : null}
    </nav>
  );
}