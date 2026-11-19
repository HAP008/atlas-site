"use client";

/**
 * MobileMenu: the small-screen nav. A native <details> disclosure, so it opens by
 * keyboard and works before JavaScript loads. JavaScript adds:
 * - closing after a link is chosen, on Escape, and when focus leaves the menu
 * - putting focus somewhere sensible afterwards (the page's main content, or the
 *   target of a same-page link), because the chosen link disappears with the menu
 * Depends on: components/nav-links.tsx, lib/routes.ts.
 */

import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { NavLinks } from "@/components/nav-links";
import type { SiteRoute } from "@/lib/routes";

function focusElement(el: HTMLElement | null) {
  if (!el) return;
  if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
}

export function MobileMenu({ links }: { links: SiteRoute[] }) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const navigatedFromMenu = useRef(false);
  const pathname = usePathname();

  // On a route change: close, and if the change came from this menu, move focus to the new page.
  useEffect(() => {
    if (detailsRef.current) detailsRef.current.open = false;
    if (navigatedFromMenu.current) {
      navigatedFromMenu.current = false;
      focusElement(document.getElementById("main"));
    }
  }, [pathname]);

  function close() {
    if (detailsRef.current) detailsRef.current.open = false;
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDetailsElement>) {
    if (event.key === "Escape" && detailsRef.current?.open) {
      close();
      detailsRef.current.querySelector("summary")?.focus();
    }
  }

  // Close when keyboard focus moves outside the menu.
  function handleBlur(event: React.FocusEvent<HTMLDetailsElement>) {
    const next = event.relatedTarget;
    if (detailsRef.current?.open && next instanceof Node && !detailsRef.current.contains(next)) close();
  }

  // Close on any link tap, including same-page links like /#waitlist that don't change the pathname.
  function handleClick(event: React.MouseEvent<HTMLDetailsElement>) {
    const link = event.target instanceof Element ? event.target.closest("a") : null;
    if (!link) return;
    close();
    const url = new URL(link.href);
    if (url.pathname === window.location.pathname && url.hash) {
      // Same page: focus the section the link points to once the browser has scrolled there.
      requestAnimationFrame(() => focusElement(document.getElementById(decodeURIComponent(url.hash.slice(1)))));
    } else {
      navigatedFromMenu.current = true;
    }
  }

  return (
    // Handlers on <details> are delegated from the links and summary inside it;
    // <details>/<summary> themselves provide the keyboard semantics.
    <details
      ref={detailsRef}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
      onBlur={handleBlur}
      className="group relative md:hidden"
    >
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
