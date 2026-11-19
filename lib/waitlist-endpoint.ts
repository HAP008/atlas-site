/**
 * lib/waitlist-endpoint.ts: reads the waitlist endpoint from the environment at build time.
 *
 * Empty or unset → null, and the site shows the "waitlist not connected yet" state.
 * Set but not a usable URL → the build fails, so a typo can't ship a silently broken form.
 * Only https is accepted, except http://localhost for local testing against a mock.
 */

export function parseWaitlistEndpoint(raw: string | undefined): string | null {
  const value = raw?.trim();
  if (!value) return null;

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error("NEXT_PUBLIC_WAITLIST_ENDPOINT is set but is not a valid URL.");
  }
  const isLocal = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  if (url.protocol !== "https:" && !(isLocal && url.protocol === "http:")) {
    throw new Error("NEXT_PUBLIC_WAITLIST_ENDPOINT must use https.");
  }
  return url.toString();
}

export function getWaitlistEndpoint(): string | null {
  // Read literally so Next inlines it at build time.
  return parseWaitlistEndpoint(process.env.NEXT_PUBLIC_WAITLIST_ENDPOINT);
}
