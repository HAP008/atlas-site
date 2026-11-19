"use client";

/**
 * NavLinks: the main navigation links, marking the current page with aria-current.
 * Client component only because it reads the current path (usePathname).
 * Depends on: lib/routes.ts. If it fails, the header still renders plain links.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SiteRoute } from "@/lib/routes";
import { cn } from "@/lib/utils";

function normalise(path: string): string {
  return path.endsWith("/") ? path : `${path}/`;
}

export function NavLinks({
  links,
  className,
  linkClassName,
}: {
  links: SiteRoute[];
  className?: string;
  linkClassName?: string;
}) {
  const pathname = normalise(usePathname() ?? "/");
  return (
    <ul className={className}>
      {links.map((link) => {
        const current = pathname === normalise(link.href);
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              aria-current={current ? "page" : undefined}
              className={cn(
                "rounded-md px-3 py-2 text-[0.95rem] text-muted-foreground transition-colors hover:text-foreground aria-[current=page]:text-foreground aria-[current=page]:underline aria-[current=page]:decoration-primary aria-[current=page]:decoration-2 aria-[current=page]:underline-offset-8",
                linkClassName,
              )}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
