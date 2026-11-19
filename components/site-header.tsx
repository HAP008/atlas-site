/**
 * SiteHeader: wordmark, main nav and the waitlist call to action.
 * On small screens the nav folds into components/mobile-menu.tsx.
 * Depends on: lib/routes.ts, components/nav-links.tsx, components/mobile-menu.tsx.
 */

import Link from "next/link";
import { Wordmark } from "@/components/logo";
import { MobileMenu } from "@/components/mobile-menu";
import { NavLinks } from "@/components/nav-links";
import { mainNav } from "@/lib/routes";

export function SiteHeader() {
  return (
    <header className="relative z-20 border-b border-border/70 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="rounded-md py-1" aria-label="ATLAS home">
          <Wordmark />
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <NavLinks links={mainNav} className="flex items-center gap-1" />
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/#waitlist"
            className="hidden rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 sm:inline-flex"
          >
            Join the waitlist
          </Link>

          <MobileMenu links={[...mainNav, { href: "/#waitlist", label: "Join the waitlist" }]} />
        </div>
      </div>
    </header>
  );
}
