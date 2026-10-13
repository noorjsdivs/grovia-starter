import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";

/**
 * Public Sans is self-hosted via next/font (`--font-public-sans` → `@theme
 * inline` in globals.css). TikTok Sans is not in next/font/google, so it
 * loads from the Google Fonts CSS API below.
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
    default: "Grovia Admin",
    template: "%s · Grovia Admin",
  },
  description: "Operations dashboard for the Grovia fresh market.",
  /* The admin is a private surface — keep it out of every index. */
  metadataBase: new URL((process.env.NEXT_PUBLIC_ADMIN_URL ?? "https://admin.grovia.reactbd.com").replace(/\/$/, "")),
  robots: { index: false, follow: false },
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    /*
     * Required because globals.css sets `scroll-behavior: smooth` on <html>.
     * Next.js 16 no longer overrides that during navigation by default, so
     * without this attribute the router's scroll-to-top animates and gets
     * interrupted, landing you part-way down the new page.
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
            pages/_document.js; this <link> in the root layout applies app-wide. */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=TikTok+Sans:opsz,wght@12..36,300..900&display=swap"
        />
      </head>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
