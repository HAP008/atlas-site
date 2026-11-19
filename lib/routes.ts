/**
 * lib/routes.ts: every public route, in one list.
 *
 * Used by: header, footer, sitemap.ts and scripts/check-export.ts (which fails if
 * any route here is missing from the static export).
 * If a page is added but not listed here, it won't appear in the sitemap or footer.
 */

export type SiteRoute = { href: string; label: string };

export const mainNav: SiteRoute[] = [
  { href: "/features/", label: "Features" },
  { href: "/pricing/", label: "Pricing" },
  { href: "/faq/", label: "FAQ" },
  { href: "/about/", label: "About" },
];

export const productLinks: SiteRoute[] = [
  { href: "/features/", label: "Features" },
  { href: "/pricing/", label: "Pricing" },
  { href: "/faq/", label: "FAQ and setup" },
  { href: "/changelog/", label: "Changelog" },
  { href: "/about/", label: "About" },
];

export const legalLinks: SiteRoute[] = [
  { href: "/privacy/", label: "Privacy Policy" },
  { href: "/terms/", label: "Terms of Service" },
  { href: "/refunds/", label: "Refund Policy" },
  { href: "/cookies/", label: "Cookie Notice" },
  { href: "/acceptable-use/", label: "Acceptable Use" },
  { href: "/security/", label: "Security" },
];

export const allRoutes: SiteRoute[] = [
  { href: "/", label: "Home" },
  ...productLinks,
  ...legalLinks,
];
