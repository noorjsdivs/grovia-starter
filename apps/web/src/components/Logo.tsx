import Link from "next/link";
import { cn } from "@/lib/utils";

/** The Grovia mark — leaf-in-rounded-square, exactly as drawn in the design. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "grid size-10.5 shrink-0 place-items-center rounded-tile bg-linear-150 from-primary to-brand shadow-brand",
        className,
      )}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M20 4c0 9.4-4.6 14-11.4 14H6.2C6.9 10.3 11.6 5.6 20 4Z"
          fill="var(--color-lime)"
        />
        <path
          d="M4.6 21c.5-4.4 2.2-8.1 5.1-11"
          stroke="var(--color-card)"
          strokeOpacity="0.9"
          strokeWidth="1.9"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

export function Logo({ className, mono = false }: { className?: string; mono?: boolean }) {
  return (
    <Link href="/" title="Grovia — home" className={cn("flex items-center gap-3", className)}>
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-[25px] font-extrabold tracking-[-1px]",
            mono ? "text-card" : "text-brand",
          )}
        >
          Grovia
        </span>
        <span
          className={cn(
            "pt-1 text-[9.5px] font-bold tracking-[0.24em] uppercase",
            mono ? "text-lime" : "text-primary",
          )}
        >
          Fresh market
        </span>
      </span>
    </Link>
  );
}
