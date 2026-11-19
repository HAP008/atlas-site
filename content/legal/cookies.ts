/**
 * Cookie Notice draft. True only while the site has no cookies, analytics, trackers or
 * browser storage. tests/source-rules.test.ts and scripts/check-export.ts guard that.
 * Adding any of those needs a consent flow and a logged decision first (CLAUDE.md §7.2).
 */

import { email, LEGAL_UPDATED } from "@/content/legal/shared";
import type { LegalDoc } from "@/content/types";
import { siteConfig } from "@/site.config";

export const cookies: LegalDoc = {
  slug: "cookies",
  title: "Cookie Notice",
  description: "The ATLAS website uses no cookies, analytics, trackers or third-party scripts.",
  updated: LEGAL_UPDATED,
  summary: ["This website uses no cookies. No analytics, no advertising, no trackers."],
  sections: [
    {
      id: "none",
      heading: "What this site stores on your device",
      blocks: [
        "Nothing. The site sets no cookies and doesn't use your browser's local storage or similar features.",
        "It loads no third-party scripts. Its fonts are served from the site itself.",
      ],
    },
    {
      id: "host",
      heading: "Our host",
      blocks: [
        [
          `${siteConfig.host.name} hosts this site and logs visitors' IP addresses for security purposes. That isn't a cookie, and we can't see those logs. See `,
          { text: "GitHub's privacy statement", href: siteConfig.host.privacyUrl },
          ".",
        ],
      ],
    },
    {
      id: "form",
      heading: "The waitlist form",
      blocks: [
        `When you submit the waitlist form, your browser sends your details to our form service, ${siteConfig.waitlistService.name}. The form tells your browser not to send cookies with that request.`,
      ],
    },
    {
      id: "changes",
      heading: "If this changes",
      blocks: [
        "If we ever add cookies or analytics, we'll ask for your consent first, keep anything optional switched off until you agree, and update this notice.",
      ],
    },
    { id: "contact", heading: "Contact", blocks: [["Questions: ", email, "."]] },
  ],
};
