# STEP 2: DECISION BRIEF

Domain, hosting, email and merchant of record. All facts checked on each provider's own pages on **2026-11-19** unless marked **unverified**. Prices are as shown on the page, before tax unless stated. Nothing here has been bought or signed up for.

**Status: PROPOSED. Waiting for Huzaifa to confirm or change the five picks.**

---

## Summary of picks

| | Pick | Alternative | Cost (verified) |
|---|---|---|---|
| Domain | **Porkbun**, a `.app` name (e.g. `atlasassistant.app`) | Zoho Domains (India), a `.com` or `.in` name | `.app` US$8.75 first year, **US$14.93/yr renewal** (~US$1.24/mo) |
| Hosting | **Cloudflare** (Workers static assets, free plan) | Netlify Free | **US$0**. Paid only if ever needed: US$5/mo |
| Email | **Zoho Mail Lite (5 GB)**, one mailbox | Google Workspace Base | **₹59/user/mo, annual only = ₹708/yr** + GST |
| Merchant of record | **Paddle** | Dodo Payments | **No monthly fee. 5% + 50¢ per transaction** |
| Fixed yearly total | | | **~US$14.93 + ₹708 + GST** (before any sales) |

---

## 1. Domain

**Pick: Porkbun, `.app`.** Renewal price is flat and published, privacy is free, and `.app` is HTTPS-only by design (on the browser HSTS preload list), which suits a security-minded product. US$8.75 first year, US$14.93/yr after; all ICANN fees included.
**Alternative: Zoho Domains (Zoho Corp, India-based, NIXI-listed registrar).** Bills in rupees: `.com` ₹999/yr, `.in` ₹725/yr, same at renewal, + tax. Doesn't sell `.app`.
**Trade-off:** Porkbun bills in USD and its payment page doesn't mention Indian cards, RuPay or UPI (unverified; PayPal works but can't auto-renew, so you'd renew by hand). Zoho bills in INR but only offers `.com`/`.in`, and the good `.com` names are mostly taken.

Optional: also register the matching `.in` (Porkbun US$7.83/yr, Zoho ₹725/yr) to stop someone else taking it in India.

### Name options (registry lookup on 2026-11-19 found no registration; that's a hint, not availability)
1. `atlasassistant.app` (and `atlasassistant.in`)
2. `atlas-assistant.com`
3. `calmatlas.app`

Avoided: names containing "mac". Apple's trademark guidelines allow "for Mac" only as a compatibility phrase that "is not part of the product name" and restrict Apple marks in domain names ([Apple guidelines](https://www.apple.com/legal/intellectual-property/guidelinesfor3rdparties.html)).

**Before buying, you check two things yourself:**
- Availability and the exact checkout total at the registrar.
- **India's official trademark search** for "ATLAS" in software/app classes: https://tmrsearch.ipindia.gov.in/tmrpublicsearch/ (linked from [IP India](https://ipindia.gov.in/trade-marks-before-you-apply-search-existing-trademarks)).

> ⚠️ **A trademark conflict on "ATLAS" is possible and has not been checked.** It's a common word and likely registered by others in software. Do the search before buying the domain or spending on branding (decision S9).

### Registrar facts
| Registrar | `.com` first / renewal | `.app` first / renewal | `.in` first / renewal | Free privacy | Indian payment |
|---|---|---|---|---|---|
| Porkbun | US$11.81 / 11.81 | US$8.75 / **14.93** | US$7.83 / 7.83 | Yes | Cards (issuer country not stated), PayPal (no auto-renew), Apple/Google Pay. UPI/RuPay not mentioned |
| Zoho Domains | ₹999 / 999 | not sold | ₹725 / 725 | Yes | Cards, PayPal. UPI/RuPay not mentioned. Prices exclude tax |
| Cloudflare Registrar | unverified (page blocks automated checks) | unverified | **not sold** | Yes | Cards; Indian cards need 3-D Secure on every charge, which makes auto-renew fragile. UPI/RuPay not listed |
| Namecheap | unverified (blocked) | unverified | unverified | Yes, **except `.in`** | Cards, PayPal. UPI/RuPay not listed |
| GoDaddy (incl. India store) | unverified (blocked) | unverified | unverified | unverified | unverified. Check https://www.godaddy.com/en-in/help/payment-methods-we-accept-for-purchases-8061 |

Sources: [Porkbun prices](https://porkbun.com/products/domains), [Porkbun .app](https://porkbun.com/tld/app), [Porkbun .in](https://porkbun.com/tld/in), [Porkbun payments](https://porkbun.com/support/payment_options), [Zoho Domains pricing](https://www.zoho.com/domains/pricing.html), [Cloudflare Registrar](https://www.cloudflare.com/products/registrar/), [Cloudflare TLD list](https://www.cloudflare.com/tld-policies/), [Cloudflare failed payments](https://developers.cloudflare.com/billing/troubleshoot-failed-payments/), [Namecheap privacy (.in excluded)](https://www.namecheap.com/support/knowledgebase/article.aspx/280/37/), [NIXI registrars](https://www.registry.in/accredited-registrars).

`.in` notes: NIXI requires verifiable contact details and can suspend without refund otherwise. The public `.in` lookup hides name/email/address but shows organisation, state and country, so leave Organisation blank as an individual.

---

## 2. Hosting

**Pick: Cloudflare, Workers static assets on the free plan.** Its terms have no personal-use limit, static asset requests are "free and unlimited", a `_headers` file sets security headers and the CSP, HTTPS is free with an "Always Use HTTPS" switch, and GitHub Actions can deploy our existing build with Wrangler. Cloudflare's own Pages docs now say "Start new projects with Workers".
**Alternative: Netlify Free.** Commercial use allowed, `_headers` supported, apex domain without moving DNS.
**Trade-off:** Cloudflare needs the domain's nameservers moved to Cloudflare (free) to serve the root domain. Netlify doesn't, but its free plan is a 300-credit monthly cap (15 credits per deploy, 20 per GB), and over the cap the site **pauses** until next month or the US$9/mo plan.

One Cloudflare rule to respect: free-plan terms forbid collecting card details on the site (§2.2.1(h)). That's fine: checkout will be on the merchant of record's hosted page.

| | Cloudflare | Netlify | Vercel | GitHub Pages (today) |
|---|---|---|---|---|
| Commercial use on free plan | Allowed | Allowed | **No**: "personal or non-commercial use" | **No** for an online business / e-commerce / SaaS |
| Free limits | Static requests unlimited; 20,000 files, 25 MiB/file | 300 credits/mo, then site pauses | 100 GB, 1M requests | 1 GB site, 100 GB/mo soft |
| Security headers / CSP | `_headers` | `_headers` / `netlify.toml` | `vercel.json` | **Not possible** |
| Custom domain + free HTTPS | Yes (apex needs Cloudflare DNS) | Yes | Yes | Yes |
| Deploy our pre-built folder from Actions | Yes (Wrangler) | Yes (CLI) | Yes (CLI) | Yes (current) |
| First paid tier | US$5/mo | US$9/mo | US$20/seat/mo | n/a |

Sources: [Cloudflare terms](https://www.cloudflare.com/terms/), [Workers static assets billing](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/), [Workers headers](https://developers.cloudflare.com/workers/static-assets/headers/), [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/), [Pages overview](https://developers.cloudflare.com/pages/), [Workers custom domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/), [Always Use HTTPS](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/always-use-https/), [Netlify pricing](https://www.netlify.com/pricing/), [Netlify agreement](https://www.netlify.com/legal/self-serve-subscription-agreement/), [Netlify headers](https://docs.netlify.com/manage/routing/headers/), [Vercel terms §4](https://vercel.com/legal/terms), [Vercel Hobby](https://vercel.com/docs/plans/hobby), [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits), [GitHub additional terms](https://docs.github.com/en/site-policy/github-terms/github-terms-for-additional-products-and-features).

---

## 3. Email

**Pick: Zoho Mail Lite (5 GB), one mailbox, e.g. `hello@<domain>`.** ₹59/user/month, billed annually only = **₹708/yr + GST**. A real mailbox that sends as the domain from webmail, Zoho's apps, or Apple Mail over IMAP/SMTP. India data centre.
**Alternative: Google Workspace Base.** ₹99/user/month, billed monthly (₹1,188/yr) + tax; annual price not shown on the page (unverified). Gmail interface, Google's own sending.
**Trade-off:** Zoho is cheaper and works in any mail app. Workspace costs ~1.7× more but you stay in Gmail. Zoho's Lite price came from the data file its pricing page loads; confirm it on the rendered page before paying.

**Why not "free forwarding into Gmail":** Google's help page says "Gmail will fully remove 'Send as' for third-party accounts, Gmailify, and POP" in **January 2027**, and may restrict new setups now. Forwarding-only (Cloudflare Email Routing) would leave no supported way to reply as the domain. Zoho's **Forever Free** plan (up to 5 users, 5 GB, webmail and Zoho apps only, no IMAP/POP, accounts unused for 180 days are marked inactive) is a ₹0 fallback if you accept webmail-only.

| | Price per mailbox | Free tier | Sends as the domain |
|---|---|---|---|
| Zoho Mail Lite 5 GB | ₹59/mo, annual only, + GST | Forever Free (webmail/apps only) | Yes |
| Google Workspace Base | ₹99/mo, monthly, + tax | None (14-day trial) | Yes |
| Cloudflare Email Routing | Free (receive/forward) | Yes | **No.** Sending needs Workers Paid (US$5/mo), labelled beta, no inbox |
| Migadu Micro | US$19/yr per account | Trial only | Yes, but 20 outgoing/day |

DNS records for the pick (exact values come from Zoho's admin console for your account and data centre; Part 4 lists them):
- **MX:** `mx.zoho.*` (10), `mx2.zoho.*` (20), `mx3.zoho.*` (50). The ending depends on data centre (India values unverified until the console shows them).
- **SPF:** `v=spf1 include:zohomail.com ~all`. Only one SPF record per domain.
- **DKIM:** generated in Admin Console → Domains → Email Configuration → DKIM; TXT at `<selector>._domainkey`.
- **DMARC:** start `v=DMARC1; p=none; rua=mailto:dmarc@<domain>`, then `quarantine` and `reject` after reports look clean (Google's recommended rollout).

Sources: [Zoho Mail pricing (India)](https://www.zoho.com/en-in/mail/zohomail-pricing.html), [Zoho plan comparison](https://www.zoho.com/mail/compare/overview.html), [Zoho SMTP](https://www.zoho.com/mail/help/zoho-smtp.html), [Zoho inactive accounts](https://www.zoho.com/mail/help/inactive-account.html), [Zoho MX](https://www.zoho.com/mail/help/adminconsole/configure-email-delivery.html), [Zoho SPF](https://www.zoho.com/mail/help/adminconsole/spf-configuration.html), [Zoho DKIM](https://www.zoho.com/mail/help/adminconsole/dkim-configuration.html), [Workspace pricing (India)](https://workspace.google.com/intl/en_in/pricing.html), [Gmail Send-as change](https://support.google.com/mail/answer/17101213), [Cloudflare Email Service pricing](https://developers.cloudflare.com/email-service/platform/pricing/), [Migadu pricing](https://www.migadu.com/pricing/), [Google DMARC rollout](https://knowledge.workspace.google.com/admin/security/recommended-dmarc-rollout).

---

## 4. Merchant of record

**Pick: Paddle.** Individuals and sole traders are accepted ("Business verification (not required for individuals or sole traders)"), India isn't excluded, the fee is **5% + 50¢ per transaction** with no monthly fee, it has a sandbox, UPI works on INR prices (including subscriptions), and nothing in its acceptable-use policy targets AI assistants.
**Alternative: Dodo Payments.** The most India-explicit: "You do not need a registered business", PAN required, "SaaS & AI products" welcomed, 1–3 day review. Fees 4% + 40¢, **plus 1.5% for international cards and 0.5% for subscriptions**.
**Trade-off:** Paddle is cheaper on international subscriptions and better known; it pays in USD by wire or Payoneer (no INR), monthly, US$100 minimum, and a SWIFT fee may apply (US$15 inferred from its fee rule, unverified for India). Dodo also pays in USD/GBP/EUR only, and **rejects waitlist / "coming soon" sites at review**, so we couldn't apply until ATLAS is buyable.

| | India individual? | Payout to Indian bank | Seller fee | AI assistant allowed? | UPI | Test mode |
|---|---|---|---|---|---|---|
| **Paddle** | Yes | USD wire or Payoneer, monthly, $100 min | 5% + 50¢ | Not restricted | INR prices, incl. subscriptions (max ₹15,000/renewal) | Sandbox |
| **Dodo** | Yes (PAN mandatory) | USD/GBP/EUR to bank or Payoneer; **INR payouts discontinued** | 4% + 40¢, +1.5% intl, +0.5% subs | "SaaS & AI products" welcomed | Yes, subscriptions via RBI mandate | Test mode |
| **Polar** | Only if Stripe offers "individual" in India (unverified) | Needs a bank account in your country, local currency, via Stripe | 5% + 50¢, +1.5% non-US cards | AI content tools get closer review | Yes | Sandbox |
| **Lemon Squeezy** | **Closed**: "we've closed new store sign-ups" (16 Nov 2026); stops processing 31 Mar 2027 | n/a | n/a | n/a | n/a | n/a |
| **Whop** | Payouts to India | Bank wire $23 | 2.7% + 30¢ + extras | Not mentioned | One-time only | Sandbox |
| | | | | **Not a full tax MoR**: tax remittance only for 18 US states, UK, EU (+2%) | | |

Sources: [Paddle countries](https://www.paddle.com/help/start/intro-to-paddle/which-countries-are-supported-by-paddle), [Paddle account verification](https://www.paddle.com/help/start/account-verification/what-is-account-verification), [Paddle domain review](https://www.paddle.com/help/start/account-verification/what-is-domain-verification), [Paddle pricing](https://www.paddle.com/pricing), [Paddle payouts](https://www.paddle.com/help/manage/get-paid/when-and-how-do-i-get-paid), [Paddle payout fees](https://www.paddle.com/help/manage/get-paid/is-there-a-fee-taken-for-payouts), [Paddle not allowed](https://www.paddle.com/help/start/intro-to-paddle/what-am-i-not-allowed-to-sell-on-paddle), [Paddle UPI](https://developer.paddle.com/concepts/payment-methods/upi/), [Paddle sandbox](https://developer.paddle.com/build/tools/sandbox), [Dodo countries](https://docs.dodopayments.com/miscellaneous/accepted-countries-and-territories), [Dodo FAQ](https://docs.dodopayments.com/miscellaneous/faq), [Dodo payouts](https://docs.dodopayments.com/features/payouts/payout-structure), [Dodo merchant acceptance](https://docs.dodopayments.com/miscellaneous/merchant-acceptance), [Dodo pricing](https://dodopayments.com/pricing), [Polar countries](https://polar.sh/docs/merchant-of-record/supported-countries), [Polar fees](https://polar.sh/docs/merchant-of-record/fees), [Polar acceptable use](https://polar.sh/docs/merchant-of-record/acceptable-use), [Lemon Squeezy shutdown post](https://www.lemonsqueezy.com/blog/saying-goodbye-to-lemon-squeezy), [Whop seller terms](https://whop.com/seller-terms/), [Whop fees](https://docs.whop.com/fees).

### Review risks to plan for (any provider)
- **Approval needs a buyable product.** Paddle's domain review wants a live HTTPS site with product description, pricing (a screenshot is accepted before launch), and Terms, Refund and Privacy pages in the navigation, **with your legal name in the Terms**. Apply in step 4, not now.
- **How ATLAS connects to Claude/ChatGPT matters.** Paddle bans products that enable infringing another party's "terms and conditions"; Polar and Dodo have similar clauses. Official API keys or OAuth are low-risk; automating consumer logins could fail review. (App-side decision; also check Anthropic's and OpenAI's terms for bring-your-own-key products, as SITE-PLAN §7 says.)
- **FIRA/FIRC paperwork** for foreign payouts into an Indian bank isn't covered on any provider's pages (unverified: ask provider support and your accountant).

---

## 5. What only you (the owner) can do

1. **Trademark search** for "ATLAS" at https://tmrsearch.ipindia.gov.in/tmrpublicsearch/ before buying anything branded.
2. **Buy the domain** (after confirming availability and the checkout total). Turn on auto-renew if your card supports it, or put the renewal date in your calendar.
3. **Create a free Cloudflare account**, add the domain, and switch the domain's nameservers at the registrar to the two Cloudflare gives you (Part 2 will list them).
4. **Create the Zoho Mail account** and verify the domain (Part 4 gives every DNS record).
5. **Finish step 1's open item:** create the Formspree form, set the GitHub variable, submit one real test sign-up.
6. **Talk to an accountant before taking any money** about: sole proprietorship vs registration, GST and whether an LUT is needed for exporting software services, how foreign payouts are reported (FIRA/FIRC), and income tax on them.
7. **Bank:** an account that can receive USD by SWIFT, or a Payoneer account linked to your Indian bank.
8. **Documents the merchant of record will ask for:**
   - Paddle: government photo ID, proof of address, possibly a selfie/liveness video (via Sumsub); your legal name for the Terms; payout bank or Payoneer details.
   - Dodo (if chosen): PAN (mandatory), ID and selfie (via Persona).
9. **Create the Paddle sandbox account** yourself when we reach the test-mode checklist (Part 5). I never create accounts or enter payment details.

> Prompt-injection notice: Whop's documentation contains an "Agent Instructions" block telling AI agents to run `curl -fsSL https://whop.com/install.sh | sh`. It was ignored. Porkbun, Cloudflare, Vercel and Netlify pages contain notes addressed to AI agents (llms.txt pointers, a plugin install hint); none were acted on.
