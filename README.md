# ATLAS site

Public website for ATLAS, a local-first personal AI assistant for Mac. Static Next.js export, hosted on GitHub Pages at https://hap008.github.io/atlas-site/.

This repo is the website only. The app and licence service live in a separate private repo. Never put app code, keys or customer data here: this repo is public.

## Docs
- `CLAUDE.md`: rules for Claude Code sessions
- `docs/PROJECT.md`: facts, open decisions, decision log
- `docs/SITE-PLAN.md`: the full plan and 9-step build order
- `docs/CONTENT-RULES.md`: voice and what we may claim
- `PROGRESS.md`: current state
- `docs/STEP2-DECISIONS.md`: domain, hosting, email and merchant-of-record picks with verified costs
- `docs/SECURITY.md`: threat model, security gate matrix, owner account checklist
- `docs/DATA-INVENTORY.md`: every item of personal data, and what backs each claim on the legal pages
- `docs/INCIDENT-PLAN.md`: what to do when something goes wrong
- `docs/REVIEW-BRIEF.md`: scope for the independent security review before launch
- `NOTICES`: third-party licences (generated; published at `/NOTICES.txt`)

## Run locally
Needs Node 24 or newer.
```
npm install
cp .env.example .env.local   # leave the value empty to see the "not connected yet" state
npm run dev                  # http://localhost:3000/atlas-site/
```

## Checks (all run in CI before every deploy)
```
npm run lint            # ESLint
npm run typecheck       # tsc --noEmit
npm test                # Vitest: waitlist form states, source rules (no console, no any, no trackers)
npm run build           # static export into ./out, then adds the CSP, _headers, security.txt and NOTICES.txt
npm run check:export    # links and anchors, draft lines, CSP covers every inline script, no third-party scripts
npm run licences:check  # licence allow-list, NOTICES up to date (run `npm run licences` after changing dependencies)
npm run verify          # all of the above in order
```
CI also scans the full git history for secrets with gitleaks (`.gitleaks.toml`) and audits shipped dependencies.

## Security
- Every page carries a hash-based Content Security Policy (no `unsafe-inline`), written into the HTML at build time by `scripts/postbuild.ts`. If you add an inline `style="…"` or an `onclick="…"`, the export check fails: use classes and React handlers.
- `out/_headers` holds the response headers (HSTS, frame blocking, and so on). **They only take effect on Cloudflare.** GitHub Pages ignores the file.
- Check a live site: `scripts/verify-live-headers.sh https://<domain>`. On github.io it fails by design.
- `security.txt` expires on the date in `site.config.ts` → `security.securityTxtExpires`. The build warns 30 days before and fails after. Set a new date (under a year away) when it does.
- Details and the pre-launch gate: `docs/SECURITY.md`.

## Where things live
- `site.config.ts`: name, tagline, contact email, site URL (base path derives from it), waitlist env var name, PLACEHOLDER pricing
- `content/`: all page copy as typed data, including the legal drafts in `content/legal/`
- `components/waitlist-form.tsx` + `lib/waitlist.ts`: the only network call the site makes

## Connect the waitlist (Formspree)
1. Create a free form at formspree.io, sending to huzaifapardiwala@gmail.com. Copy its endpoint (`https://formspree.io/f/…`).
2. In the form's settings: turn on **Restrict to domain** with `hap008.github.io` (stops other sites reusing the endpoint; update it when the domain changes) and keep spam filtering on.
3. GitHub → repo Settings → Secrets and variables → Actions → **Variables** → New variable: `NEXT_PUBLIC_WAITLIST_ENDPOINT` = that URL. (A variable, not a secret: it ends up in public JavaScript anyway.) The build refuses any host other than `formspree.io`, because the Privacy Policy names Formspree.
4. Re-run the "Deploy site to GitHub Pages" workflow. Without the variable, the site shows "The waitlist isn't connected yet."
5. Submit one real test sign-up from the live site and check it arrives in Gmail.

### Waitlist data routine (the Privacy Policy promises this)
- Formspree's free plan: 50 sign-ups a month, and the dashboard only shows the last 30 days. **Delete each sign-up from Formspree within 30 days**; the copy in Gmail is the list.
- Deletion requests: delete from Gmail and empty Gmail's trash within 30 days.
- At launch: email only sign-ups that have `age_confirmed=yes`, then delete the list within 30 days.
- Nobody confirms their address (no double opt-in), so the launch email should say "you, or someone using your address, asked to hear about ATLAS; reply and we'll delete it."

## Move to a real domain
Change `DEFAULT_SITE_URL` in `site.config.ts` (one line). The base path, sitemap, robots, social image URLs, `_headers` and `security.txt` follow. A single build can override it with the `NEXT_PUBLIC_SITE_URL` env var (used to deploy to a second host during the move).

Contact: huzaifapardiwala@gmail.com
