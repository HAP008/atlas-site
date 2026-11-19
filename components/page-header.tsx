import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Page title block. `width` should match the page's content container so left edges line up. */
export function PageHeader({
  eyebrow,
  title,
  intro,
  children,
  width = "max-w-3xl",
}: {
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  children?: ReactNode;
  width?: "max-w-3xl" | "max-w-5xl" | "max-w-6xl";
}) {
  return (
    <header className={cn("mx-auto px-4 pt-16 pb-10 sm:px-6 sm:pt-24", width)}>
      <div className="max-w-3xl">
        {eyebrow && <p className="text-sm font-medium tracking-wide text-primary">{eyebrow}</p>}
        <h1 className="mt-3 text-4xl leading-[1.1] tracking-tight sm:text-5xl">{title}</h1>
        {intro && <div className="mt-5 text-lg leading-relaxed text-muted-foreground">{intro}</div>}
        {children}
      </div>
    </header>
  );
}
