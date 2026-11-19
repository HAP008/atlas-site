/**
 * One static page per legal draft (/privacy/, /terms/, /refunds/, /cookies/,
 * /acceptable-use/, /security/). Unknown slugs 404 at build time (dynamicParams = false).
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage } from "@/components/legal-page";
import { getLegalDoc, legalDocs } from "@/content/legal";
import { pageMetadata } from "@/lib/metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  return legalDocs.map((doc) => ({ slug: doc.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const doc = getLegalDoc((await params).slug);
  if (!doc) return {};
  return pageMetadata({ title: `${doc.title} (draft)`, description: doc.description, path: `/${doc.slug}/` });
}

export default async function LegalRoute({ params }: Props) {
  const doc = getLegalDoc((await params).slug);
  if (!doc) notFound();
  return <LegalPage doc={doc} />;
}
