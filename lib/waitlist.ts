/**
 * lib/waitlist.ts: email check and the one network call the site makes.
 *
 * Sends the email address and the 18+ confirmation to the waitlist form service
 * (Formspree-style endpoint) as a plain form post that expects a JSON reply.
 * Form-encoded body + Accept header = a "simple" CORS request, so no preflight.
 * credentials: "omit" means the browser sends no cookies to the form service.
 *
 * Never logs. The email address only ever leaves the browser in this request body.
 * If the service changes its API, submissions fail with the "error" result and
 * the form tells the visitor to email us instead.
 */

export type WaitlistResult =
  | { kind: "success" }
  | { kind: "invalid-email" }
  | { kind: "rate-limited" }
  | { kind: "error" };

// Deliberately simple: something@something.tld, no spaces. The form service validates again.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(value: string): boolean {
  const email = value.trim();
  return email.length <= 254 && EMAIL_PATTERN.test(email);
}

export async function submitToWaitlist(
  endpoint: string,
  email: string,
  options: { fetchImpl?: typeof fetch; timeoutMs?: number } = {},
): Promise<WaitlistResult> {
  const { fetchImpl = fetch, timeoutMs = 15_000 } = options;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetchImpl(endpoint, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new URLSearchParams({ email: email.trim(), age_confirmed: "yes" }),
      credentials: "omit",
      signal: controller.signal,
    });
    if (response.ok) return { kind: "success" };
    if (response.status === 429) return { kind: "rate-limited" };
    if (response.status === 400 || response.status === 422) return { kind: "invalid-email" };
    return { kind: "error" };
  } catch {
    // Network failure, blocked request or timeout. Nothing to log: the UI explains what to do.
    return { kind: "error" };
  } finally {
    clearTimeout(timer);
  }
}
