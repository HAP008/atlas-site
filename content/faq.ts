/**
 * FAQ and "how it will set up". Answers only from facts in docs/PROJECT.md and the
 * shipped list in PROGRESS.md. Unknowns are stated as "to be confirmed", never guessed.
 */

import type { Paragraph } from "@/content/types";
import { siteConfig } from "@/site.config";

export type FaqItem = { id: string; question: string; answer: Paragraph[] };

export const setup = {
  title: "How setup will work",
  note: "This is the planned setup. Details may change before launch.",
  steps: [
    { title: "Join the waitlist", body: "We'll email you when ATLAS launches." },
    {
      title: "Create an account and choose a plan",
      body: "ATLAS is subscription-only, and you'll need an account to use it.",
    },
    { title: "Open ATLAS on your Mac", body: "It's a normal Mac app with its own window and menu-bar icon. No Terminal needed." },
    { title: "Connect Claude or ChatGPT", body: "Sign in with the AI account you already have." },
    {
      title: "Connect your apps",
      body: "Choose which of Gmail, Drive, Docs, Slides and Sheets ATLAS can help with.",
    },
    {
      title: "Ask in plain words",
      body: "Before ATLAS sends, writes or deletes anything, it asks you first.",
    },
  ],
} as const;

export const faq: FaqItem[] = [
  {
    id: "what",
    question: "What is ATLAS?",
    answer: [
      "A personal assistant that runs as an app on your Mac. It works with your Gmail, Drive, Docs, Slides and Sheets, using the Claude or ChatGPT account you already have, and it asks before it acts.",
    ],
  },
  {
    id: "who",
    question: "Who is it for?",
    answer: [
      "Everyday Mac users, not just tech people. It's meant to be simple, calm and easy on the eyes.",
    ],
  },
  {
    id: "mac-only",
    question: "Does it work on Windows, iPhone or iPad?",
    answer: [
      "No. ATLAS is Mac only. The minimum macOS version, and whether both Apple silicon and Intel Macs are supported, will be confirmed before launch.",
    ],
  },
  {
    id: "own-ai",
    question: "Do I need my own Claude or ChatGPT account?",
    answer: [
      "Yes. You connect your own Claude or ChatGPT account. ATLAS plans don't include AI usage, so any cost for it is between you and your AI provider.",
    ],
  },
  {
    id: "local",
    question: "What runs on my Mac, and what leaves it?",
    answer: [
      "ATLAS runs on your Mac, and we don't receive your data: not your email, your files or your conversations.",
      "What you ask ATLAS, and anything it needs to answer (for example, the text of an email you ask about), goes to the AI provider you connect: Anthropic for Claude, or OpenAI for ChatGPT. They handle it under their own terms. When ATLAS works with Gmail or Drive, it talks to Google from your Mac.",
    ],
  },
  {
    id: "asks-first",
    question: "Will ATLAS do things without asking me?",
    answer: [
      "No. Before it sends, writes or deletes anything, it asks you and waits for your OK. A kill switch stops it at once.",
    ],
  },
  {
    id: "mistakes",
    question: "Can ATLAS make mistakes?",
    answer: [
      "Yes. Like any AI assistant, it can get things wrong. Read what it's about to do before you approve it.",
    ],
  },
  {
    id: "data-control",
    question: "Can I export or delete my data?",
    answer: ["Yes. Export and delete are always available in the app, and so is the kill switch."],
  },
  {
    id: "price",
    question: "How much will it cost?",
    answer: [
      [
        "ATLAS will be subscription-only, with three plans. Launch pricing is still to be confirmed. ",
        { text: "See the placeholder plans", href: "/pricing/" },
        ".",
      ],
    ],
  },
  {
    id: "trial-refund",
    question: "Will there be a free trial or a refund promise?",
    answer: [
      [
        "That's still being decided and will be set before anyone can pay. ",
        { text: "The Refund Policy", href: "/refunds/" },
        " will say exactly what you can expect.",
      ],
    ],
  },
  {
    id: "launch",
    question: "When does ATLAS launch?",
    answer: [
      [
        "There's no date yet. ",
        { text: "Join the waitlist", href: "/#waitlist" },
        " and we'll email you when it's ready.",
      ],
    ],
  },
  {
    id: "age",
    question: "Why 18 and over only?",
    answer: ["ATLAS is for adults. The waitlist asks you to confirm you're 18 or older, and so will the Terms."],
  },
  {
    id: "who-makes",
    question: "Who makes ATLAS?",
    answer: [
      [
        "Huzaifa, 18, in Mumbai. ATLAS is a one-person project. ",
        { text: "More about that", href: "/about/" },
        ".",
      ],
    ],
  },
  {
    id: "contact",
    question: "How do I get in touch?",
    answer: [
      [
        "Email ",
        { text: siteConfig.contactEmail, href: `mailto:${siteConfig.contactEmail}` },
        ". Questions, ideas and problems are all welcome.",
      ],
    ],
  },
];
