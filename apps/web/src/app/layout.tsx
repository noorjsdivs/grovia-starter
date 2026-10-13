import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";

/**
 * The design pairs TikTok Sans (display) with Public Sans (body).
 *
 * Public Sans is self-hosted via next/font — the CSS variable
 * `--font-public-sans` is wired into Tailwind through `@theme inline` in
 * globals.css. TikTok Sans is not in next/font/google, so it loads from the
 * Google Fonts CSS API below and is referenced by family name on
 * `--font-display`.
 */
const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-public-sans",
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: {
    default: "Grovia — Fresh market, delivered in two hours",
    template: "%s · Grovia",
  },
  description:
    "Farm-fresh produce, everyday pantry staples and local favourites from 340 growers within 90 miles. Picked this morning, at your door in under two hours.",
  openGraph: {
    type: "website",
    siteName: "Grovia",
    title: "Grovia — Fresh market, delivered in two hours",
    description:
      "Farm-fresh produce and everyday staples from 340 local growers, delivered in a two-hour window.",
  },
  icons: { icon: "/favicon.svg" },
};

/**
 * Document shell only — fonts, metadata and the body element.
 *
 * The header and footer live in the (storefront) group's layout, not here, so
 * the (auth) group can present a full-page sign-in surface without them. The
 * global not-found page renders against this layout and pulls in the chrome
 * itself.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    /*
     * `data-scroll-behavior="smooth"` is required because globals.css sets
     * `scroll-behavior: smooth` on <html>. Next.js 16 no longer overrides that
     * during navigation by default, so without this attribute the router's
     * scroll-to-top animates — and gets interrupted by the incoming render,
     * leaving you part-way down the new page.
     */
    <html
      lang="en"
      className={publicSans.variable}
      data-scroll-behavior="smooth"
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- App Router has no
            pages/_document.js; this <link> in the root layout applies site-wide.
            display=swap avoids invisible text while TikTok Sans downloads. */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=TikTok+Sans:opsz,wght@12..36,300..900&display=swap"
        />
      </head>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
