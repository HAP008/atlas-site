/**
 * HeroIllustration: a drawn (HTML/CSS) picture of ATLAS asking before it sends an email.
 * Marked as an illustration in its caption and accessible label, so it's never mistaken
 * for a screenshot. Copy lives in content/home.ts. No JavaScript, no images.
 */

import { LogoMark } from "@/components/logo";
import { heroIllustration as copy } from "@/content/home";

export function HeroIllustration() {
  return (
    <figure className="relative mx-auto w-full max-w-md">
      <div role="img" aria-label={copy.label} className="select-none">
        {/* Menu bar */}
        <div
          aria-hidden="true"
          className="flex h-8 items-center justify-end gap-3 rounded-t-xl border border-b-0 border-border bg-card/80 px-3 text-muted-foreground backdrop-blur"
        >
          <span className="h-1.5 w-8 rounded-full bg-muted-foreground/25" />
          <span className="h-1.5 w-5 rounded-full bg-muted-foreground/25" />
          <span className="flex size-6 items-center justify-center rounded-md bg-primary/12 text-primary">
            <LogoMark className="size-4" />
          </span>
          <span className="h-1.5 w-10 rounded-full bg-muted-foreground/25" />
        </div>

        {/* Popover window */}
        <div
          aria-hidden="true"
          className="space-y-4 rounded-b-xl border border-border bg-card p-5 shadow-[0_24px_60px_-28px_rgba(28,27,24,0.35)]"
        >
          <div className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm text-primary-foreground">
            {copy.request}
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{copy.draftIntro}</p>
            <div className="rounded-xl border border-border bg-background px-4 py-3 font-heading text-[1.05rem] leading-snug italic">
              {copy.draft}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-xl bg-accent/70 px-4 py-3">
            <span className="text-sm font-medium">{copy.question}</span>
            <span className="flex gap-2">
              <span className="rounded-full border border-input/50 bg-background px-3 py-1 text-xs font-medium">
                {copy.decline}
              </span>
              <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                {copy.confirm}
              </span>
            </span>
          </div>
        </div>
      </div>
      <figcaption className="mt-3 text-center text-xs text-muted-foreground">{copy.caption}</figcaption>
    </figure>
  );
}
