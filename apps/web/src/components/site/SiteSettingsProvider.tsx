"use client";

import { createContext, useContext, type ReactNode } from "react";

export interface SiteRuntimeSettings {
  /** When true, the storefront renders remote images through next/image (`/_next/image`). Off = plain `<img>`. */
  optimizeImages: boolean;
}

const DEFAULTS: SiteRuntimeSettings = { optimizeImages: false };

const Ctx = createContext<SiteRuntimeSettings>(DEFAULTS);

export function SiteSettingsProvider({
  value,
  children,
}: {
  value: SiteRuntimeSettings;
  children: ReactNode;
}) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSiteSettings(): SiteRuntimeSettings {
  return useContext(Ctx);
}
