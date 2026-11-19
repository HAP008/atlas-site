import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="mx-auto max-w-3xl px-4 pt-16 pb-10 sm:px-6 sm:pt-24">
      {eyebrow && <p className="text-sm font-medium tracking-wide text-primary">{eyebrow}</p>}
      <h1 className="mt-3 text-4xl leading-[1.1] tracking-tight sm:text-5xl">{title}</h1>
      {intro && <div className="mt-5 text-lg leading-relaxed text-muted-foreground">{intro}</div>}
      {children}
    </header>
  );
}
