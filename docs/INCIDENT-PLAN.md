# ATLAS SITE: INCIDENT PLAN

What to do when something goes wrong. Written for one person acting alone, possibly from a phone. Written 2026-11-19; re-read it every few months and after any real incident.

An incident is any of: the live site shows something we didn't publish; an account (GitHub, Gmail, Formspree, registrar, Cloudflare, Zoho) shows a login or change that wasn't you; waitlist emails may have been seen by someone else; a secret or an email address was pushed to the public repo; a credible security report arrives.

> ⚠️ **Lawyer input needed.** India's DPDP Act puts duties on us when personal data is breached: telling the Data Protection Board and the affected people, with time limits and required contents set by the Rules. This plan says *when to call the lawyer*, not what the law requires. Get the exact duties in writing before launch and paste them into §5.

---

## 1. First 30 minutes

1. **Write down the time and what you saw.** A note on paper is fine. Screenshots if you can. Don't trust memory later.
2. **Stop the bleeding, in this order:**
   - An account was taken over → from a device you trust, change that account's password, sign out all other sessions, then check 2FA and recovery settings still point to you. Start with the **email inbox**, then **GitHub**, then the registrar and Cloudflare.
   - The live site is wrong → roll back (§3).
   - A secret or an email address is in the repo → rotate it first (§2), clean up second. Assume it was copied the moment it was pushed.
   - The form is being abused → disable the form in Formspree (§2).
3. **Don't destroy evidence.** Don't delete the bad commit, the strange email or the access log entry. Revert, don't rewrite.
4. **Decide if personal data is involved** (waitlist emails seen, changed or lost). If yes or maybe: §5 applies; contact the lawyer today.
5. **Don't announce anything yet.** Facts first.

## 2. Revoke and rotate

| Credential | When | How |
|---|---|---|
| **Formspree form endpoint** | Leaked list, runaway spam, or the endpoint is being abused from elsewhere | Formspree dashboard → the form → disable it (sign-ups stop; the site shows its error message with our email). To rotate: create a new form, set "Restrict to domain", update the GitHub variable `NEXT_PUBLIC_WAITLIST_ENDPOINT`, re-run the deploy workflow, delete the old form. The old endpoint is in every cached copy of the site, so the old form must be deleted, not just abandoned |
| **Formspree account** | Unknown login | Change password, enable/check 2FA, check the notification address is still yours |
| **GitHub password and sessions** | Unknown login or push | Settings → Password; Settings → Sessions → revoke all; check Settings → Emails and 2FA |
| **GitHub tokens and apps** | Any doubt | Settings → Developer settings → Personal access tokens → revoke all. Settings → Applications → revoke OAuth apps and GitHub Apps you don't recognise. On the Mac: `gh auth logout` then `gh auth login`. Check Settings → SSH and GPG keys |
| **GitHub repo** | Unknown commit, workflow or setting change | Repo → Settings → Collaborators (should be only you), Deploy keys (none), Secrets and variables, Webhooks (none), Branch protection (still on), Actions → check recent runs |
| **Cloudflare API tokens** (after step 2) | Leaked or unknown deploy | My Profile → API Tokens → roll or delete. Update the GitHub secret that holds it. Check Account → Audit Log |
| **DNS** (after step 2) | A record you didn't add, or the site points elsewhere | Cloudflare → DNS: remove unknown records. Registrar: check nameservers are still Cloudflare's two, transfer lock is on, contact email is yours. If the registrar account was entered: change its password and call its support |
| **Gmail / Zoho** | Unknown login, forwarding rule or filter | Change password; sign out other sessions; check Forwarding, Filters, "Send mail as", recovery phone and email; delete rules you didn't make |

No API keys, database passwords or signing keys exist yet. When steps 3–5 add them, each gets a row here before it ships.

## 3. Pull or roll back a bad deploy

The live site is whatever the last successful "Deploy site to GitHub Pages" run published from `main`.

- **Roll back to the last good version:** on GitHub → Actions → "Deploy site to GitHub Pages" → open the last good run → "Re-run all jobs". That republishes that commit without changing history. Or from the Mac: `git revert <bad commit>` then `git push` (never force-push; branch protection blocks it anyway).
- **Take the site down entirely:** Repo → Settings → Pages → "Unpublish site". The address returns 404 until the next deploy.
- **Stop all deploys while you investigate:** Repo → Settings → Actions → General → "Disable actions".
- After the move to Cloudflare (step 2): the same, plus Cloudflare → the project → Deployments → "Rollback" on the last good deployment.

Then find how it got there: Actions run history, `git log`, the repo's security log (Settings → Security log).

## 4. Who is told

| Who | When | How |
|---|---|---|
| The lawyer | Any incident that may involve personal data | Same day |
| Waitlist members | When their email address was, or may have been, exposed. Timing and wording per the lawyer and §5 | Individual email from the contact address, BCC'd or one by one |
| The Data Protection Board of India | If the law requires (lawyer decides) | As the Rules prescribe |
| Formspree / GitHub / Cloudflare / registrar support | If the incident is on their side or you're locked out | Their official support pages only. Never a link from an email |
| The person who reported it | Always | Reply: thanks, what we're doing, when to expect news |

### What to tell waitlist members (draft; the lawyer finalises)
Plain words, no minimising:
- what happened and when, as far as we know
- what data was involved (their email address and the fact that they joined the ATLAS waitlist; nothing else is held)
- what we've done about it
- what they should do (expect phishing that mentions ATLAS; we will never ask for a password or payment by email)
- how to reach us, and that they can ask us to delete their address
- that we'll write again if we learn more

## 5. Legal duties (to be completed with the lawyer)

| Question | Answer |
|---|---|
| What counts as a "personal data breach" under the DPDP Act for us? | TBC |
| Who must be told, how fast, and with what details? | TBC |
| Does a breach at Formspree or Google count as ours to report? | TBC |
| Do visitors in the EU or UK add GDPR duties (72-hour rule)? | TBC (GDPR review pending) |
| What must we keep as a record? | TBC |

## 6. Afterwards

Within a week: write down what happened, how it was found, what stopped it and what would have stopped it sooner. Change one thing so it can't happen the same way. Add a row to `docs/SECURITY.md` if a control was missing, and log the decision in `docs/PROJECT.md` §11.
