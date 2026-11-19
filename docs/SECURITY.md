# ATLAS SITE: SECURITY

What we protect, from whom, what is done, and what must be true before each later step ships. Written 2026-11-19. Update it whenever a row changes.

**No claim here is stronger than its evidence.** The site is not "unhackable", "bank-grade" or "military-grade", and nothing on the public pages may say so (`docs/CONTENT-RULES.md`).

Status key: ✅ verified · ⚠️ partly done, or checked only locally / against a stub · ❌ not done · ⏳ not yet applicable (step named, acceptance test written)

---

## 1. Threat model

### What we have to protect
| Asset | Where it lives | Why it matters |
|---|---|---|
| Waitlist email addresses | Formspree, and a copy in the owner's Gmail inbox | Personal data. A leak breaks our promise and the DPDP Act duty of care |
| The domain (once bought) and its DNS | Registrar, Cloudflare | Whoever controls DNS controls the site, the email and every password reset |
| The Formspree account | formspree.io | Holds the list; can redirect sign-ups |
| The GitHub account and repo | github.com/HAP008/atlas-site (public) | Whoever can push can change the live site |
| The owner's email inbox | Gmail now, Zoho later | Recovery address for every other account |
| The owner's Mac | - | Signed in to all of the above |
| Later: licence service, customer accounts, payment webhooks, signing keys, download links | Steps 3–5 | Money, customer data, and the ability to ship code to customers' Macs |

### Who might attack, and what they want
| Attacker | Wants | Most likely route |
|---|---|---|
| Spam bots | To stuff the form, burn the 50-a-month Formspree quota | POST straight to the form endpoint |
| Opportunistic scanners | Any known hole, any leaked key | Automated scans of the site and the public repo |
| Account thief | The owner's GitHub, registrar, Cloudflare or email account | Phishing, password reuse, SIM swap, stolen session |
| Supply-chain attacker | To run code in our build or on our pages | A poisoned npm package or GitHub Action |
| Someone abusing the form | To sign up other people's addresses | Typing them in |
| Impersonator | To look like ATLAS and collect emails or payments | A look-alike domain or page (we can't frame-block someone else's copy) |
| Later: licence cheat, payment fraudster, competitor | Free use, refunds, a copy of the app | Steps 3–5 threats |

### In scope today
The static site and its build: content integrity, the waitlist form, HTTP headers and CSP, the repo, CI and its dependencies, the legal-page claims, and the owner-account settings that protect them.

### Out of scope until a later step
| Thing | Step |
|---|---|
| Domain, DNS, DNSSEC, HSTS on our own domain, real response headers, WAF | 2 (Prompt 2, Part 2) |
| Domain email, SPF/DKIM/DMARC | 2 |
| Accounts, sessions, database, row-level security, delete-account button | 3 |
| Payments, webhooks, refunds, cancel flow | 4 |
| Signed builds, downloads, auto-update, licence tokens | 5 |
| Independent security review, backup restore test, invite-only launch | 6 |

### What we cannot make safe
Honest limits. None of the controls below removes these.
- **A determined, skilled attacker** with time and money. Our aim is to be a poor target and to notice quickly, not to be unbreakable.
- **A compromised owner device.** Malware on the Mac that is signed in to GitHub, the registrar and email defeats everything here. 2FA limits the damage but doesn't stop a stolen live session.
- **A breach at a provider.** If Formspree, Google, GitHub, Cloudflare or the registrar is breached, waitlist emails or control of the site can leak with no fault in our code. We keep as little there as we can (`docs/DATA-INVENTORY.md`).
- **Social engineering of the owner.** A convincing "GitHub security" or "registrar renewal" email is the most likely way in.
- **Spam through the form.** The endpoint is public by design. Anyone can POST to it without our page; only Formspree's server-side filtering stands in the way.
- **False sign-ups.** We can't prove a waitlist address belongs to the person who typed it, or that they are 18. It is a self-declaration.
- **One person.** There is no second reviewer and no on-call. If the owner is away, nothing gets fixed.

---

## 2. Security gate matrix

One row per item. "Applies" says whether it must hold now or at which step. Rows marked ⏳ carry the **acceptance test** the step 3–6 prompts must meet; no code exists for them yet.

### A. Abuse and cost
| # | Item | Applies | How it is satisfied / acceptance test | Evidence | Status |
|---|---|---|---|---|---|
| A1 | Rate limiting | Now (form), step 3+ (ours) | Now: we run no server. The only write is to Formspree, which applies its own limits; the form shows "Too many tries…" on HTTP 429. **Step 3+ test:** sign-in, sign-up, reset, download and checkout each return 429 after N requests per IP and per account in a window; an automated test sends N+1 and expects 429 | `tests/waitlist*.test.ts` (429 path, mocked). Formspree limits untested until connected | ⚠️ now · ⏳ 3 |
| A2 | Usage quotas | Now, step 3+ | Now: Formspree free plan caps at 50 sign-ups a month; over that, sign-ups fail into the "email us" message (not verified against a live form). **Step 3+ test:** device limit per licence and download limit per account are enforced server-side; exceeding either returns a plain message and is logged | `docs/STEP2-DECISIONS.md`, README routine | ⚠️ now · ⏳ 3, 5 |
| A3 | Request throttling | Step 2, 3+ | Now: none of ours; GitHub Pages serves static files with its own soft limits. Step 2: Cloudflare in front. **Step 3+ test:** every dynamic endpoint has a documented per-IP throttle at the edge, shown by a load test hitting the limit | GitHub Pages limits doc | ⚠️ now · ⏳ 2, 3 |
| A4 | CAPTCHA | Now (decision), step 3 | Now: **none on our pages, by decision.** Formspree's CAPTCHA needs Google's reCAPTCHA script on our page (third-party script and cookies). We rely on Formspree's server-side spam filter, a honeypot, and "Restrict to domain". **Step 3 test:** sign-up and password reset sit behind a challenge provided by the hosted sign-in provider on its own page; adding any third-party script to our pages needs a consent decision logged in §11 first | Honeypot test in `tests/waitlist-form.test.tsx` | ⚠️ now · ⏳ 3 |
| A5 | Cost controls | Now, step 2+ | Now: fixed cost ₹0. Every service is on a free plan that pauses or refuses instead of billing. **Step 2+ test:** each paid service has a spend cap or billing alert set by the owner; `docs/PROJECT.md` lists every monthly cost; no service can scale its bill without an alert. If ATLAS ever includes AI usage: a hard per-account cap, tested by exceeding it | `docs/STEP2-DECISIONS.md` | ✅ now · ⏳ 2, 4 |

### B. The ten
| # | Item | Applies | How it is satisfied / acceptance test | Evidence | Status |
|---|---|---|---|---|---|
| B1 | Privacy policy | Now | Live draft that names the DPDP Act and matches the code (claims audit in `docs/DATA-INVENTORY.md`). Lawyer review before taking money | `/privacy/`; `scripts/check-export.ts` draft-line check | ✅ draft · ❌ lawyer review (before 4) |
| B2 | Delete-my-data button (3 taps or fewer, no email) | Step 3 | Now: no accounts exist, so waitlist deletion is by email request, done by hand within 30 days; the site says exactly that. **Step 3 test:** from the account page a signed-in user deletes their account and all data in ≤ 3 taps without emailing anyone; an automated test creates an account, deletes it, and finds no rows for that user in any table, the licence revoked and the subscription cancelled | Privacy "How long we keep it"; README routine | ⚠️ now (email only) · ⏳ 3 |
| B3 | Open database / row-level security | Step 3 | No database exists. **Step 3 test:** row-level security is on for every table with at least one policy; an automated two-account test per table proves user A cannot read, change or delete user B's rows, devices or tokens; **CI fails if any table lacks a policy**, so a new table can't ship without one; the service-role key is never in browser code (secret scan + bundle grep) | - | ⏳ 3 |
| B4 | Data hoarding | Now, step 3+ | Now: the form sends two fields only (email, 18+ yes). **Step 3+ test:** the schema holds only email, plan, licence status and device hashes; never message text, notes, files or tokens; a schema review against `docs/DATA-INVENTORY.md` is part of each step's done-check | `tests/waitlist.test.ts` ("posts only the email and the 18+ confirmation") | ✅ now · ⏳ 3 |
| B5 | Minors (18+ only) | Now, step 3 | Now: the form can't be submitted with the 18+ box unticked; Terms and Privacy say 18+. It is a self-declaration, not proof. Launch emails go only to rows with `age_confirmed=yes`. **Step 3 test:** sign-up requires the 18+ confirmation and stores when it was given | `tests/waitlist-form.test.tsx` (unchecked box) | ✅ now (self-declared) · ⏳ 3 |
| B6 | Hard to cancel | Step 4, 7 | Nothing can be bought. **Step 4 test:** a subscriber cancels in ≤ 2 clicks from the account page through the merchant of record, with no email or call, and sees the end date; tested in sandbox | - | ⏳ 4 |
| B7 | No consent | Now, step 3+ | Now: the waitlist states its one purpose beside the button and links Privacy and Terms; no pre-ticked boxes; no analytics. **Step 3+ test:** no data leaves the customer's Mac to us without a consent screen; analytics off by default; no pre-ticked consent anywhere | `components/waitlist-form.tsx`; Cookie Notice | ✅ now · ⏳ 3 |
| B8 | Unchecked name (trademark) | Now | The owner must search "ATLAS" at India's official trademark search before buying a domain or spending on branding (decision S9). Not done | `docs/STEP2-DECISIONS.md` §1 | ❌ owner |
| B9 | Keys in the app | Now (site), step 5 (app) | Site: no secrets exist in the repo or its history; CI secret scan and GitHub push protection block new ones. **Step 5 test:** the shipped app contains no API keys, signing keys or licence secrets (build scanned before release); licences are checked with a public key | gitleaks: 0 findings over full history; push protection on | ✅ site · ⏳ 5 |
| B10 | Unlicensed code | Now (site), step 5 (app) | Site: every package in the production tree is on a licence allow-list; `NOTICES` is generated and checked in CI; font licence listed. **Step 5 test:** the app repo has its own NOTICES and the same CI check | `npm run licences:check`; `/NOTICES.txt` | ✅ site · ⏳ 5 |

### C. Additions
| # | Item | Applies | How it is satisfied / acceptance test | Evidence | Status |
|---|---|---|---|---|---|
| C1 | Invite-only allowlist at launch | Step 6 | **Test:** sign-up refuses an address that isn't on the allowlist with a plain message, and accepts one that is; both automated | - | ⏳ 6 |
| C2 | Strict CSP and security headers | Now | CSP: hash-based, no `unsafe-inline`, no `eval`, generated at build for every page. Script rules are in a `<meta>` tag (works on any host); the rest, with `frame-ancestors`, HSTS, nosniff, Referrer-Policy, Permissions-Policy and cross-origin isolation, is in `_headers`, which **only takes effect on Cloudflare**. GitHub Pages can't send custom headers | `tests/security-headers.test.ts`; `check:export`; Chrome run against Cloudflare's local runtime: 0 violations, eval / injected script / third-party image / non-Formspree post all blocked | ✅ CSP meta · ❌ headers live (step 2) · ⚠️ headers tested locally only |
| C3 | Dependency audit gate and Dependabot | Now | CI fails on a high or critical advisory in shipped dependencies; Dependabot alerts, security updates and weekly version PRs are on | `.github/workflows/deploy.yml`, `.github/dependabot.yml`, repo settings | ✅ |
| C4 | Security-event logging with no personal data | Step 3 | Now: we keep no logs. **Step 3 test:** sign-in failures, lockouts, licence changes and admin actions are logged with opaque IDs; an automated test asserts no email address, IP or message text appears in log output | - | ⏳ 3 |
| C5 | Encrypted backups with a tested restore | Step 3, 6 | Now: no database. The site is rebuilt from git (GitHub plus the owner's clone). **Step 6 test:** an encrypted backup is restored into a fresh project, the app runs against it, and the date is recorded in `PROGRESS.md`; repeated every few months | - | ⏳ 3, 6 |
| C6 | Independent security review before launch | Step 6 | A human reviewer, scoped by `docs/REVIEW-BRIEF.md`. **The AI reviews run in these sessions are not that review** | `docs/REVIEW-BRIEF.md` | ❌ (6) |

### D. Site checklist §6
| # | Item | Applies | How it is satisfied / acceptance test | Evidence | Status |
|---|---|---|---|---|---|
| D1 | HTTPS and HSTS | Now, step 2 | Now: github.io serves HTTPS only and sends its own HSTS header. Step 2: `max-age=31536000; includeSubDomains` on our domain from `_headers`. No `preload` without the owner's decision (hard to undo; a `.app` domain is HTTPS-only in browsers anyway) | Live response headers; `scripts/verify-live-headers.sh` | ✅ HTTPS · ❌ own HSTS (2) |
| D2 | WAF and DDoS at the CDN | Step 2 | Now: whatever GitHub Pages provides; no control. Step 2: Cloudflare free plan in front of the site | - | ⚠️ now · ⏳ 2 |
| D3 | Rate limits on sign-in, sign-up, reset, download, checkout | Steps 3–5 | See A1. None of these endpoints exist | - | ⏳ 3–5 |
| D4 | Input validation and safe database access | Now, step 3 | Now: email shape checked in the browser and again by Formspree; content renders through React, never as raw HTML. **Step 3 test:** every endpoint validates input against a schema on the server and rejects anything else with 400; all queries are parameterised; a test sends malformed and oversized input to each endpoint | `tests/waitlist.test.ts`; no `dangerouslySetInnerHTML` (reviewed) | ✅ now · ⏳ 3 |
| D5 | Secure cookies and short sessions | Step 3 | Now: no cookies at all. **Step 3 test:** session cookies are `HttpOnly`, `Secure`, `SameSite=Lax` or stricter; sessions expire when idle; a test inspects `Set-Cookie`; the Cookie Notice is rewritten and a consent decision logged first | `tests/source-rules.test.ts`; live check: 0 cookies | ✅ now (none) · ⏳ 3 |
| D6 | Secrets in an environment store, rotated | Now, step 3 | Now: there are no secrets. The waitlist endpoint is public by nature and lives in a GitHub Actions variable, not the repo. **Step 3 test:** every secret is in the host's secret store, none in the repo or browser bundle, each has a written rotation step in `docs/INCIDENT-PLAN.md` | gitleaks; `.env.example` only | ✅ now · ⏳ 3 |
| D7 | Separate dev, staging and production keys | Steps 3–4 | **Test:** sandbox and live merchant-of-record keys, and test and production databases, are different credentials in different stores; a production key never appears in a dev environment | - | ⏳ 3–4 |
| D8 | Admin behind 2FA | Step 3 | No admin area exists. **Test:** the admin area refuses a session without 2FA, is limited to the owner, and writes an audit entry for every action | - | ⏳ 3 |
| D9 | Webhook signature verification and replay rejection | Step 4 | **Test:** a webhook with a missing or wrong signature gets 400 and changes nothing; a repeated event ID is ignored; an out-of-order event can't re-activate a cancelled licence; all automated | - | ⏳ 4 |
| D10 | Expiring download links and hash checks | Step 5 | **Test:** a download link works only for an active licence and stops working after its expiry; the page shows a checksum that matches the file | - | ⏳ 5 |
| D11 | Signed builds and updates | Step 5 | **Test:** the app is signed and notarised; the updater rejects an unsigned or wrongly signed update | - | ⏳ 5 |
| D12 | Scan builds for secrets | Now (site), step 5 (app) | Site: gitleaks over the full history on every push and pull request. Step 5: the same over the app build output | CI step "Secret scan" | ✅ site · ⏳ 5 |
| D13 | 2FA on every owner account | Now | The owner must switch it on. See §3 | - | ❌ owner |
| D14 | Incident plan | Now | Written | `docs/INCIDENT-PLAN.md` | ✅ |
| D15 | Disclosure page | Now | `/security/` and `/.well-known/security.txt`, generated from one config and checked to match. GitHub private vulnerability reporting is on. Note: on github.io the file sits under `/atlas-site/`, not at the host root where scanners look; fixed by the domain | `check:export` | ✅ page · ⚠️ file location until step 2 |
| D16 | Private repo for app code with branch protection | Now | The app repo is private. This site repo is public by design and has branch protection on `main` (CI must pass, no force-push, no deletion). Branch protection on the app repo: owner to confirm | `gh` API read-back | ✅ site · ⚠️ app repo unverified |

---

## 3. Owner account checklist (owner must do)

Nobody else can do these. Tick them here when done.

| | Account | Do this |
|---|---|---|
| ☐ | GitHub | 2FA with a passkey or authenticator app (not SMS). Download recovery codes. Review Settings → Applications and remove tokens and apps you don't use |
| ☐ | Gmail (owner inbox) | 2-Step Verification with a passkey or authenticator. It is the recovery address for everything else, so do it first |
| ☐ | Formspree (when created) | 2FA if offered; unique password; "Restrict to domain" on the form |
| ☐ | Registrar (when the domain is bought) | 2FA; **transfer lock on**; auto-renew or a calendar reminder a month before expiry; WHOIS privacy on |
| ☐ | Cloudflare (when created) | 2FA; **DNSSEC on** (then add the DS record at the registrar); API tokens scoped to this one site only |
| ☐ | Zoho Mail (when created) | 2FA; app-specific password for Apple Mail |
| ☐ | Later: Paddle, Apple Developer | 2FA from day one |
| ☐ | All of them | A different password for each, from a password manager. No password shared with anyone or reused |
| ☐ | Recovery codes | Printed or written down and kept offline, not in email or notes |
| ☐ | The Mac | FileVault on, automatic updates on, screen lock, no shared user account |
| ☐ | Repo | When you move to pull requests, turn on "Do not allow bypassing the above settings" in branch protection. Today it is off so you can push directly |

DNSSEC and the transfer lock are easy to switch on and slow to undo if misconfigured (a wrong DS record takes the domain offline until it is fixed). Do DNSSEC only after the site and email work on the domain.

---

## 4. What is switched on in GitHub (read back from the API on 2026-11-19)

| Setting | State |
|---|---|
| Branch protection on `main` | CI job `build` must pass; linear history; force-push and deletion blocked. Admin bypass allowed (so the owner can push directly) |
| Secret scanning | On |
| Push protection | On |
| Dependabot alerts and security updates | On |
| Dependabot version updates | Weekly, npm and GitHub Actions |
| Code scanning (CodeQL default setup) | On |
| Private vulnerability reporting | On |
| Default workflow token | Read-only |
| Actions | Pinned to commit SHAs in the workflow |

## 5. How to check it yourself

```
npm run verify                                     # lint, types, tests, build, export checks, licences
scripts/verify-live-headers.sh https://<domain>    # live headers; fails on github.io by design (no headers there)
```
