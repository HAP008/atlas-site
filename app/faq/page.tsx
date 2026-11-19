import { PageHeader } from "@/components/page-header";
import { RichText } from "@/components/rich-text";
import { faq, setup } from "@/content/faq";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "FAQ and setup",
  description:
    "Answers about ATLAS: Mac only, bring your own Claude or ChatGPT, what stays on your Mac, and how setup will work.",
  path: "/faq/",
});

export default function FaqPage() {
  return (
    <>
      <PageHeader
        eyebrow="FAQ"
        title="Questions, answered plainly."
        intro={<p>Only what we know today. Anything still undecided says so.</p>}
      />

      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        {/* Native <details>: keyboard and screen-reader friendly, and works without JavaScript. */}
        <div className="divide-y divide-border border-y border-border">
          {faq.map((item) => (
            <details key={item.id} id={item.id} className="group scroll-mt-24">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 [&::-webkit-details-marker]:hidden">
                <h2 className="font-sans text-lg font-medium">{item.question}</h2>
                <span
                  aria-hidden="true"
                  className="text-2xl leading-none text-primary transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <div className="space-y-3 pb-6 leading-relaxed text-muted-foreground">
                {item.answer.map((p, i) => (
                  <p key={i}>
                    <RichText value={p} />
                  </p>
                ))}
              </div>
            </details>
          ))}
        </div>
      </div>

      <section id="setup" aria-labelledby="setup-title" className="mx-auto mt-20 max-w-3xl scroll-mt-24 px-4 sm:px-6">
        <h2 id="setup-title" className="text-3xl tracking-tight">
          {setup.title}
        </h2>
        <p className="mt-2 text-muted-foreground">{setup.note}</p>
        <ol className="mt-8 space-y-6">
          {setup.steps.map((step, i) => (
            <li key={step.title} className="flex gap-4">
              <span
                aria-hidden="true"
                className="flex size-9 shrink-0 items-center justify-center rounded-full border border-primary/40 font-heading text-lg text-primary"
              >
                {i + 1}
              </span>
              <div>
                <h3 className="font-sans font-semibold">{step.title}</h3>
                <p className="mt-1 text-muted-foreground">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
