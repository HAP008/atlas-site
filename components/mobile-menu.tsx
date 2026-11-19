"use client";

/**
 * MobileMenu: the small-screen nav. A native <details> disclosure, so it opens by
 * keyboard and works before JavaScript loads. JavaScript adds two things:
 * it closes after navigating (the header persists across client-side page changes)
 * and on Escape, returning focus to the menu button.
 * Depends on: components/nav-links.tsx, lib/routes.ts.
 */

import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { NavLinks } from "@/components/nav-links";
import type { SiteRoute } from "@/lib/routes";

export function MobileMenu({ links }: { links: SiteRoute[] }) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();

  // Close whenever the route changes.
  useEffect(() => {
    if (detailsRef.current) detailsRef.current.open = false;
  }, [pathname]);

  function handleKeyDown(event: React.KeyboardEvent<HTMLDetailsElement>) {
    const details = detailsRef.current;
    if (event.key === "Escape" && details?.open) {
      details.open = false;
      details.querySelector("summary")?.focus();
    }
  }

  // Also close on any link tap: same-page links like /#waitlist don't change the pathname.
  function handleClick(event: React.MouseEvent<HTMLDetailsElement>) {
    if (event.target instanceof Element && event.target.closest("a") && detailsRef.current) {
      detailsRef.current.open = false;
    }
  }

  return (
    <details ref={detailsRef} onKeyDown={handleKeyDown} onClick={handleClick} className="group relative md:hidden">
      <summary className="flex size-10 list-none items-center justify-center rounded-full border border-border text-foreground [&::-webkit-details-marker]:hidden">
        <Menu className="size-5" aria-hidden="true" />
        <span className="sr-only">Menu</span>
      </summary>
      <nav
        aria-label="Main"
        className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-popover p-2 shadow-lg shadow-black/5"
      >
        <NavLinks links={links} className="flex flex-col" linkClassName="block w-full py-2.5 text-base" />
      </nav>
    </details>
  );
}
