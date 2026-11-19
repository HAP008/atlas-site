/**
 * LegalPage: renders a legal draft from content/legal. The first thing inside the page
 * is always the "Draft: not yet reviewed…" notice; scripts/check-export.ts fails the
 * build check if any legal page loses it. TBC fields are visibly marked.
 */

import { AlertTriangle } from "lucide-react";
import { RichText } from "@/components/rich-text";
import type { LegalBlock, LegalDoc, Paragraph } from "@/content/types";

export const DRAFT_NOTICE = "Draft: not yet reviewed by a lawyer or accountant.";

const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

function isParagraph(block: LegalBlock): block is Paragraph {
  return typeof block === "string" || Array.isArray(block);
}

function FieldValue({ value }: { value: Paragraph }) {
  if (typeof value === "string" && value.startsWith("TBC")) {
    return (
      <span>
        <span className="mr-2 rounded-md border border-dashed border-input/70 bg-muted px-1.5 py-0.5 font-mono text-xs font-semibold">
          TBC
        </span>
        {value.replace(/^TBC:?\s*/, "")}
      </span>
    );
  }
  return <RichText value={value} />;
}

function Block({ block }: { block: LegalBlock }) {
  if (isParagraph(block)) {
    return (
      <p>
        <RichText value={block} />
      </p>
    );
  }
  if ("list" in block) {
    return (
      <ul className="list-disc space-y-1.5 pl-5 marker:text-primary/60">
        {block.list.map((item, i) => (
          <li key={i}>
            <RichText value={item} />
          </li>
        ))}
      </ul>
    );
  }
  return (
    <dl className="divide-y divide-border rounded-xl border border-border bg-card text-[0.95rem]">
      {block.fields.map((field) => (
        <div key={field.label} className="grid gap-1 px-4 py-3 sm:grid-cols-[14rem_1fr] sm:gap-4">
          <dt className="font-medium text-foreground">{field.label}</dt>
          <dd className="text-muted-foreground">
            <FieldValue value={field.value} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <article className="mx-auto max-w-3xl px-4 pt-12 sm:px-6 sm:pt-16">
      <p
        role="note"
        className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm font-medium"
      >
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden="true" />
        {DRAFT_NOTICE}
      </p>

      <h1 className="mt-8 text-4xl leading-tight tracking-tight sm:text-5xl">{doc.title}</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Last updated <time dateTime={doc.updated}>{dateFormat.format(new Date(`${doc.updated}T00:00:00Z`))}</time>
      </p>

      <section aria-labelledby="summary-title" className="mt-8 rounded-2xl bg-accent/60 px-5 py-5 sm:px-6">
        <h2 id="summary-title" className="font-sans text-base font-semibold">
          The short version
        </h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 leading-relaxed marker:text-primary/60">
          {doc.summary.map((p, i) => (
            <li key={i}>
              <RichText value={p} />
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-10 space-y-10 text-[1.0625rem] leading-relaxed">
        {doc.sections.map((section) => (
          <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`} className="scroll-mt-24">
            <h2 id={`${section.id}-title`} className="text-2xl tracking-tight">
              {section.heading}
            </h2>
            <div className="mt-3 space-y-3 text-foreground/85">
              {section.blocks.map((block, i) => (
                <Block key={i} block={block} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
