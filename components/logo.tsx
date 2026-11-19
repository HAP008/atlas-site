import { cn } from "@/lib/utils";

/** The ATLAS mark: a globe drawn as one circle, one meridian and the equator. Same shape as app/icon.svg. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
      className={cn("size-6", className)}
    >
      <circle cx="16" cy="16" r="13" fill="none" stroke="currentColor" strokeWidth="2" />
      <ellipse cx="16" cy="16" rx="5.5" ry="13" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M3 16h26" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-primary", className)}>
      <LogoMark />
      <span className="font-sans text-[0.95rem] font-semibold tracking-[0.22em] text-foreground">
        ATLAS
      </span>
    </span>
  );
}
