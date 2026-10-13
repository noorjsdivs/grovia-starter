"use client";

import NextImage, { type ImageProps as NextImageProps, type StaticImageData } from "next/image";
import type { CSSProperties, ImgHTMLAttributes } from "react";
import { useSiteSettings } from "@/components/site/SiteSettingsProvider";

/**
 * A drop-in for `next/image` that respects Configuration → Media → "Optimise
 * storefront images through Next.js". Off (the default), it renders a plain
 * `<img>`, so ImageKit does the sizing and Vercel's Image Optimization is not
 * charged. On, it renders `<Image>` and Next handles the transforms.
 */
export type SmartImageProps = NextImageProps;

function resolveSrc(src: NextImageProps["src"]): string {
  if (typeof src === "string") return src;
  if (src && typeof src === "object" && "src" in src) return (src as StaticImageData).src;
  return "";
}

function toNumber(value: NextImageProps["width"] | NextImageProps["height"]): number | undefined {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const n = Number(value);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}

export default function SmartImage(props: SmartImageProps) {
  const { optimizeImages } = useSiteSettings();
  if (optimizeImages) return <NextImage {...props} />;

  const { src, alt, width, height, className, style, priority, loading, fill, decoding, fetchPriority, referrerPolicy, crossOrigin, draggable, id, title, tabIndex, role, onLoad, onError } = props;

  /* `fill` positions the element; it must not force object-fit, because the
     caller often sets `object-contain` on the className (product cut-outs). */
  const fillStyle: CSSProperties | undefined = fill
    ? { position: "absolute", inset: 0, width: "100%", height: "100%", ...(style as CSSProperties | undefined) }
    : (style as CSSProperties | undefined);

  const imgProps: ImgHTMLAttributes<HTMLImageElement> = {
    src: resolveSrc(src),
    alt: alt ?? "",
    width: fill ? undefined : toNumber(width),
    height: fill ? undefined : toNumber(height),
    className,
    style: fillStyle,
    loading: priority ? "eager" : loading ?? "lazy",
    decoding: decoding ?? "async",
    fetchPriority: fetchPriority ?? (priority ? "high" : undefined),
    referrerPolicy,
    crossOrigin,
    draggable,
    id,
    title,
    tabIndex,
    role,
    onLoad,
    onError,
  };

  /* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- SmartImage is the sanctioned wrapper; `<img>` is intentional when Configuration → Media → optimizeImages is off, and `alt` is set above. */
  return <img {...imgProps} />;
}
