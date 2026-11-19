/** About page copy. Facts from docs/PROJECT.md §2 only. */

import type { Paragraph } from "@/content/types";
import { siteConfig } from "@/site.config";

export const about = {
  eyebrow: "About",
  title: "Hi, I'm Huzaifa.",
  body: [
    "I'm 18, I live in Mumbai, and I'm building ATLAS on my own.",
    "The aim is simple: a Mac assistant that regular people, not just tech people, can actually use. It should feel calm, work with the apps you already have, and check with you before it does anything.",
    "It's early. The waitlist is the first step. This site will only ever say ATLAS does something once it really does.",
  ] satisfies Paragraph[],
  contactTitle: "Get in touch",
  contact: [
    "Questions, ideas or problems: email me at ",
    { text: siteConfig.contactEmail, href: `mailto:${siteConfig.contactEmail}` },
    ".",
  ] satisfies Paragraph,
} as const;
