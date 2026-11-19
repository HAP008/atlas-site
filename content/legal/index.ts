/** Registry of legal drafts. app/(legal)/[slug]/page.tsx builds one static page per entry. */

import { acceptableUse } from "@/content/legal/acceptable-use";
import { cookies } from "@/content/legal/cookies";
import { privacy } from "@/content/legal/privacy";
import { refunds } from "@/content/legal/refunds";
import { security } from "@/content/legal/security";
import { terms } from "@/content/legal/terms";
import type { LegalDoc } from "@/content/types";

export const legalDocs: LegalDoc[] = [privacy, terms, refunds, cookies, acceptableUse, security];

export function getLegalDoc(slug: string): LegalDoc | undefined {
  return legalDocs.find((doc) => doc.slug === slug);
}
