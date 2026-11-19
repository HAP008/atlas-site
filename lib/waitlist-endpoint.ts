/**
 * lib/waitlist-endpoint.ts: reads the waitlist endpoint from the environment at build time.
 *
 * Empty or unset → null, and the site shows the "waitlist not connected yet" state.
 * Set but not a usable URL → the build fails, so a typo can't ship a silently broken form.
 * Only https on the form service named in the Privacy Policy (site.config.ts → waitlistService.host)
 * is accepted, so the policy's "sent only to <service>" stays true. A localhost endpoint (for
 * testing against a stub) is accepted only when NEXT_PUBLIC_ALLOW_LOCAL_BUILD=1 is also set, so
 * a stray value can never ship in a real build.
 */

import { siteConfig } from "@/site.config";

export function parseWaitlistEndpoint(
  raw: string | undefined,
  options: { allowedHost?: string; allowLocal?: boolean } = {},
): string | null {
  const { allowedHost = siteConfig.waitlistService.host, allowLocal = false } = options;
  const value = raw?.trim();
  if (!value) return null;

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error("NEXT_PUBLIC_WAITLIST_ENDPOINT is set but is not a valid URL.");
  }
  const isLocal = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  if (isLocal) {
    if (!allowLocal) {
      throw new Error("NEXT_PUBLIC_WAITLIST_ENDPOINT points at localhost. Set NEXT_PUBLIC_ALLOW_LOCAL_BUILD=1 for a local test build.");
    }
    if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error("Local endpoint must be http(s).");
    return url.toString();
  }
  if (url.protocol !== "https:") {
    throw new Error("NEXT_PUBLIC_WAITLIST_ENDPOINT must use https.");
  }
  if (url.hostname !== allowedHost) {
    throw new Error(
      `NEXT_PUBLIC_WAITLIST_ENDPOINT must be on ${allowedHost} (the service named in the Privacy Policy). Change site.config.ts and the policy together.`,
    );
  }
  return url.toString();
}

export function getWaitlistEndpoint(): string | null {
  // Read literally so Next inlines it at build time.
  return parseWaitlistEndpoint(process.env.NEXT_PUBLIC_WAITLIST_ENDPOINT, {
    allowLocal: process.env.NEXT_PUBLIC_ALLOW_LOCAL_BUILD === "1",
  });
}
