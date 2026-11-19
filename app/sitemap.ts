import type { MetadataRoute } from "next";
import { allRoutes } from "@/lib/routes";
import { siteConfig } from "@/site.config";

// Prerendered to sitemap.xml at build time (static export).
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return allRoutes.map((route) => ({
    url: `${siteConfig.siteUrl}${route.href}`,
  }));
}
