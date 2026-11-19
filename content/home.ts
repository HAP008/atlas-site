/**
 * Home page copy. Capabilities here must match "Shipped features" in PROGRESS.md
 * (confirmed by Huzaifa on 2026-11-19). Don't add a capability that isn't listed there.
 */

import type { Paragraph } from "@/content/types";

export const home = {
  eyebrow: "A Mac app for everyday people",
  title: "A personal assistant that lives on your Mac.",
  lead: "ATLAS works with your Gmail, Drive, Docs, Slides and Sheets, using the Claude or ChatGPT account you already have. It's made for regular people, not just tech people, and it always asks before it acts.",
  facts: ["Mac only", "18+", "Launch date to be announced"],

  capabilitiesTitle: "What ATLAS does",
  capabilities: [
    {
      icon: "plug",
      title: "Works with the AI you already have",
      body: "Connect your own Claude or ChatGPT account. ATLAS plans don't include AI usage, so any cost for that is between you and your AI provider.",
    },
    {
      icon: "inbox",
      title: "Your Google apps in one place",
      body: "Connect Gmail, Drive, Docs, Slides and Sheets, then ask for help with your email and files in plain words.",
    },
    {
      icon: "shield",
      title: "Asks before it acts",
      body: "ATLAS checks with you before it sends, writes or deletes anything. A kill switch stops it at once, and you can export or delete your data whenever you like.",
    },
  ],

  // The heading names both halves, per CLAUDE.md §7.5: local data, and requests that go to the AI provider.
  privacyTitle: "What stays on your Mac, and what doesn't.",
  privacy: [
    "ATLAS runs on your own Mac, and we don't receive your data: not your email, your files or your conversations.",
    "One thing does leave your Mac. What you ask ATLAS, and anything it needs to answer (for example, the text of an email you ask about), goes to the AI provider you connect: Anthropic for Claude, or OpenAI for ChatGPT. They handle it under their own terms.",
  ] satisfies Paragraph[],
  privacyLink: { text: "Read the Privacy Policy", href: "/privacy/" },

  closingTitle: "Want the details first?",
  closingLinks: [
    { text: "See the features", href: "/features/" },
    { text: "Read how setup will work", href: "/faq/#setup" },
  ],
} as const;

export const heroIllustration = {
  caption: "Illustration, not a screenshot. Real screenshots are coming before launch.",
  label:
    "Illustration of ATLAS on a Mac: a small window under the menu bar shows a request to reply to an email, a drafted reply, and a question asking whether to send it, with Not now and Send buttons.",
  request: "Reply to Sam and say Thursday works.",
  draftIntro: "Here's a reply to Sam:",
  draft: "Hi Sam, Thursday works for me. See you then.",
  question: "Send this email?",
  decline: "Not now",
  confirm: "Send",
} as const;
