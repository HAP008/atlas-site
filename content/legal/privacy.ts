/**
 * Privacy Policy draft. Must match what the code actually does:
 * - no cookies, analytics, trackers or browser storage (checked by tests/source-rules + check-export)
 * - the waitlist form sends only email + 18+ confirmation, without cookies (lib/waitlist.ts)
 * - Formspree stores submissions and emails a copy to our Gmail inbox
 * - GitHub Pages logs visitor IP addresses for security (GitHub docs, checked 2026-11-19)
 */

import { businessDetails, email, LEGAL_UPDATED } from "@/content/legal/shared";
import type { LegalDoc } from "@/content/types";
import { siteConfig } from "@/site.config";

const days = siteConfig.deletionDays;
const formService = { text: `${siteConfig.waitlistService.name}'s privacy policy`, href: siteConfig.waitlistService.privacyUrl };
const host = { text: "GitHub's privacy statement", href: siteConfig.host.privacyUrl };

export const privacy: LegalDoc = {
  slug: "privacy",
  title: "Privacy Policy",
  description: "What the ATLAS website collects, why, who receives it, and your rights under India's DPDP Act.",
  updated: LEGAL_UPDATED,
  summary: [
    "This website sets no cookies and runs no analytics or trackers.",
    "If you join the waitlist, we keep your email address only to tell you when ATLAS launches.",
    "ATLAS, the Mac app, runs on your Mac and we don't receive your data. What you ask it goes to the AI provider you connect, under their terms.",
    `You can ask us to delete your data at any time. We'll do it within ${days} days.`,
  ],
  sections: [
    {
      id: "who",
      heading: "Who we are",
      blocks: [
        "ATLAS is built by Huzaifa, an individual based in Mumbai, India. On this page, “we” and “us” mean Huzaifa. Business details will be added once the business is registered.",
        businessDetails,
      ],
    },
    {
      id: "what",
      heading: "What we collect",
      blocks: [
        "When you join the waitlist:",
        {
          list: [
            "your email address",
            "your confirmation that you're 18 or older",
            `technical details your browser sends with any web request, such as your IP address, browser type, the page you came from and the time. These are recorded by our form service, ${siteConfig.waitlistService.name}, not by us`,
          ],
        },
        "When you email us: your email address and whatever you write, kept in our email inbox.",
        [
          `When you visit this website: we collect nothing ourselves. Our host, ${siteConfig.host.name} (run by GitHub, Inc.), logs visitors' IP addresses for security purposes. We can't see or change those logs. See `,
          host,
          ".",
        ],
        "The website's fonts are served from the website itself, so your browser doesn't contact Google or any other font service.",
      ],
    },
    {
      id: "why",
      heading: "Why we use it",
      blocks: [
        "We use your waitlist email address for one thing: to tell you when ATLAS launches. We don't use it for advertising, we don't send newsletters, and we never sell or rent it.",
        "If you email us, we use what you send only to reply to you.",
      ],
    },
    {
      id: "consent",
      heading: "Your consent",
      blocks: [
        "Under India's Digital Personal Data Protection Act, 2023 (the DPDP Act), we rely on your consent. You give it by submitting the waitlist form after seeing the link to this policy.",
        ["You can withdraw consent at any time by emailing ", email, ". It's as easy as giving it. Withdrawing doesn't undo anything that happened before."],
      ],
    },
    {
      id: "who-receives",
      heading: "Who receives your data",
      blocks: [
        "We use these services to run the waitlist and website. Each handles data under its own privacy policy:",
        {
          list: [
            [
              `${siteConfig.waitlistService.name} (form service, based in the United States) receives the waitlist form, stores your submission and emails a copy to our inbox. See `,
              formService,
              ".",
            ],
            "Google (Gmail) hosts our email inbox, which holds the copy of your submission and any email you send us.",
            [`GitHub (${siteConfig.host.name}) hosts the website and logs IP addresses. See `, host, "."],
          ],
        },
        "Nobody else receives your data. We don't sell it, rent it or share it for advertising.",
      ],
    },
    {
      id: "where",
      heading: "Where it's stored",
      blocks: [
        "These services may store and process your data outside India, including in the United States.",
      ],
    },
    {
      id: "how-long",
      heading: "How long we keep it",
      blocks: [
        `${siteConfig.waitlistService.name} emails each sign-up to our inbox. We delete it from ${siteConfig.waitlistService.name} within ${days} days of it arriving, so the copy in our inbox is the only one we keep. ${siteConfig.waitlistService.name} may keep its own technical logs under its privacy policy.`,
        `We keep your waitlist email address until we've sent the launch announcement, then delete it within ${days} days. If you ask us to delete it sooner, we do that within ${days} days of your request. Deleting includes emptying it from our email trash.`,
        "We keep emails you send us for as long as we need them to help you, then delete them.",
      ],
    },
    {
      id: "rights",
      heading: "Your rights",
      blocks: [
        "Under the DPDP Act you can:",
        {
          list: [
            "ask what personal data we hold about you and who we've shared it with",
            "ask us to correct or update it",
            `ask us to delete it (we do this within ${days} days)`,
            "withdraw your consent",
            "name someone to use these rights for you if you die or become unable to",
            "complain to us about how we handle your data",
          ],
        },
        ["To do any of these, email ", email, ". We'll reply as soon as we can, and always within the time the law requires."],
        "If you're not happy with our answer, you can complain to the Data Protection Board of India.",
      ],
    },
    {
      id: "outside-india",
      heading: "If you live outside India",
      blocks: [
        "A review of this policy under the EU and UK GDPR and other countries' privacy laws is still pending. Until it's done, the rights above apply to everyone, wherever you live.",
      ],
    },
    {
      id: "age",
      heading: "18 and over only",
      blocks: [
        "The waitlist and ATLAS are for people aged 18 or older. We don't knowingly collect data from anyone under 18. If we learn we have, we delete it.",
      ],
    },
    {
      id: "security",
      heading: "Keeping it safe",
      blocks: [
        `The waitlist form sends your details straight from your browser to our form service over an encrypted (HTTPS) connection, and tells your browser not to send cookies with them. If JavaScript is switched off or hasn't loaded yet, the form takes you to ${siteConfig.waitlistService.name}'s own website to finish, and ${siteConfig.waitlistService.name}'s privacy and cookie rules apply there.`,
        `This website has no database or server of its own, and it never writes your email address to logs. Every page tells your browser to run scripts and load fonts and images only from this website, and to send form data only to ${siteConfig.waitlistService.name}.`,
        "No system is perfectly secure. If something goes wrong that affects your data, we'll tell you and the authorities as the law requires.",
      ],
    },
    {
      id: "app",
      heading: "The ATLAS app",
      blocks: [
        "ATLAS runs on your own Mac. We don't receive your data: not your email, files or conversations.",
        "What you ask ATLAS, and anything it needs to answer (for example, the text of an email you ask about), goes to the AI provider you connect: Anthropic for Claude, or OpenAI for ChatGPT. They handle it under their own terms and privacy policies. When ATLAS works with Gmail, Drive, Docs, Slides or Sheets, it connects to Google from your Mac.",
        "Accounts and payments will need some data, such as your email address, your plan and your licence status. We'll update this policy before that starts and tell everyone on the waitlist.",
      ],
    },
    {
      id: "changes",
      heading: "Changes to this policy",
      blocks: [
        "When we change this policy, we'll update the date at the top. If a change affects how we use your data, we'll email the waitlist before it takes effect.",
      ],
    },
    {
      id: "contact",
      heading: "Contact",
      blocks: [["Questions about privacy: ", email, "."]],
    },
  ],
};
