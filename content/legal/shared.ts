/**
 * Pieces shared by every legal draft. Business details are deliberately TBC:
 * never fill these with invented values (CLAUDE.md §7.6). They get real values
 * after business registration (step 2) and a lawyer/accountant review.
 */

import type { LegalBlock } from "@/content/types";
import { siteConfig } from "@/site.config";

export const LEGAL_UPDATED = "2026-11-19";

export const email = { text: siteConfig.contactEmail, href: `mailto:${siteConfig.contactEmail}` };

export const businessDetails: LegalBlock = {
  fields: [
    { label: "Operated by", value: "Huzaifa, an individual based in Mumbai, India" },
    { label: "Business name", value: "TBC" },
    { label: "Registered address", value: "TBC" },
    { label: "Registration number", value: "TBC" },
    { label: "Tax registration (GST)", value: "TBC" },
    { label: "Contact", value: [email] },
  ],
};
