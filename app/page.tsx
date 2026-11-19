import Link from "next/link";
import { ArrowRight, Inbox, Plug, ShieldCheck } from "lucide-react";
import { ContourLines } from "@/components/contour-lines";
import { HeroIllustration } from "@/components/hero-illustration";
import { RichText } from "@/components/rich-text";
import { Waitlist } from "@/components/waitlist";
import { home } from "@/content/home";

const ICONS = { plug: Plug, inbox: Inbox, shield: ShieldCheck } as const;

export default function Home() {
  return (
    <>
      {/* Hero: what ATLAS is, for whom, and the waitlist, all above the fold. */}
      <section className="relative overflow-hidden border-b border-border/60">
        {/* Fade the lines away from the text column so copy stays easy to read. */}
        <ContourLines className="pointer-events-none absolute inset-0 h-full w-full text-contour opacity-70 [mask-image:linear-gradient(to_bottom,transparent_20%,black_75%)] lg:opacity-100 lg:[mask-image:linear-gradient(to_right,transparent_25%,black_60%)]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pt-12 pb-16 sm:px-6 sm:pt-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:pb-24">
          <div>
            <p className="text-sm font-medium tracking-wide text-primary">{home.eyebrow}</p>
            <h1 className="mt-3 text-[2.6rem] leading-[1.05] tracking-tight sm:text-6xl">{home.title}</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">{home.lead}</p>

            <div id="waitlist" className="mt-8 max-w-xl scroll-mt-24">
              <h2 className="sr-only">Join the waitlist</h2>
              <Waitlist />
            </div>

            <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground" aria-label="Good to know">
              {home.facts.map((fact) => (
                <li key={fact} className="flex items-center gap-2">
                  <span className="size-1 rounded-full bg-primary/60" aria-hidden="true" />
                  {fact}
                </li>
              ))}
            </ul>
          </div>

          <HeroIllustration />
        </div>
      </section>

      {/* Three real capabilities. */}
      <section aria-labelledby="capabilities-title" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h2 id="capabilities-title" className="text-3xl tracking-tight sm:text-4xl">
          {home.capabilitiesTitle}
        </h2>
        <ul className="mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
          {home.capabilities.map((cap) => {
            const Icon = ICONS[cap.icon];
            return (
              <li key={cap.title} className="border-t border-border pt-6">
                <span className="flex size-10 items-center justify-center rounded-full bg-accent text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-sans text-lg font-semibold">{cap.title}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{cap.body}</p>
              </li>
            );
          })}
        </ul>
      </section>

      {/* One honest privacy statement. */}
      <section aria-labelledby="privacy-title" className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-3xl bg-accent/60 px-6 py-12 sm:px-12 sm:py-16">
          <div className="max-w-2xl">
            <h2 id="privacy-title" className="text-3xl tracking-tight sm:text-4xl">
              {home.privacyTitle}
            </h2>
            <div className="mt-5 space-y-4 text-lg leading-relaxed text-foreground/85">
              {home.privacy.map((p, i) => (
                <p key={i}>
                  <RichText value={p} />
                </p>
              ))}
            </div>
            <Link
              href={home.privacyLink.href}
              className="mt-6 inline-flex items-center gap-1.5 font-medium text-primary underline-offset-4 hover:underline"
            >
              {home.privacyLink.text}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="closing-title" className="mx-auto max-w-6xl px-4 pt-20 sm:px-6">
        <h2 id="closing-title" className="text-2xl tracking-tight">
          {home.closingTitle}
        </h2>
        <ul className="mt-4 flex flex-wrap gap-3">
          {home.closingLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium hover:bg-muted"
              >
                {link.text}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
