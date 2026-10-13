import { MoreHorizontalIcon } from "lucide-react";
import Link from "next/link";
import type { ComponentProps } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/**
 * shadcn/ui Pagination on this repo's button variants: page numbers are
 * ghost buttons, the current page is outlined, Previous / Next carry a
 * chevron and, from `sm`, their word. A link renders a `next/link` when it
 * has an `href` (server-rendered pagers) and a button otherwise (client
 * pagers that write the page to the URL themselves).
 */
export function Pagination({ className, ...props }: ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

export function PaginationContent({ className, ...props }: ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  );
}

export function PaginationItem({ ...props }: ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
  /** Render as a link to this URL instead of a button. */
  href?: string;
  size?: "icon" | "default";
} & Omit<ComponentProps<"button">, "type">;

export function PaginationLink({
  className,
  isActive,
  href,
  size = "icon",
  disabled,
  children,
  ...props
}: PaginationLinkProps) {
  const classes = cn(
    buttonVariants({ variant: isActive ? "outline" : "ghost", size: "sm" }),
    "h-9 font-semibold",
    size === "icon" ? "size-9 px-0" : "px-2.5",
    isActive && "border-primary bg-primary/8 text-primary hover:bg-primary/12",
    disabled && "pointer-events-none opacity-40",
    className,
  );
  const shared = {
    "data-slot": "pagination-link",
    "data-active": isActive,
    "aria-current": isActive ? ("page" as const) : undefined,
    className: classes,
  };
  if (href && !disabled) {
    const { onClick, ...rest } = props as ComponentProps<"a">;
    void onClick;
    return (
      <Link href={href} {...shared} {...(rest as Omit<ComponentProps<typeof Link>, "href">)}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" disabled={disabled} aria-disabled={disabled || undefined} {...shared} {...props}>
      {children}
    </button>
  );
}

export function PaginationPrevious({ className, ...props }: Omit<PaginationLinkProps, "size" | "children">) {
  return (
    <PaginationLink aria-label="Previous page" size="default" className={cn("gap-1 pl-2", className)} {...props}>
      <Icon name="chevronLeft" size={16} />
      <span className="hidden sm:block">Previous</span>
    </PaginationLink>
  );
}

export function PaginationNext({ className, ...props }: Omit<PaginationLinkProps, "size" | "children">) {
  return (
    <PaginationLink aria-label="Next page" size="default" className={cn("gap-1 pr-2", className)} {...props}>
      <span className="hidden sm:block">Next</span>
      <Icon name="chevronRight" size={16} />
    </PaginationLink>
  );
}

export function PaginationEllipsis({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex size-9 items-center justify-center text-muted-foreground", className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}
