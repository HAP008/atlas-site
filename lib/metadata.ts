/**
 * pageMetadata: per-page title, description and absolute canonical URL (base path included).
 * Used by every app/<route>/page.tsx. The social image comes from app/opengraph-image.png.
 */

import type { Metadata } from "next";
import { siteConfig } from "@/site.config";

export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: `/${string}`;
}): Metadata {
  const url = `${siteConfig.siteUrl}${path}`;
  // A page-level openGraph object replaces the layout's, so the image must be repeated here.
  const image = {
    url: `${siteConfig.siteUrl}/opengraph-image.png`,
    width: 1200,
    height: 630,
    alt: `${siteConfig.name}: ${siteConfig.tagline}`,
  };
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} · ${siteConfig.name}`,
      description,
      url,
      siteName: siteConfig.name,
      type: "website",
      images: [image],
    },
    twitter: { card: "summary_large_image", title: `${title} · ${siteConfig.name}`, description, images: [image.url] },
  };
}
