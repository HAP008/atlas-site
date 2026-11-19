/**
 * site.config.ts: the single source for site-wide facts.
 *
 * Read by: next.config.ts (base path), the root layout (metadata), sitemap/robots,
 * the header/footer, the pricing page and the waitlist form.
 * If this is wrong: every asset and link 404s on GitHub Pages (base path), or
 * social cards and the sitemap point at the wrong host (site URL).
 *
 * Moving to a real domain is the one-line change marked below. The base path is
 * derived from SITE_URL, so "https://example.com" gives a base path of "".
 * A build can also override it with the NEXT_PUBLIC_SITE_URL env var, so the same
 * code can deploy to a second host during a move (and to localhost for header tests).
 */

const DEFAULT_SITE_URL = "https://hap008.github.io/atlas-site"; // ← the one line to change for a real domain

function resolveSiteUrl(): string {
  // Read literally so Next inlines the same value into server and browser code.
  const override = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!override) return DEFAULT_SITE_URL;
  const url = new URL(override); // throws on a malformed value, which fails the build
  const isLocal = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  // A localhost site URL is only for local header tests and needs an explicit opt-in.
  const allowLocal = process.env.NEXT_PUBLIC_ALLOW_LOCAL_BUILD === "1";
  if (url.protocol !== "https:" && !(isLocal && allowLocal)) {
    throw new Error("NEXT_PUBLIC_SITE_URL must use https (or localhost with NEXT_PUBLIC_ALLOW_LOCAL_BUILD=1).");
  }
  return override.replace(/\/+$/, "");
}

const SITE_URL = resolveSiteUrl();

function basePathFrom(url: string): string {
  const path = new URL(url).pathname.replace(/\/+$/, "");
  return path === "/" ? "" : path;
}

export const siteConfig = {
  name: "ATLAS",
  tagline: "A personal assistant that lives on your Mac.",
  description:
    "ATLAS is a calm, simple assistant for your Mac. It works with your Gmail, Drive, Docs, Slides and Sheets using the Claude or ChatGPT account you already have, and it asks before it acts.",
  contactEmail: "huzaifapardiwala@gmail.com",
  siteUrl: SITE_URL,
  basePath: basePathFrom(SITE_URL),
  locale: "en",
  /** Public source repository. Its private "Report a vulnerability" form is a second security contact. */
  repoUrl: "https://github.com/HAP008/atlas-site",
  /** Name of the build-time env var holding the waitlist form endpoint. Read literally in lib/waitlist-endpoint.ts. */
  waitlistEndpointEnvVar: "NEXT_PUBLIC_WAITLIST_ENDPOINT",
  /** The form service, named in the Privacy Policy. Update together with the endpoint. */
  waitlistService: {
    name: "Formspree",
    /** The only host the waitlist endpoint may use (enforced at build in lib/waitlist-endpoint.ts). */
    host: "formspree.io",
    privacyUrl: "https://formspree.io/legal/privacy-policy/",
  },
  host: {
    name: "GitHub Pages",
    privacyUrl:
      "https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement",
  },
  /** Days within which we act on a deletion request. Stated in Privacy. */
  deletionDays: 30,
  /** Read by scripts/postbuild.ts when it writes the response headers and security.txt. */
  security: {
    /**
     * HSTS, sent from _headers once the site is on its own domain. Ramp it up, because browsers
     * remember it for the whole max-age: start at one day, then a week, then a year
     * (31_536_000) once everything on the domain is known to work over HTTPS. Turn on
     * includeSubDomains only after checking every subdomain. `preload` is never sent from here:
     * that is a separate, hard-to-undo decision for the owner.
     * scripts/verify-live-headers.sh passes only at one year with includeSubDomains.
     */
    hsts: { maxAgeSeconds: 86_400, includeSubDomains: false },
    /** security.txt is stamped at build time to expire this many days later (must be under a year). */
    securityTxtValidDays: 300,
    /** Days within which we aim to reply to a security report. Stated on the Security page. */
    reportReplyDays: 7,
  },
} as const;

/**
 * PLACEHOLDER pricing. Nothing here is final until step 2 (merchant of record,
 * cost estimates, decisions S2–S5 in docs/PROJECT.md §10).
 * The pricing page renders these with a visible "launch pricing to be confirmed" note.
 */
export const pricing = {
  status: "PLACEHOLDER",
  currency: "USD",
  currencyNote: "Shown in US dollars for now. Prices in Indian rupees: to be confirmed.",
  taxNote:
    "Whether prices include tax is to be confirmed. Depending on where you live, tax such as GST or VAT may be added at checkout.",
  refundPromise: "TBC",
  trial: "TBC",
  tiers: [
    {
      id: "personal",
      name: "Personal",
      monthly: 9,
      yearly: 90,
      summary: "For one person on one Mac.",
      includes: [
        "The ATLAS Mac app, with its own window and menu-bar icon",
        "Use your own Claude or ChatGPT account",
        "Connect Gmail, Drive, Docs, Slides and Sheets",
        "Asks before it sends, writes or deletes",
        "1 Mac",
      ],
    },
    {
      id: "plus",
      name: "Plus",
      monthly: 15,
      yearly: 150,
      summary: "For people who use more than one Mac.",
      includes: ["Everything in Personal", "Up to 2 Macs", "Email support"],
    },
    {
      id: "pro",
      name: "Pro",
      monthly: 25,
      yearly: 250,
      summary: "For heavy daily use.",
      includes: ["Everything in Plus", "Up to 3 Macs", "Priority email support"],
    },
  ],
} as const;

export type PricingTier = (typeof pricing.tiers)[number];
