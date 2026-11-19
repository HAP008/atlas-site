import Link from "next/link";
import { MediaSlot } from "@/components/media-slot";
import { PageHeader } from "@/components/page-header";
import { features } from "@/content/features";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Features",
  description:
    "ATLAS is a Mac app that works with your own Claude or ChatGPT account and your Gmail, Drive, Docs, Slides and Sheets, and asks before it acts.",
  path: "/features/",
});

export default function FeaturesPage() {
  return (
    <>
      <PageHeader eyebrow={features.eyebrow} title={features.title} intro={<p>{features.intro}</p>} />

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <MediaSlot media={features.demo} className="aspect-video" />
      </div>

      <div className="mx-auto mt-20 max-w-5xl space-y-20 px-4 sm:space-y-28 sm:px-6">
        {features.sections.map((section, i) => (
          <section
            key={section.id}
            id={section.id}
            aria-labelledby={`${section.id}-title`}
            className="grid scroll-mt-24 items-center gap-8 md:grid-cols-2 md:gap-12"
          >
            <div className={i % 2 === 1 ? "md:order-2" : undefined}>
              <h2 id={`${section.id}-title`} className="text-3xl tracking-tight">
                {section.title}
              </h2>
              <div className="mt-4 space-y-3 text-lg leading-relaxed text-muted-foreground">
                {section.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
            <MediaSlot media={section.media} />
          </section>
        ))}
      </div>

      <section className="mx-auto mt-24 max-w-3xl px-4 sm:px-6" aria-labelledby="honesty-title">
        <div className="rounded-3xl border border-border bg-card px-6 py-10 sm:px-10">
          <h2 id="honesty-title" className="text-2xl tracking-tight">
            {features.honestyTitle}
          </h2>
          <p className="mt-3 text-lg leading-relaxed text-muted-foreground">{features.honesty}</p>
          <Link
            href="/#waitlist"
            className="mt-6 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Join the waitlist
          </Link>
        </div>
      </section>
    </>
  );
}
