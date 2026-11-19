/** Refund Policy draft. Window, trial and payment partner are open decisions (PROJECT.md S4–S6). */

import { businessDetails, email, LEGAL_UPDATED } from "@/content/legal/shared";
import type { LegalDoc } from "@/content/types";

export const refunds: LegalDoc = {
  slug: "refunds",
  title: "Refund Policy",
  description: "Nothing is for sale yet. How refunds will work for ATLAS subscriptions, with open details marked TBC.",
  updated: LEGAL_UPDATED,
  summary: [
    "Nothing is for sale yet, so there's nothing to refund today.",
    "The refund promise will be set and published here before anyone can pay.",
  ],
  sections: [
    {
      id: "decided",
      heading: "What's decided",
      blocks: [
        {
          list: [
            "ATLAS will be sold as a subscription only.",
            "Payments will be handled by a payment partner that takes care of checkout, tax and invoices. Refunds will go back to your original payment method through that partner.",
            "Your ATLAS data lives on your Mac, so cancelling or getting a refund doesn't delete it.",
          ],
        },
      ],
    },
    {
      id: "tbc",
      heading: "Still to be confirmed",
      blocks: [
        {
          fields: [
            { label: "Refund window", value: "TBC" },
            { label: "Free trial or money-back guarantee", value: "TBC" },
            { label: "What happens to the rest of a billing period when you cancel", value: "TBC" },
            { label: "Payment partner", value: "TBC" },
          ],
        },
      ],
    },
    {
      id: "how",
      heading: "How to ask for a refund",
      blocks: [["Once ATLAS is on sale, email ", email, " with the email address you signed up with. We'll reply with next steps."]],
    },
    {
      id: "rights",
      heading: "Your rights",
      blocks: [
        "Nothing in this policy limits your rights under the consumer law where you live, including India's Consumer Protection Act, 2019.",
      ],
    },
    { id: "who", heading: "Who we are", blocks: [businessDetails] },
  ],
};
