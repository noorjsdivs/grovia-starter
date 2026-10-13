import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/* Temporary — proves the fonts, the tokens and the primitives render. The home page replaces it. */
const SWATCHES = [
  { name: "primary", className: "bg-primary" },
  { name: "brand", className: "bg-brand" },
  { name: "brand-deep", className: "bg-brand-deep" },
  { name: "lime", className: "bg-lime" },
  { name: "primary-soft", className: "bg-primary-soft" },
  { name: "muted", className: "bg-muted" },
];

export default function HomePage() {
  return (
    <main className="shell flex flex-1 flex-col gap-8 py-16">
      <Logo />
      <div className="flex flex-col gap-3">
        <h1 className="text-[clamp(24px,3vw,34px)] font-bold">Fresh market, delivered in two hours</h1>
        <p className="max-w-135 text-muted-foreground">
          Public Sans for the body, TikTok Sans for headings, and every colour a token.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button>
          Shop now <Icon name="arrowRight" size={18} />
        </Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
      </div>
      <ul className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {SWATCHES.map((swatch) => (
          <li key={swatch.name} className="flex flex-col gap-2 text-[12.5px] font-semibold text-muted-foreground">
            <span className={cn("h-16 rounded-tile border border-border shadow-tile", swatch.className)} />
            {swatch.name}
          </li>
        ))}
      </ul>
    </main>
  );
}
