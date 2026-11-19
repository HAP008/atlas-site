/**
 * Security contact page draft. Must match /.well-known/security.txt (scripts/postbuild.ts).
 * FOR THE LAWYER: the good-faith ("won't take legal action") promise and the reply-time aim.
 */

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
        [
          "If you have a GitHub account, you can instead ",
          { text: "send a private report on GitHub", href: `${siteConfig.repoUrl}/security/advisories/new` },
          ".",
        ],
        `We aim to reply within ${siteConfig.security.reportReplyDays} days. ATLAS is run by one person, so that is an aim, not a guarantee. We'll keep you updated while we fix it.`,
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
        "If you act in good faith and follow these rules, we won't take legal action against you. We can only promise that for ourselves, not for GitHub, Formspree or any other service.",
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
        `It's a static website with no accounts, no database and no server code of its own. It sets no cookies and loads nothing from other websites. The waitlist form sends your email address over HTTPS to ${siteConfig.waitlistService.name}.`,
        `The same contact details are published at ${siteConfig.siteUrl}/.well-known/security.txt.`,
      ],
    },
    {
      id: "rewards",
      heading: "Rewards",
      blocks: ["We can't pay for reports yet. If you'd like, we'll thank you by name on this page."],
    },
  ],
};
