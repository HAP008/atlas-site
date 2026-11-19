# ATLAS SITE — FULL PLAN

The complete list for a site that sells and delivers ATLAS, built for one person selling from India. It favours services that handle the hard parts (hosted sign-in, merchant of record). Nothing here is built unless the current step says so; see `CLAUDE.md` §3.

## Read first: the cloud idea
Running ATLAS in the cloud for every customer is a different product, not a feature.
- It breaks the privacy promise (ATLAS runs on the customer's Mac; we never receive their data). A cloud copy means storing emails, notes, tokens and conversations on our servers, so a breach becomes our problem and the legal/security load jumps.
- Most of ATLAS can't run there: Apple Calendar, Reminders, Contacts, Mail, Messages, menu bar and Computer Use need the customer's Mac.
- Per-customer monthly cost (always-on server, storage, backups, any AI usage).
- **Decision:** local Mac app first. Later a phone relay (app stays on the Mac; no customer data on our servers). A separate Cloud tier only after paying customers, a registered business and a security review.

## Build order
1. Landing, pricing and legal pages, with a waitlist form (no payments yet). ← **current**
2. Domain, business email, merchant of record account in test mode.
3. Accounts and licence service, with device limit and delete button.
4. Payments connected to licences through webhooks: test mode, then live.
5. Signed build, secure download delivery, auto-update (Apple Developer plan, $99/yr).
6. Security review, backup restore test, small invite-only launch.
7. Support, monitoring, cancel and refund routines running smoothly.
8. Open sign-ups, then marketing.
9. Later: phone relay for "always on"; then, only if customers ask and it's affordable, a separate Cloud tier.

## 1. Website pages
Home (one line: what ATLAS does and for whom) · Features (real screenshots, short demo video) · Pricing (tiers, includes, monthly/yearly, currency, tax note, refund promise) · Download (signed-in paying customers only) · Sign-up/sign-in, password reset, email verification · Account (plan, billing, devices, download link, cancel, delete account) · FAQ and setup guide · Support/contact and status page · Privacy, Terms, Refund, Cookie, Acceptable Use, Security contact · About (who, real contact email) · Changelog · 404/error pages, robots, sitemap, social preview images, favicon.

## 2. Downloading the app
Signed and notarised Mac build · private expiring download links created only after an active licence is confirmed · Apple silicon and Intel builds if both supported, plus minimum macOS · checksum, version, release date on the page · signed auto-update feed with rollback · beta channel · per-account download limits · "download again" and old versions kept for a while · install guide with screenshots including first-run screens.

## 3. Accounts
Email sign-up with 18+ confirmation and Terms/Privacy tick · email verification before unlock · hosted sign-in provider (not homemade) · optional Google/Apple sign-in, 2FA from day one · lockout/slow-down on failures · session list · device list with remove button · change email/password, delete account and all data · data export · admin area for owner only (2FA, IP limit, audit trail) · invite-only allowlist at launch.

## 4. Subscriptions and payments
Merchant of record (options: Paddle, Lemon Squeezy, Dodo Payments, Polar, Whop; India seller terms, payout method and fees **unverified**, check each provider) · direct Stripe/Razorpay not recommended at the start · plans as products (monthly, yearly, maybe lifetime) · trial or money-back decided and written · checkout with cards, UPI/local methods, international cards · webhooks (new, renewal, failed, cancel, refund, chargeback) updating the licence · dunning and reminders · grace period and plain lapse message (data stays the customer's) · one-click cancel · up/downgrade with pro-rating · receipts and invoices · refund process and licence revocation · chargeback rules · INR and international price display · test mode for every path · accountant records (payout reports, fee statements).

## 5. Licensing and anti-clone
Signed licence tokens tied to the device with an offline grace period · device limit, remove-device, admin revoke · plain-words licence status in the app · paid features pause on lapse, but the kill switch, data export and delete always work · compiled backend, protected package, no keys in the app. This makes copying harder, not impossible.

## 6. Security
**Website:** HTTPS + HSTS, security headers and strict CSP, WAF/DDoS via CDN (Cloudflare free tier), rate limits on sign-in/sign-up/reset/download/checkout, CAPTCHA on sign-up and reset, input validation and safe DB access, secure/HTTP-only/same-site cookies, no secrets in browser code or repo, rotated env secrets, dependency scanning (Dependabot) and an audit step that fails the build, separate dev/staging/production keys, admin behind 2FA.
**Accounts and data:** row-level security (tested), least data (email, plan, licence status, device hashes; never message text or notes), encryption at rest and in transit, encrypted backups with a tested restore, security logs without personal data, admin audit log.
**Payments:** never touch card numbers (hosted checkout), verify every webhook signature and reject repeats.
**Downloads:** expiring links, hash checks, signed builds and updates, scan builds for secrets.
**People and process:** 2FA on every account (domain, GitHub, hosting, payments, email, Apple Developer), written incident plan, vulnerability disclosure page, independent security review before launch, private repo with branch protection.

## 7. Legal and compliance
Business registration and tax setup in India, business bank account (ask an accountant before taking money) · ToS, Privacy, Refund, Cookie, Acceptable Use written for accounts and billing · 18+ · DPDP Act, GDPR if selling in Europe, others by country, lawyer review once · consent screens before anything leaves the customer's Mac, analytics off by default · deletion on request with a stated time limit · trademark check on "ATLAS" and an owned domain · open-source licence list and NOTICES file · check Anthropic terms for product use of the Claude API and branding, and say clearly customers bring their own key · disclaimers: ATLAS can make mistakes and acts only with approval.

## 8. Email and communication
Domain-based support address with SPF, DKIM, DMARC · transactional email service (verification, receipts, reset, failed payment) · support inbox/help desk, response-time promise, canned answers · update list with working unsubscribe.

## 9. Domain, hosting and running costs
Domain (postponed; buy before launch) · hosting, database, sign-in provider, download storage, transactional email, monitoring, CDN · Apple Developer $99/yr · merchant-of-record and payout fees · AI cost per customer with a hard per-account cap if included. Estimate each as a monthly figure before choosing tiers. None priced yet; get current prices from each provider.

## 10. Running the business
Uptime monitoring, error tracking, status page · backups and restore test every few months · privacy-respecting analytics after consent only · refund/chargeback routine and monthly failed-payment check · release routine (test build, signed build, notes, staged rollout, rollback) · onboarding email sequence and feedback route · metrics: signups, trial-to-paid, churn, refunds, support load, cost per customer.

## 11. Cloud ATLAS (only after the local product earns money)
Everything above, plus: per-customer isolation · encrypted per-customer storage and backups · secrets vault for customer keys · orchestration for hundreds of instances · authenticated connection layer · hard per-customer cost caps · honest feature cut (no Apple apps, Messages, menu bar, Computer Use) · new privacy policy and Terms saying we hold data, a data protection review, breach notification process and security review · support load for uptime · region and law · an exit path back to the Mac app.

Sources behind the merchant-of-record notes: Dodo Payments on merchants of record for sellers in India, Freemius guide to merchant of record platforms, Paddle on payments in India. Vendor/blog pages: confirm details on each provider's own site.
