import { ContourLines } from "@/components/contour-lines";
import { siteConfig } from "@/site.config";

export default function Home() {
  return (
    <section className="relative overflow-hidden">
      <ContourLines className="pointer-events-none absolute inset-0 h-full w-full text-contour" />
      <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <h1 className="max-w-2xl text-5xl tracking-tight">{siteConfig.tagline}</h1>
        <p id="waitlist" className="mt-6 max-w-xl text-lg text-muted-foreground">
          {siteConfig.description}
        </p>
      </div>
    </section>
  );
}
