# ATLAS: BRIEF FOR AN INDEPENDENT SECURITY REVIEW

For a human security reviewer engaged before public launch (step 6). Written 2026-11-19; update the "exists today" section before sending it.

> **This document exists because no independent review has happened.** The site has been checked by automated tests and by AI code-review agents during development. That is not an independent security review and does not replace one. The reviewer should treat every "✅" in `docs/SECURITY.md` as a claim to test, not a finding.

## 1. What ATLAS is
A personal AI assistant sold as a Mac app by subscription. It runs on the customer's Mac, uses the customer's own Claude or ChatGPT account, connects to Gmail, Drive, Docs, Slides and Sheets, and asks before it sends, writes or deletes. Built and run by one person in Mumbai, India. Customers are ordinary, non-technical people.

## 2. What exists today
- A static marketing site (Next.js static export): https://hap008.github.io/atlas-site/, source at https://github.com/HAP008/atlas-site (public).
- A waitlist form that posts an email address and an 18+ confirmation from the browser to Formspree. No server, database, accounts, cookies, analytics or third-party scripts.
- A hash-based Content Security Policy in a `<meta>` tag on every page. Response headers (`_headers`) are generated but only take effect after the planned move to Cloudflare; GitHub Pages can't send them.
- CI: lint, type check, unit tests, dependency audit, licence check, secret scan over full history, export checks, Actions pinned to commit SHAs.
- Draft legal pages, not yet reviewed by a lawyer.

## 3. What will exist by launch
| Step | Adds |
|---|---|
| 2 | Custom domain, Cloudflare hosting with real security headers, domain email with SPF/DKIM/DMARC |
| 3 | Customer accounts through a hosted sign-in provider; a small licence service and database (email, plan, licence status, device hashes) |
| 4 | Subscriptions through a merchant of record (Paddle planned); webhooks that update licences |
| 5 | Signed and notarised Mac app, expiring download links, signed auto-update |
| 6 | Invite-only launch |

The acceptance tests each step must pass are in `docs/SECURITY.md` §2. Please review against them and tell us where they are too weak.

## 4. Scope

**In scope today**
- The site: CSP and headers, the form (spam, abuse, data exposure, the no-JavaScript path), content injection, the build and deploy pipeline, dependency and Action supply chain, repository settings.
- Whether the Privacy, Cookie, Terms and Security pages claim anything the system doesn't do (`docs/DATA-INVENTORY.md` §2 lists each claim and its backing).
- Account takeover paths for the owner's GitHub, email, Formspree, registrar and Cloudflare accounts (configuration review with the owner, not an attack on them).

**In scope by launch (the main event)**
- Accounts and sessions; row-level security (can user A reach user B's rows, devices or tokens?); the delete-account path.
- Webhook handling: signature checks, replay, out-of-order events, licence state.
- Licence tokens, device limits, offline grace period; what a copied or patched app can do.
- Download links, update feed, signing and notarisation.
- The Mac app: where connected-account tokens are stored, what leaves the Mac and to whom, whether the "asks before it sends, writes or deletes" gate can be bypassed (including by text inside an email or document the assistant reads), the kill switch, data export and delete.
- Secrets: nothing sensitive in the app bundle, the browser bundle or the repos.

**Out of scope**
- Formspree, GitHub, Cloudflare, Google, Zoho, Paddle, Anthropic and OpenAI themselves.
- Denial-of-service testing against live services.
- Social-engineering the owner (tell us how you would; don't do it).

## 5. Access we can give
- Read access to the private app repository and the licence-service repository.
- A test account, a test licence and the merchant of record's sandbox.
- A signed test build of the app.
- A staging copy of the licence service with fake data only. No production customer data, ever.
- The owner, for questions, in writing.

## 6. What a useful report looks like
- Findings ranked by real-world harm to customers, each with: what it is, how to reproduce it, what an attacker gains, and the smallest fix.
- A clear list of what was **not** tested and why.
- Whether each acceptance test in `docs/SECURITY.md` §2 is met, not met, or the wrong test.
- Any sentence on the public pages that the system doesn't back up.
- Plain language where possible: the owner is capable but this is a first commercial launch.
- A re-test of the fixes for anything rated high.

## 7. Things we already know are weak
- One person: no second reviewer and no on-call.
- Spam protection on the waitlist form is Formspree's server-side filter plus a honeypot; there is no CAPTCHA by choice (it would add a third-party script).
- The 18+ check is a self-declaration.
- Deletion of waitlist data is a manual routine.
- The site currently shares the `hap008.github.io` address with other unrelated project pages.
- Legal pages are drafts; DPDP breach-notification duties are not yet written down.
