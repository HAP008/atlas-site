import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6 sm:py-32">
      <p className="text-sm font-medium tracking-wide text-primary">404</p>
      <h1 className="mt-3 text-4xl tracking-tight sm:text-5xl">This page doesn&apos;t exist.</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        The link may be old, or the address may have a typo.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Go to the home page
        </Link>
        <Link
          href="/faq/"
          className="rounded-full border border-border px-5 py-2.5 text-sm font-medium hover:bg-muted"
        >
          Read the FAQ
        </Link>
      </div>
    </section>
  );
}
