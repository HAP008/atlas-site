# PROGRESS

Updated at the end of every session. Facts here override assumptions elsewhere.

## Current state
- **Step:** 1 (pages + waitlist)
- **Status:** built, reviewed, deployed. Waitlist endpoint not yet connected.
- **Live URL:** https://hap008.github.io/atlas-site/
- **Repo:** https://github.com/HAP008/atlas-site (public; Pages source: GitHub Actions)
- **Waitlist endpoint connected:** no. Site shows "The waitlist isn't connected yet" with a mailto fallback. Formspree proposed (S1), wired, tested only against a local stub ⚠️
- **Pricing:** placeholders only (site.config.ts → `pricing`, status PLACEHOLDER)

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

## Session log
Keep the last 5 entries; roll older ones into one dated summary line.

```
2026-11-19 | Step 1 built: foundation, 6 pages, 6 legal drafts, waitlist form, CI deploy; React + security reviews (0 High), all Medium fixed; live on GitHub Pages | 7255e61..HEAD
```
