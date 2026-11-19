# ATLAS SITE: DATA INVENTORY AND CLAIMS AUDIT

Every item of personal data we or a service acting for us hold, and every claim the public pages make about it. Written 2026-11-19. Update both tables whenever a form field, a service or a legal sentence changes.

Rule: if it isn't in table 1, we must not be collecting it. If a claim in table 2 loses its backing, change the sentence or restore the behaviour before deploying.

---

## 1. Personal data inventory

| # | Data | Whose | Why we have it | Where it is | Who can see it | Kept until | How it is deleted |
|---|---|---|---|---|---|---|---|
| 1 | Waitlist email address | Visitor | To announce the launch. Nothing else | Formspree (US) | Owner, Formspree | Deleted from Formspree within 30 days of arriving | Owner deletes the submission in the Formspree dashboard |
| 2 | "I'm 18 or older" = yes | Visitor | 18+ rule | With item 1 | Same | Same | Same |
| 3 | Time of sign-up | Visitor | Recorded by Formspree automatically | With item 1 | Same | Same | Same |
| 4 | IP address, browser type, referring page | Visitor | We don't want it. Formspree records it for its own security and spam filtering, per its privacy policy | Formspree's systems | Formspree. Whether the dashboard or the notification email shows it to us: **unverified until the form is connected** | Formspree's policy: "only for as long as is necessary" | We can't. If the dashboard exposes it, it goes when the submission is deleted |
| 5 | Copy of each sign-up (items 1–3) | Visitor | It is the actual list once the Formspree copy is deleted | Owner's Gmail inbox (Google) | Owner, Google | Launch announcement sent, then deleted within 30 days; or within 30 days of a deletion request | Owner deletes the email and empties Gmail's trash |
| 6 | Emails people send us (waitlist requests while the form is not connected, questions, security reports) | Sender | To reply | Owner's Gmail inbox | Owner, Google | As long as needed to help, then deleted | Owner deletes; trash emptied |
| 7 | Private security reports on GitHub | Reporter | To fix the problem | GitHub (private advisory on the repo) | Owner, GitHub | Until fixed and closed | Owner closes or deletes the advisory |
| 8 | Visitor IP addresses in request logs | Visitor | We don't want them. GitHub Pages logs them "for security purposes" | GitHub | GitHub only. We have no access | GitHub's policy | We can't |
| 9 | After the move in step 2: Cloudflare request logs (IP, user agent) | Visitor | Same: the host's own logging | Cloudflare | Cloudflare; the owner sees only aggregate analytics on the free plan (**to verify at the move**) | Cloudflare's policy | We can't. Web Analytics beacon must stay **off** (it is a third-party script) |
| 10 | Owner's name and email in git commits and on the site | Owner | Authorship and public contact | Public repo, public site | Everyone | - | - |

**Not collected anywhere:** names, phone numbers, passwords, payment details, location, device identifiers, cookies, browser storage, analytics events, message contents. The site has no database, no server code and no logs of its own.

**Beyond the minimum?** Item 4 is the only data we don't need. It is collected by Formspree, not by us, and can't be switched off; the Privacy Policy says so. Nothing to remove on our side. Test screenshots in the gitignored `verification/` folder show only `test@example.com`.

**Changes coming that must update this file and the Privacy Policy first:**
- Step 2: Cloudflare replaces GitHub Pages (item 8 → 9); Zoho Mail replaces Gmail for the public address (items 5–6 move).
- Step 3: accounts (email, plan, licence status, device hashes). Step 4: the merchant of record holds billing data; we hold a customer ID and subscription status only.

### Deletion routine (the promise in the Privacy Policy)
1. Each week while the list is open: in Formspree, delete submissions older than three weeks. The Gmail copies remain.
2. Deletion request by email: delete the person's sign-up email(s) from Gmail and any copy still in Formspree, empty Gmail's trash, reply to confirm. Within 30 days.
3. After the launch announcement: delete all sign-up emails from Gmail and Formspree and empty the trash, within 30 days.
4. Launch email goes only to sign-ups with `age_confirmed=yes`, and says "you, or someone using your address, asked to hear about ATLAS; reply and we'll delete it."

This routine is manual. ⚠️ It has not been exercised yet: no sign-up exists because the form isn't connected.

---

## 2. Claims audit

Every factual claim about the **site** on the Privacy, Terms, Cookie, Acceptable Use and Security pages, the FAQ and the footer, and what backs it. "Code" = enforced by a test or build check that fails if it stops being true. "Routine" = depends on the owner doing something by hand.

| Claim | Page | Backing | Kind |
|---|---|---|---|
| The site sets no cookies | Privacy, Cookies, Security, footer | `tests/source-rules.test.ts` (no `document.cookie`); live check: no `Set-Cookie`, `document.cookie` empty. Limit: other projects on the shared `hap008.github.io` address could set cookies there; fixed by the domain | Code |
| No analytics or trackers | Privacy, Cookies, footer | `tests/source-rules.test.ts` (tracker names); `check:export` (no third-party scripts); CSP allows scripts from this site only | Code |
| Doesn't use local storage or similar | Cookies | `tests/source-rules.test.ts` (`localStorage`, `sessionStorage`) | Code |
| Loads no third-party scripts; fonts served from the site | Privacy, Cookies, Security | `check:export`; CSP `script-src 'self'`, `font-src 'self'`; live check: 0 third-party requests | Code |
| Pages tell the browser to run scripts and load fonts and images only from this site, and send form data only to Formspree | Privacy | CSP `<meta>` tag on every page; `check:export` recomputes each script hash and fails on `unsafe-*` | Code |
| The form sends only your email and the 18+ confirmation | Privacy | `tests/waitlist.test.ts` asserts the exact body keys | Code |
| Sent over HTTPS, straight to the form service | Privacy, Security | Build refuses a non-https endpoint or any host but formspree.io (`lib/waitlist-endpoint.ts`, tested) | Code |
| The form tells the browser not to send cookies | Privacy, Cookies | `credentials: "omit"` asserted in `tests/waitlist.test.ts`. True for the JavaScript path only; the pages now say that without JavaScript the form goes to Formspree's own site | Code (corrected this session) |
| It never writes your email address to logs | Privacy | No `console.*` in site code (`tests/source-rules.test.ts`); console spy test; no-JavaScript submit is a POST, never a URL | Code |
| No database or server of its own | Privacy, Security | Static export (`output: 'export'`); no API routes | Code |
| The form requires the 18+ confirmation | Terms, Privacy | `tests/waitlist-form.test.tsx`: required by the browser before JavaScript loads and by our code after. Self-declared only, and a script posting straight to Formspree can skip the form; the launch email goes only to `age_confirmed=yes`. The pages don't claim verification | Code + routine |
| We collect nothing ourselves when you visit; the host logs IP addresses and we can't see them | Privacy, Cookies | GitHub's documentation (checked 2026-11-19). Must be rewritten for Cloudflare at the move | Provider doc |
| Formspree records IP address, browser type, referring page and time | Privacy | Formspree's privacy policy (checked 2026-11-19) | Provider doc |
| Formspree stores the sign-up and emails a copy to our inbox; Google hosts the inbox; GitHub hosts the site | Privacy | How the services work. ⚠️ Formspree part untested until connected | Provider doc |
| Nobody else receives your data | Privacy | CSP `connect-src` and `form-action` allow only this site and the build's one Formspree form (nothing at all while the form isn't connected) | Code |
| Data may be stored outside India, including the US | Privacy | Formspree and GitHub privacy policies | Provider doc |
| We use your email only to announce the launch; no newsletters; never sold or rented | Privacy, Terms, form | Owner's practice. Nothing technical prevents misuse | Routine |
| Deleted from Formspree within 30 days; whole list deleted within 30 days after launch; deletion requests done within 30 days including trash | Privacy, form success message | Deletion routine above. ⚠️ Not yet exercised | Routine |
| We reply to rights requests within the time the law requires | Privacy | Owner's practice. The DPDP Rules' exact time limits need the lawyer | Routine + lawyer |
| We'll tell you and the authorities about a breach as the law requires | Privacy | `docs/INCIDENT-PLAN.md`. DPDP breach-notification duties need the lawyer | Routine + lawyer |
| We'll email the waitlist before a change to how we use data | Privacy, Terms | Owner's practice | Routine |
| We aim to reply to security reports within 7 days (an aim, not a guarantee) | Security | Owner's practice; one person. Value lives in `site.config.ts` | Routine |
| We won't take legal action against good-faith reporters (for ourselves only) | Security | Owner's promise. **Flagged for the lawyer** | Routine + lawyer |
| The same contact details are at `/.well-known/security.txt` | Security | `check:export` fails if the two differ; the file is re-stamped on every build and a monthly scheduled rebuild keeps it from expiring | Code |
| Prices are placeholders; nothing can be bought | Pricing, Terms, Refunds | `site.config.ts` `status: "PLACEHOLDER"`; `check:export` requires the "to be confirmed" note; no checkout exists | Code |
| Legal pages are drafts | Every legal page, footer | `check:export` requires the draft line at the top of each | Code |

### Claims about the ATLAS app (not checkable from this repo)
"Runs on your Mac and we don't receive your data", "requests go to the AI provider you connect", "asks before it sends, writes or deletes", "kill switch, export and delete always work", "Mac only", "bring your own Claude or ChatGPT", "connects to Gmail, Drive, Docs, Slides and Sheets".

Backing: confirmed by the owner on 2026-11-19 and recorded in `PROGRESS.md`. **Nothing in this repo can test them.** They must be re-confirmed against the app before launch (independent review scope, `docs/REVIEW-BRIEF.md`), and removed from the site the day any of them stops being true.

### Fixed in this audit
- "…sends your details… without any cookies" (Privacy) and the Cookie Notice's form paragraph were only true when JavaScript runs. Without it the browser goes to Formspree's own site. Both pages now say so.
- The Security page's reply time now says it is an aim from one person, and the legal-action promise is limited to ourselves.
- Added a second, private reporting route (GitHub) to the Security page and `security.txt`.
