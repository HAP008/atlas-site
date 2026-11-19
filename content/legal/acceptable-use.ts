/** Acceptable Use Policy draft. */

import { email, LEGAL_UPDATED } from "@/content/legal/shared";
import type { LegalDoc } from "@/content/types";

export const acceptableUse: LegalDoc = {
  slug: "acceptable-use",
  title: "Acceptable Use Policy",
  description: "What you may not do with the ATLAS website, waitlist and app.",
  updated: LEGAL_UPDATED,
  summary: [
    "Use ATLAS for lawful, everyday things. Don't use it to harm people or systems.",
    "You're responsible for what you approve ATLAS to do.",
  ],
  sections: [
    {
      id: "scope",
      heading: "What this covers",
      blocks: ["This policy applies to this website, the waitlist and, once it launches, the ATLAS app."],
    },
    {
      id: "dont",
      heading: "Please don't",
      blocks: [
        {
          list: [
            "break the law, or help anyone else break it",
            "send spam or bulk messages people didn't ask for",
            "harass, threaten, deceive or impersonate anyone",
            "access accounts, data or systems you don't have permission to use",
            "collect other people's personal data without a lawful reason",
            "create or share content that sexualises children",
            "build or spread malware, or attack or overload any system, including this website and its form",
            "get around licensing, device limits or payment",
            "add someone else's email address to the waitlist without their permission",
          ],
        },
      ],
    },
    {
      id: "ai-provider",
      heading: "Your AI provider's rules apply too",
      blocks: [
        "ATLAS uses the Claude or ChatGPT account you connect, so their usage policies apply to what you ask. Breaking them can get your account with them suspended.",
      ],
    },
    {
      id: "responsibility",
      heading: "You approve what ATLAS does",
      blocks: [
        "ATLAS asks before it sends, writes or deletes anything. When you approve an action, it's your action. Check it first.",
      ],
    },
    {
      id: "enforcement",
      heading: "If someone breaks these rules",
      blocks: [
        "We may remove them from the waitlist and, once ATLAS is on sale, suspend or end their access.",
        ["To report misuse, email ", email, "."],
      ],
    },
  ],
};
