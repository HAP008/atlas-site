# ATLAS SITE — PROJECT FACTS, STATE AND DECISIONS

> Update §9, §10 and §11 after every session from the STATE UPDATE block. Append-only for §11.

---

## 1. MISSION

A public site that explains ATLAS to regular, non-technical Mac users, takes waitlist signups now, and later sells subscriptions and delivers the signed Mac app.

## 2. OWNER

- Huzaifa, 18, Mumbai, India. Solo. Between high school and university (FLAME University, Pune).
- Priorities, in order: (1) a fully functional source of income, (2) learning Claude Code agents and automation and building them into the business, (3) learning financial markets.
- Working style: direct feedback, specific over general, decisions made and acted on, large actionable outputs, no preamble.

## 3. THE PRODUCT (what the site may talk about)

ATLAS is a personal AI assistant that runs as a Mac app, with its own window and a menu-bar icon, runnable without Terminal. Aimed at regular people, so it must be simple and easy on the eyes, and connecting apps must be very easy.

Facts the site may state **only when true at the time of writing** (check `PROGRESS.md` and the app repo before making any claim):

- Runs on the customer's own Mac. We don't receive their data.
- Works with the customer's own Claude (or ChatGPT) access; they connect it themselves.
- Connects to apps such as Gmail, Drive, Docs, Slides and Sheets, plus Apple apps and Microsoft 365/Outlook as they ship.
- Acts only with the user's approval for anything that writes, sends or deletes. A kill switch, data export and delete always work.
- Subscription-only with sign-in/account creation and multiple tiers.

Planned but **not shippable claims yet** (do not put on the site as available): 24/7 "always on" and calling the owner, local Qwen ~4B model option, Telegram phone relay, Cloud tier, features listed as "approved" but not built (ask-from-anywhere hotkey, rewrite anywhere, reminders/tasks, end-of-day recap, spending cap, smart file finder, chat with a document, routines, undo panel). Use "coming" language only if Huzaifa approves the wording.

## 4. SITE REQUIREMENTS (step 1)

Pages: Home, Features, Pricing, FAQ + how it will set up, About, Changelog, Privacy Policy, Terms of Service, Refund Policy, Cookie Notice, Acceptable Use, Security contact, 404. Plus robots, sitemap, favicon, social preview image. Waitlist form on Home (and Pricing). Download page, sign-up/sign-in, account, support/status pages are **later steps**.

## 5. WAITLIST FORM SPEC

Email, 18+ confirmation, links to Privacy and Terms, honeypot, no page reload, clear success/error/not-connected states, no email ever logged. Endpoint URL from env var `NEXT_PUBLIC_WAITLIST_ENDPOINT` (it is public by nature in a static site; treat the form service as the privacy boundary and name it in the Privacy Policy).

## 6. PRICING (placeholder until step 2)

Three tiers, subscription-only, monthly and yearly, currency and tax note, refund promise slot. All numbers are `PLACEHOLDER`. Real prices need monthly cost estimates first (hosting, sign-in, storage, email, monitoring, Apple Developer $99/yr, merchant-of-record fees, and any AI cost with a hard per-account cap). Not priced yet.

## 7. LEGAL POSTURE

Drafts only. India's DPDP Act named in Privacy; GDPR review pending; lawyer and accountant review before taking money. No invented entity, address or registration. Trademark check on the name "ATLAS" is still to do. Open-source licence list/NOTICES file belongs to the app repo.

## 8. HOSTING AND COSTS (now)

Free github.io. No domain yet (decided to postpone). Form service: free tier, TBD. Total spend at step 1: ₹0 / $0 (verify the chosen form service's free limits).

---

## 9. CURRENT STATE

- **STEP:** 1, ~90%: everything built, reviewed and live at https://hap008.github.io/atlas-site/; waitlist form not yet connected to a real endpoint
- **BUILT:** foundation, Home, Features, Pricing (placeholder), FAQ + setup, About, Changelog, six draft legal pages, waitlist form (all states tested against a stub), GitHub Pages deploy with lint/types/tests/audit/export checks in CI
- **BROKEN / KNOWN ISSUES:** waitlist shows "not connected yet" until S1 is confirmed and the endpoint variable is set; robots.txt and sitemap sit under /atlas-site/ where crawlers don't look (fixed by a real domain); no CSP or security headers possible on GitHub Pages; hap008.github.io origin is shared with six other Pages repos on the account
- **NEXT ACTION:** confirm S1 (Formspree), create the form, set the repo variable NEXT_PUBLIC_WAITLIST_ENDPOINT, redeploy, submit one real test sign-up
- **BLOCKED ON:** Huzaifa: S1 confirmation and Formspree account. Real screenshots/video (S10) before launch.

## 10. OPEN DECISIONS

| ID | Decision | Options | Recommendation | Status |
|---|---|---|---|---|
| S1 | Waitlist form service | Formspree (verified 2026-11-19 on formspree.io/plans: free = 50 submissions/month, 30-day dashboard view, `_gotcha` honeypot, ML spam filter, restrict-to-domain; next tier $10/mo billed yearly or $15/mo monthly) / Web3Forms (its site blocks automated checks; free limits unverified) / mailto only | Formspree: verified limits and a plain JSON endpoint that fits one env var. Trade-off: 50/month cap. Wired and tested against a stub; build only accepts formspree.io | PROPOSED, awaiting Huzaifa |
| S2 | Tier names and contents | 3 tiers | Decide when features are real; ship placeholders now | OPEN |
| S3 | Prices and currency | INR + USD / USD only | Decide at step 2 after cost estimates | OPEN |
| S4 | Refund window | e.g. 7 / 14 / 30 days | Decide at step 2 with the merchant of record's rules | OPEN |
| S5 | Free trial vs money-back | Trial / guarantee | Decide at step 2 | OPEN |
| S6 | Merchant of record | Paddle, Lemon Squeezy, Dodo Payments, Polar, Whop | Verify India seller terms, fees and payout first | OPEN (step 2) |
| S7 | Domain | Buy now / later | Must buy before launch (accounts, email, trust) | OPEN (step 2) |
| S8 | Business registration and tax | — | Ask an accountant before taking money | OPEN (step 2) |
| S9 | Trademark check on "ATLAS" | — | Before spending on branding | OPEN |
| S10 | Real screenshots and demo video | — | Needed before launch; slots exist | OPEN |

## 11. DECISION LOG

Append-only. Format: `DATE | DECISION | WHY`

```
2026-11-18 | Launch the local Mac app first; Cloud ("always on") is a separate later product | Cloud breaks the "your data stays on your Mac" promise, most features need a Mac, and it adds per-customer monthly cost
2026-11-18 | Phone relay (no customer data on our servers) comes before any Cloud tier | Gets most of the "always on" benefit with far less legal and security load
2026-11-18 | Site repo is separate from the app repo; no app code, keys or licence logic here | Keeps secrets out of a possibly public repo
2026-11-18 | Free github.io hosting, no custom domain yet | Owner postponed buying a domain; Google verification deferred
2026-11-18 | Static export only, no backend of our own at step 1 | Nothing to secure or pay for; waitlist uses a hosted form endpoint
2026-11-18 | Public contact email is huzaifapardiwala@gmail.com for now | No domain email until step 2
2026-11-18 | Subscription-only, sign-in required, multiple tiers | Owner's business model
2026-11-18 | Merchant of record (not direct Stripe/Razorpay) for payments at step 4 | Handles tax, invoices and chargebacks for a solo seller; provider choice still open
2026-11-18 | 18+ only | Owner and checklist rule; enforced on form and Terms
2026-11-18 | No cookies, analytics or trackers at step 1 | Keeps Cookie Notice honest; analytics only later, after consent, off by default
2026-11-18 | Legal pages ship as marked drafts | Not yet reviewed by a lawyer or accountant
2026-11-18 | Customers bring their own AI access | Owner's current model; any included-AI plan needs a hard per-account cost cap first
2026-11-19 | Site may claim exactly four shipped capabilities: Mac app with window + menu-bar icon; bring your own Claude/ChatGPT; Gmail, Drive, Docs, Slides, Sheets; asks before send/write/delete with kill switch, export, delete | Confirmed by Huzaifa this session; recorded in PROGRESS.md
2026-11-19 | Site repo is public HAP008/atlas-site, deployed by GitHub Actions to hap008.github.io/atlas-site | GitHub Free only serves Pages from public repos; Huzaifa approved
2026-11-19 | Hosting must move off GitHub Pages before any checkout or account pages (step 3/4) | GitHub's terms bar Pages as hosting for an online business, e-commerce or SaaS
2026-11-19 | Next.js 16 Cache Components turned off | Not needed for a fully static site; it blocks the static-export route settings
2026-11-19 | Fonts: Newsreader self-hosted via next/font at build; body text uses the system font | No requests to Google or any third party from visitors' browsers
2026-11-19 | Dark mode follows the system setting, no toggle | A toggle would need browser storage
2026-11-19 | Waitlist endpoint is a GitHub repository variable, not a secret | It's public in the built JavaScript anyway; the repo still never contains it
2026-11-19 | Waitlist build accepts only a formspree.io endpoint (local http for testing) | Keeps the Privacy Policy's "sent only to Formspree" true; changing service means changing config and policy together
2026-11-19 | Form posts natively to the form service if JavaScript hasn't loaded | A default GET to our own page would put the email in a URL and server logs
2026-11-19 | Waitlist data routine: delete each sign-up from Formspree within 30 days; Gmail copy is the list; deletion requests done within 30 days including trash | Formspree free plan stores submissions but only shows 30 days; makes the Privacy Policy promise keepable
```
