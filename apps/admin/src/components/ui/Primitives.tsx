import type { ReactNode } from "react";
import { Separator } from "./separator";

/*
 * Admin-specific primitives that have no shadcn/ui equivalent.
 *
 * Card, Input, Badge and Textarea live in the shadcn files and are re-exported
 * here so existing imports keep working against a single implementation.
 * Selects always use the Radix/shadcn control in `select.tsx` (via FormSelect
 * for form posts) — never a native <select>.
 */
export { Card } from "./card";
export { Input } from "./input";
export { FormSelect } from "./FormSelect";

export { Badge, type BadgeTone as Tone } from "./badge";
export { Textarea } from "./textarea";
import type { BadgeTone as Tone } from "./badge";

/**
 * Maps a free-text status onto a tone. Statuses come from many screens, so this
 * matches on meaning rather than enumerating every possible string.
 */
export function statusTone(status: string): Tone {
  const s = status.toLowerCase();
  /* Order matters — in-progress states are checked before the settled ones. */
  if (/processing|pending|draft|review|low stock|scheduled|await|invited|steady|good|open|recoverable|transit|no-index/.test(s))
    return "amber";
  if (/deliver|active|paid|succeed|verified|connected|publish|excellent|processed|recovered|approved|optimis|settled|in stock|received|live|ready/.test(s))
    return "primary";
  if (/cancel|fail|reject|lost|out of stock|suspend|action needed|needs attention|urgent|falling/.test(s))
    return "crimson";
  if (/refund|ship|archiv|expired|sold out|disabled|closed|hidden|paused|resolved|not configured|available/.test(s))
    return "neutral";
  return "blue";
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex flex-col gap-1.5">
        <h1 className="font-display text-[clamp(20px,2.4vw,28px)] font-bold tracking-tight text-brand">
          {title}
        </h1>
        {subtitle && (
          <p className="max-w-160 text-[14px] leading-relaxed text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </header>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[12.5px] font-semibold text-foreground">{label}</span>
      {children}
      {hint && <span className="text-[12px] text-subtle-foreground">{hint}</span>}
    </label>
  );
}

export function Divider({ className }: { className?: string }) {
  return <Separator className={className} />;
}

/** Empty-state used wherever a filtered list comes back with nothing. */
export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
      <span className="font-display text-[18px] font-bold text-brand">{title}</span>
      <p className="max-w-90 text-[13.5px] leading-relaxed text-muted-foreground">{body}</p>
      {action}
    </div>
  );
}
