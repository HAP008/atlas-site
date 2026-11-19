/**
 * Pricing: renders the PLACEHOLDER plans from site.config.ts with an unmissable
 * "launch pricing to be confirmed" note. scripts/check-export.ts fails if that note disappears.
 */

import Link from "next/link";
import { Check, Info } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Waitlist } from "@/components/waitlist";
import { pageMetadata } from "@/lib/metadata";
import { pricing } from "@/site.config";

export const metadata = pageMetadata({
  title: "Pricing",
  description:
    "ATLAS will be subscription-only with three plans. Launch pricing is still to be confirmed; these are placeholders.",
  path: "/pricing/",
});

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: pricing.currency, maximumFractionDigits: 0 });

export default function PricingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Pricing"
        width="max-w-6xl"
        title="Three plans. Subscription only."
        intro={
          <p>
            ATLAS will be a subscription, and you&apos;ll need an account to use it. Every plan uses your own Claude or
            ChatGPT account; plans don&apos;t include AI usage.
          </p>
        }
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div
          role="note"
          aria-labelledby="pricing-note-title"
          className="flex gap-4 rounded-2xl border border-primary/30 bg-accent/60 p-5 sm:p-6"
        >
          <Info className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
          <div>
            <p id="pricing-note-title" className="font-semibold">
              Launch pricing to be confirmed.
            </p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              The plans and prices below are placeholders while real running costs are worked out. Nothing here is
              final, and nothing can be bought yet.
            </p>
          </div>
        </div>

        <ul className="mt-10 grid gap-6 lg:grid-cols-3">
          {pricing.tiers.map((tier) => (
            <li key={tier.id} className="flex flex-col rounded-3xl border border-border bg-card p-6 sm:p-8">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-sans text-xl font-semibold">{tier.name}</h2>
                <span className="rounded-full border border-dashed border-input/70 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                  Placeholder
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{tier.summary}</p>

              <p className="mt-6">
                <span className="font-heading text-5xl tracking-tight">{money.format(tier.monthly)}</span>
                <span className="text-muted-foreground"> / month</span>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">or {money.format(tier.yearly)} / year</p>
              <p className="sr-only">Placeholder price, to be confirmed.</p>

              <ul className="mt-6 space-y-3 border-t border-border pt-6 text-sm">
                {tier.includes.map((item) => (
                  <li key={item} className="flex gap-3">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        <dl className="mt-10 grid gap-6 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="font-semibold">Currency</dt>
            <dd className="mt-1 text-muted-foreground">{pricing.currencyNote}</dd>
          </div>
          <div>
            <dt className="font-semibold">Tax</dt>
            <dd className="mt-1 text-muted-foreground">{pricing.taxNote}</dd>
          </div>
          <div>
            <dt className="font-semibold">Refund promise</dt>
            <dd className="mt-1 text-muted-foreground">
              {pricing.refundPromise}: decided before anyone can pay. See the{" "}
              <Link href="/refunds/" className="underline underline-offset-4 hover:text-foreground">
                Refund Policy
              </Link>
              .
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Free trial</dt>
            <dd className="mt-1 text-muted-foreground">{pricing.trial}: decided before launch.</dd>
          </div>
        </dl>
      </div>

      <section aria-labelledby="pricing-waitlist-title" className="mx-auto mt-20 max-w-2xl px-4 sm:px-6">
        <h2 id="pricing-waitlist-title" className="text-3xl tracking-tight">
          Hear when prices are set
        </h2>
        <p className="mt-3 mb-6 text-lg text-muted-foreground">
          Join the waitlist and we&apos;ll email you when ATLAS launches, with the real prices.
        </p>
        <Waitlist />
      </section>
    </>
  );
}
