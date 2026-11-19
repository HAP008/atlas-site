import type { MetadataRoute } from "next";
import { siteConfig } from "@/site.config";

// Prerendered to robots.txt at build time (static export).
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
  };
}
