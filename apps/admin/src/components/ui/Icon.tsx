import { cn } from "@/lib/utils";

/**
 * The icon set the Grovia design uses, redrawn as a compact stroke family.
 * All glyphs share a 24×24 box and inherit `currentColor`.
 */
const PATHS = {
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm10 2-4.35-4.35",
  cart: "M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L21 8H6M9 21h.01M17 21h.01",
  heart:
    "M12 20.3 4.6 13a4.6 4.6 0 0 1 6.5-6.5l.9.9.9-.9A4.6 4.6 0 1 1 19.4 13Z",
  user: "M4 21v-1.5A5.5 5.5 0 0 1 9.5 14h5a5.5 5.5 0 0 1 5.5 5.5V21M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
  truck:
    "M3 7h11v9H3zM14 10h3.5L21 13.5V16h-7zM7.5 19a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5Zm10 0a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5Z",
  chevronRight: "m9 5 7 7-7 7",
  chevronDown: "m5 9 7 7 7-7",
  chevronLeft: "m15 5-7 7 7 7",
  arrowRight: "M4 12h15m0 0-6-6m6 6-6 6",
  arrowUpRight: "M7 17 17 7m0 0H8m9 0v9",
  trendingUp: "M23 6 13.5 15.5l-5-5L1 18M17 6h6v6",
  trendingDown: "M23 18 13.5 8.5l-5 5L1 6M17 18h6v-6",
  close: "M6 6l12 12M18 6 6 18",
  check: "m5 13 4.5 4.5L19 7",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  menu: "M4 7h16M4 12h16M4 17h16",
  grip: "M9 5.5h.01M9 12h.01M9 18.5h.01M15 5.5h.01M15 12h.01M15 18.5h.01",
  arrowUp: "M12 19V5m0 0-6 6m6-6 6 6",
  arrowDown: "M12 5v14m0 0 6-6m-6 6-6-6",
  filter: "M4 6h16M7 12h10M10 18h4",
  percent: "M6 18 18 6M8 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  store:
    "M4 10v9h16v-9M3 5h18l-1 5H4L3 5ZM10 19v-5h4v5",
  snow: "M12 3v18M4 7.5l16 9M20 7.5l-16 9",
  leaf: "M20 4c0 9.4-4.6 14-11.4 14H6.2C6.9 10.3 11.6 5.6 20 4ZM4.6 21c.5-4.4 2.2-8.1 5.1-11",
  shield: "M12 3 5 6v6c0 4.4 3 8.3 7 9 4-.7 7-4.6 7-9V6l-7-3Z",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7v5l3.5 2",
  calendar: "M4 6.5h16v13.5H4zM4 10.5h16M8 3.5v4M16 3.5v4",
  pin: "M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11ZM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  mail: "M3 6h18v12H3zM3 7l9 6 9-6",
  phone:
    "M6 3h3l1.6 4-2 1.4a12 12 0 0 0 5.9 5.9l1.4-2L20 15v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4 6.2 2 2 0 0 1 6 4Z",
  grid: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
  list: "M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01",
  bag: "M5 8h14l-1 12H6L5 8ZM9 8V6a3 3 0 0 1 6 0v2",
  gift: "M3 11h18v9H3zM3 7h18v4H3zM12 7v13M12 7S9.5 3 7.5 4.5 9 7 12 7Zm0 0s2.5-4 4.5-2.5S15 7 12 7Z",
  sparkle: "M12 3.5 13.9 9l5.6 1.9-5.6 1.9L12 18.5l-1.9-5.7L4.5 11 10.1 9 12 3.5Z",
  refresh: "M20 11a8 8 0 1 0-2.3 5.7M20 5v6h-6",
  trash: "M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13M10 11v5M14 11v5",
  image: "M3 5h18v14H3zM3 16l5-5 4 4 3-3 6 6",
  star: "M12 3.6l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.8l5.9-.9z",
  eye: "M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6Zm10 2.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  lock: "M6 10h12v10H6zM9 10V7a3 3 0 0 1 6 0v3",
  tag: "M3 12V4h8l9 9-8 8-9-9Zm4.5-4.5h.01",
  money:
    "M4 7h16v10H4zM12 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM7 7v.01M17 17v.01",
  users:
    "M2 20v-1a5 5 0 0 1 5-5h3a5 5 0 0 1 5 5v1M8.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm7.5 3a5 5 0 0 1 6 5v1M16 4.5a3.5 3.5 0 0 1 0 7",
  chart: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  globe:
    "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9S14.5 18.3 12 21c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3Z",
  bell: "M18 9a6 6 0 0 0-12 0c0 5-2 6-2 6h16s-2-1-2-6ZM10.5 20a2 2 0 0 0 3 0",
  support:
    "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-3.5-3.5L6 20M15.5 17.5 18 20M6 4l2.5 2.5M18 4l-2.5 2.5M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z",
  settings:
    "M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2v.2a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-3-1.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 3 14.6a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.2-3l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 2.9-1.2V3.4a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 3 1.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0 1.2 2.9h.2a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z",
  download: "M12 3v12m0 0 4.5-4.5M12 15l-4.5-4.5M4 20h16",
  edit: "m4 20 4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20ZM14.5 6.5l3 3",
  copy: "M9 9h11v11H9zM5 15H4V4h11v1",
  logout: "M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l-5-5 5-5M5 12h11",
  database:
    "M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3Zm0 4c0 1.7 3.6 3 8 3s8-1.3 8-3M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6",
} as const;

export type IconName = keyof typeof PATHS;

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export function Icon({ name, size = 20, className, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}

/** Filled star — used for ratings, where a stroke glyph reads wrong. */
export function StarIcon({ size = 14, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      <path d="M12 2.5l2.9 6.1 6.6.9-4.8 4.7 1.2 6.6L12 17.7 6.1 20.8l1.2-6.6L2.5 9.5l6.6-.9L12 2.5Z" />
    </svg>
  );
}
