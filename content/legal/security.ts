/** Security contact page draft. The good-faith promise needs lawyer review before launch. */

import { email, LEGAL_UPDATED } from "@/content/legal/shared";
import type { LegalDoc } from "@/content/types";
import { siteConfig } from "@/site.config";

export const security: LegalDoc = {
  slug: "security",
  title: "Security",
  description: "How to report a security problem with the ATLAS website or app.",
  updated: LEGAL_UPDATED,
  summary: [
    ["Found a security problem? Email ", email, " with “Security” in the subject line."],
  ],
  sections: [
    {
      id: "report",
      heading: "How to report",
      blocks: [
        ["Email ", email, " with “Security” in the subject. Please include:"],
        {
          list: [
            "what you found and where",
            "steps to reproduce it",
            "what someone could do with it",
          ],
        },
        "We aim to reply within 7 days. We'll keep you updated while we fix it.",
      ],
    },
    {
      id: "rules",
      heading: "Please",
      blocks: [
        {
          list: [
            "don't access, change or delete other people's data",
            "don't overload the site or form, or try denial-of-service attacks",
            "don't try to trick people (phishing or social engineering)",
            "give us reasonable time to fix the problem before telling anyone else",
          ],
        },
        "If you act in good faith and follow these rules, we won't take legal action against you.",
      ],
    },
    {
      id: "scope",
      heading: "What's in scope",
      blocks: [
        {
          list: [
            `this website (${siteConfig.siteUrl}/) and its waitlist form`,
            "the ATLAS Mac app, once it's released",
          ],
        },
        `Problems with ${siteConfig.host.name} or ${siteConfig.waitlistService.name} themselves should go to them directly.`,
      ],
    },
    {
      id: "how-built",
      heading: "How this site is built",
      blocks: [
        `It's a static website with no accounts, no database and no server code of its own. It sets no cookies. The waitlist form sends your email address over HTTPS to ${siteConfig.waitlistService.name}.`,
      ],
    },
    {
      id: "rewards",
      heading: "Rewards",
      blocks: ["We can't pay for reports yet. If you'd like, we'll thank you by name on this page."],
    },
  ],
};
