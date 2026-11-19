import type { NextConfig } from "next";
import { siteConfig } from "./site.config";

// Static export for GitHub Pages. The base path comes from site.config.ts so a
// domain move is one line there, not here.
const nextConfig: NextConfig = {
  output: "export",
  basePath: siteConfig.basePath,
  // Emit /pricing/index.html so any static host serves /pricing/ without rewrites.
  trailingSlash: true,
  // The default image optimiser needs a server; a static export can't use it.
  images: { unoptimized: true },
  reactStrictMode: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
