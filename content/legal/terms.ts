/** Terms of Service draft. Liability and governing law are TBC pending a lawyer. */

import { businessDetails, email, LEGAL_UPDATED } from "@/content/legal/shared";
import type { LegalDoc } from "@/content/types";

export const terms: LegalDoc = {
  slug: "terms",
  title: "Terms of Service",
  description: "The rules for using the ATLAS website and waitlist, and, later, the ATLAS app.",
  updated: LEGAL_UPDATED,
  summary: [
    "You must be 18 or older.",
    "Joining the waitlist is free and doesn't commit you to anything.",
    "ATLAS can make mistakes. It asks before it sends, writes or deletes, and you decide whether to approve.",
    "Prices on this site are placeholders, not offers.",
  ],
  sections: [
    {
      id: "who",
      heading: "Who we are",
      blocks: ["“We” and “us” mean Huzaifa, who builds and runs ATLAS.", businessDetails],
    },
    {
      id: "agreement",
      heading: "Agreeing to these terms",
      blocks: [
        "By using this website or joining the waitlist, you agree to these terms and to our Acceptable Use Policy. If you don't agree, please don't use them.",
      ],
    },
    {
      id: "age",
      heading: "18 and over only",
      blocks: [
        "You must be 18 or older to join the waitlist or use ATLAS. By joining, you confirm that you are.",
      ],
    },
    {
      id: "waitlist",
      heading: "The waitlist",
      blocks: [
        "Joining the waitlist is free. It doesn't commit you to buying anything, and it doesn't guarantee you a place, a launch date or a price.",
        "We'll use your email address only to tell you when ATLAS launches, as described in the Privacy Policy. You can leave at any time by emailing us.",
      ],
    },
    {
      id: "atlas",
      heading: "ATLAS, once it launches",
      blocks: [
        {
          list: [
            "ATLAS will be sold as a subscription, and you'll need an account to use it.",
            "You'll need your own Claude or ChatGPT account. Your use of it is covered by that provider's terms, and any cost for it is between you and them.",
            "Plans, prices, any free trial and the refund promise will be set out clearly before you can pay. Prices shown on this site today are placeholders, not offers.",
          ],
        },
      ],
    },
    {
      id: "mistakes",
      heading: "ATLAS can make mistakes",
      blocks: [
        "ATLAS uses AI, and AI can be wrong, incomplete or out of date. ATLAS asks for your approval before it sends, writes or deletes anything. Check what it's about to do before you approve it: you're responsible for the actions you approve.",
        "Don't rely on ATLAS alone for medical, legal, financial or safety decisions.",
      ],
    },
    {
      id: "your-side",
      heading: "Your accounts and your Mac",
      blocks: [
        "ATLAS runs on your Mac and works with accounts you connect. You're responsible for keeping your Mac and those accounts secure, and for following the terms of the services you connect.",
      ],
    },
    {
      id: "ownership",
      heading: "Our work",
      blocks: [
        "This website and ATLAS are our work. Please don't copy or resell them, or try to get around licensing, device limits or payment. Open-source parts of ATLAS remain under their own licences, which will be listed with the app.",
      ],
    },
    {
      id: "availability",
      heading: "Changes and availability",
      blocks: [
        "We may change, pause or stop the website or the waitlist at any time. We provide them as they are, without promises that they'll always be available or error-free.",
      ],
    },
    {
      id: "liability",
      heading: "Limits on liability",
      blocks: [
        { fields: [{ label: "Liability terms", value: "TBC: to be written with a lawyer before ATLAS is sold" }] },
        "Nothing in these terms limits any right you have under consumer law that can't be limited.",
      ],
    },
    {
      id: "ending",
      heading: "Ending",
      blocks: [
        "You can leave the waitlist at any time. We may remove anyone who breaks these terms or the Acceptable Use Policy.",
      ],
    },
    {
      id: "law",
      heading: "Governing law",
      blocks: [{ fields: [{ label: "Governing law and courts", value: "TBC: expected to be India, to be confirmed by a lawyer" }] }],
    },
    {
      id: "changes",
      heading: "Changes to these terms",
      blocks: [
        "When we change these terms, we'll update the date at the top. Before ATLAS is sold, we'll publish full terms for subscriptions and tell everyone on the waitlist.",
      ],
    },
    {
      id: "contact",
      heading: "Contact",
      blocks: [["Questions about these terms: ", email, "."]],
    },
  ],
};
