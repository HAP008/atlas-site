/**
 * SiteFooter: product links, every legal page, and the contact email as plain text and a link.
 * Depends on: lib/routes.ts, site.config.ts.
 */

import Link from "next/link";
import { Wordmark } from "@/components/logo";
import { legalLinks, productLinks } from "@/lib/routes";
import { siteConfig } from "@/site.config";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-muted/50">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-4">
          <Wordmark />
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            {siteConfig.tagline} Built by Huzaifa in Mumbai.
          </p>
          <div className="text-sm">
            <p className="text-muted-foreground">Contact</p>
            <p>
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="[overflow-wrap:anywhere] text-foreground underline decoration-border underline-offset-4 hover:decoration-primary"
              >
                {siteConfig.contactEmail}
              </a>
            </p>
          </div>
        </div>

        <nav aria-label="Product">
          <h2 className="mb-3 font-sans text-sm font-semibold">Product</h2>
          <ul className="space-y-2 text-sm">
            {productLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-muted-foreground hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Legal">
          <h2 className="mb-3 font-sans text-sm font-semibold">Legal (drafts)</h2>
          <ul className="space-y-2 text-sm">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-muted-foreground hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs leading-relaxed text-muted-foreground sm:px-6 md:flex-row md:justify-between">
          <p>No cookies, no analytics, no trackers on this site.</p>
          <p>Legal pages are drafts, not yet reviewed by a lawyer or accountant.</p>
        </div>
      </div>
    </footer>
  );
}
