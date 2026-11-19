/**
 * Features page copy and media slots. Only confirmed capabilities (PROGRESS.md).
 * To add a real screenshot: put the file in /public/media/ and set `src` on its slot.
 */

import type { Media } from "@/components/media-slot";

export const features = {
  eyebrow: "Features",
  title: "Simple on the surface. Careful underneath.",
  intro:
    "Here's what ATLAS does today. Screenshots and a short demo video are coming before launch; the frames below show where they'll go.",

  demo: {
    kind: "video",
    description: "A short demo of ATLAS helping with an email, from request to approval.",
  } satisfies Media,

  sections: [
    {
      id: "mac-app",
      title: "A real Mac app",
      body: [
        "ATLAS has its own window and an icon in your menu bar, like any other Mac app.",
        "No Terminal and no code. You open it, and it's there when you need it.",
      ],
      media: {
        kind: "screenshot",
        description: "The ATLAS window and its menu-bar icon.",
      } satisfies Media,
    },
    {
      id: "own-ai",
      title: "Bring your own Claude or ChatGPT",
      body: [
        "ATLAS works with the Claude or ChatGPT account you already have. You connect it yourself.",
        "Your requests go to that provider and are handled under their terms. ATLAS plans don't include AI usage, so any cost for it is between you and them.",
      ],
      media: {
        kind: "screenshot",
        description: "Connecting a Claude or ChatGPT account.",
      } satisfies Media,
    },
    {
      id: "google-apps",
      title: "Gmail, Drive, Docs, Slides and Sheets",
      body: [
        "Connect your Google apps and ask for help with your email and files in plain words.",
        "ATLAS works with them from your Mac. We don't receive what's in them.",
      ],
      media: {
        kind: "screenshot",
        description: "The list of connected apps.",
      } satisfies Media,
    },
    {
      id: "in-charge",
      title: "You stay in charge",
      body: [
        "Before ATLAS sends, writes or deletes anything, it asks you and waits for your OK.",
        "A kill switch stops it at once. You can export your data or delete it at any time.",
      ],
      media: {
        kind: "screenshot",
        description: "ATLAS asking for approval before sending an email.",
      } satisfies Media,
    },
  ],

  honestyTitle: "ATLAS can make mistakes.",
  honesty:
    "Like any AI assistant, it can get things wrong. That's why it asks before it sends, writes or deletes: read what it's about to do before you say yes.",
} as const;
