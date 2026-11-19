# PROGRESS

Updated at the end of every session. Facts here override assumptions elsewhere.

## Current state
- **Step:** 1 (pages + waitlist), with step 2 decisions proposed and the security hardening pass done
- **Status:** live on GitHub Pages. Waitlist endpoint not connected. Step 2 picks not confirmed; no domain yet.
- **Live URL:** https://hap008.github.io/atlas-site/
- **Repo:** https://github.com/HAP008/atlas-site (public; Pages source: GitHub Actions)
- **Waitlist endpoint connected:** no. Site shows "The waitlist isn't connected yet" with a mailto fallback. Formspree proposed (S1), wired, tested only against a local stub ⚠️
- **Pricing:** placeholders only (site.config.ts → `pricing`, status PLACEHOLDER)
- **Security:** hash-based CSP live on every page ✅. Response headers generated and tested in Cloudflare's local runtime only ⚠️; not live until the move ❌. Gate matrix: `docs/SECURITY.md`.

## Shipped features (the only things the site may claim as available)
Confirmed by Huzaifa on 2026-11-19:
- Mac app with its own window and menu-bar icon, no Terminal needed
- Works with the customer's own Claude or ChatGPT account
- Connects to Gmail, Drive, Docs, Slides and Sheets
- Asks before it sends, writes or deletes; kill switch, data export and delete always work

## Done this step
- [x] Foundation: config, layout, nav, footer, favicon, 404, robots, sitemap, social image
- [x] Home, Features, Pricing, FAQ, About, Changelog
- [x] Privacy, Terms, Refunds, Cookies, Acceptable Use, Security (all marked draft)
- [x] Waitlist form with all states tested (mocked endpoint in unit tests; local stub in browser) ⚠️ not against real Formspree
- [x] Deployed to github.io at the correct base path (all 12 pages 200, custom 404, no cookies, no third-party requests)
- [x] Review findings (High) fixed: none were High; all Medium fixed
- [ ] Connect Formspree and submit one real test sign-up (needs Huzaifa)

## Step 2 (domain, email, hosting, merchant of record)
- [x] Decision brief with verified costs (`docs/STEP2-DECISIONS.md`)
- [ ] Owner confirms the picks and buys the domain
- [ ] Hosting move to Cloudflare, headers live, github.io retired
- [ ] Domain switch in code; domain email; merchant-of-record prep

## Security hardening (Prompt 3)
- [x] Threat model, gate matrix with acceptance tests for steps 3–6 (`docs/SECURITY.md`)
- [x] CSP, `_headers`, `security.txt`, `NOTICES.txt` generated at build; export check enforces them
- [x] CI: secret scan (self-tested), audit, licence allow-list, pinned Actions, `--ignore-scripts`, monthly rebuild
- [x] GitHub: branch protection, secret scanning, push protection, Dependabot, CodeQL, private vulnerability reporting
- [x] Claims audit and data inventory; incident plan; brief for the independent review
- [x] Reviews: security reviewer and public-history scan, 0 High; Medium all fixed
- [ ] Live response headers verified with `scripts/verify-live-headers.sh` (needs Cloudflare) ❌
- [ ] One real waitlist sign-up on the live site, then deleted (needs Formspree) ❌
- [ ] Owner: 2FA on Gmail and GitHub; trademark search; lawyer items (S15)

## Waitlist data routine (promised in the Privacy Policy)
- Delete each sign-up from Formspree within 30 days; the Gmail copy is the list.
- Deletion requests: delete from Gmail and empty trash within 30 days.
- Launch email only to sign-ups with `age_confirmed=yes`; delete the list within 30 days after.

## Backlog (logged, not built)
| Idea | Belongs to step |
|---|---|
| Buy domain; robots.txt, sitemap and security.txt at the domain root (crawlers ignore /atlas-site/robots.txt) | 2 |
| Move hosting off GitHub Pages before checkout/accounts (terms bar e-commerce/SaaS); add CSP and security headers there | 2–3 |
| Decide whether to unpublish the six other HAP008 Pages sites that share the hap008.github.io origin (or let the domain move solve it) | 2 |
| Formspree free cap is 50 sign-ups/month: watch it, upgrade or switch before marketing | 2 / 8 |
| Waitlist success check: require Formspree's JSON `ok: true` once the real response shape is confirmed | 2 |
| Address confirmation (double opt-in) for the waitlist, or the launch-email wording in README | 7 |
| Real screenshots and demo video into the Features slots (S10) | before 6 |
| Lawyer/accountant review of all legal drafts; GDPR review | before 4 |
| Pin GitHub Actions to commit SHAs (Dependabot already updates them weekly) | 6 |
| Trademark check on "ATLAS" (S9) | before branding spend |
| Raise HSTS from one day to a week, then a year with includeSubDomains (`site.config.ts` → `security.hsts`) | 2, after the move |
| Rewrite the Privacy and Cookie pages' host paragraph for Cloudflare; keep Cloudflare Web Analytics, Rocket Loader and email obfuscation off (they inject scripts or rewrite HTML) | 2 |
| Re-test `_headers` on real Cloudflare (Workers static assets), including the 404 page | 2 |
| Vendor the Newsreader font files so the build doesn't fetch them from Google | when convenient |
| Remove the university and priorities lines from `docs/PROJECT.md` §2 if they shouldn't be public (owner's call) | now |
| Merge or close Dependabot PRs #1–#4 (TypeScript 7 and ESLint 10 are major bumps; test before merging) | next session |
| Cross-browser check of the CSP in Safari and Firefox | before 6 |

## Session log
Keep the last 5 entries; roll older ones into one dated summary line.

```
2026-11-19 | Step 1 built: foundation, 6 pages, 6 legal drafts, waitlist form, CI deploy; React + security reviews (0 High), all Medium fixed; live on GitHub Pages | 7255e61..HEAD
2026-11-19 | Step 2 decision brief: verified costs for domain, hosting, email, merchant of record; picks proposed | deef7cc
2026-11-19 | Security hardening: CSP live, headers ready for Cloudflare, CI and GitHub gates, security docs; two reviews, 0 High | 957b0b7..HEAD
```
