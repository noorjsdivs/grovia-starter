import {
  ArrowLeftRight,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  Share2,
  CreditCard,
  Eye,
  Gift,
  Headphones,
  Heart,
  Info,
  LayoutGrid,
  Leaf,
  List,
  ListFilter,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Menu,
  Minus,
  Percent,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Shield,
  ShoppingBag,
  ShoppingCart,
  Snowflake,
  Sparkles,
  Store,
  Trash2,
  Truck,
  User,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * One icon family for the whole storefront.
 *
 * Glyphs come from Lucide so every surface shares the same optical size,
 * round caps and 1.5px stroke. Call sites keep `name="cart"` — only the
 * drawing changes.
 */
const ICONS = {
  search: Search,
  cart: ShoppingCart,
  heart: Heart,
  user: User,
  truck: Truck,
  chevronRight: ChevronRight,
  chevronDown: ChevronDown,
  chevronLeft: ChevronLeft,
  arrowRight: ArrowRight,
  arrowUpRight: ArrowUpRight,
  close: X,
  check: Check,
  plus: Plus,
  minus: Minus,
  menu: Menu,
  filter: ListFilter,
  percent: Percent,
  store: Store,
  snow: Snowflake,
  leaf: Leaf,
  shield: Shield,
  clock: Clock,
  pin: MapPin,
  mail: Mail,
  bell: Bell,
  phone: Phone,
  grid: LayoutGrid,
  list: List,
  bag: ShoppingBag,
  gift: Gift,
  sparkle: Sparkles,
  refresh: RefreshCw,
  trash: Trash2,
  eye: Eye,
  lock: Lock,
  logout: LogOut,
  support: Headphones,
  copy: Copy,
  share: Share2,
  card: CreditCard,
  compare: ArrowLeftRight,
  info: Info,
  calendar: Calendar,
} as const satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export function Icon({
  name,
  size = 20,
  className,
  strokeWidth = 1.5,
}: IconProps) {
  const Glyph = ICONS[name];
  return (
    <Glyph
      size={size}
      strokeWidth={strokeWidth}
      aria-hidden="true"
      className={cn("shrink-0", className)}
    />
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
