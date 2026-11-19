import { PageHeader } from "@/components/page-header";
import { RichText } from "@/components/rich-text";
import { about } from "@/content/about";
import { pageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/site.config";

export const metadata = pageMetadata({
  title: "About",
  description: "ATLAS is built by Huzaifa, 18, in Mumbai. How to get in touch.",
  path: "/about/",
});

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow={about.eyebrow} title={about.title} />
      <div className="mx-auto max-w-3xl space-y-5 px-4 text-lg leading-relaxed sm:px-6">
        {about.body.map((p, i) => (
          <p key={i}>
            <RichText value={p} />
          </p>
        ))}
      </div>

      <section aria-labelledby="contact-title" className="mx-auto mt-14 max-w-3xl px-4 sm:px-6">
        <div className="rounded-3xl bg-accent/60 px-6 py-8 sm:px-10">
          <h2 id="contact-title" className="text-2xl tracking-tight">
            {about.contactTitle}
          </h2>
          <p className="mt-3 text-lg">
            <RichText value={about.contact} />
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            As plain text: <span className="font-mono [overflow-wrap:anywhere] text-foreground">{siteConfig.contactEmail}</span>
          </p>
        </div>
      </section>
    </>
  );
}
