/**
 * Unit tests for lib/waitlist.ts and lib/waitlist-endpoint.ts.
 * The form service is always mocked: no real network calls, no real email addresses.
 */

import { describe, expect, it, vi } from "vitest";
import { isValidEmail, submitToWaitlist } from "@/lib/waitlist";
import { parseWaitlistEndpoint } from "@/lib/waitlist-endpoint";

const ENDPOINT = "https://forms.test.invalid/f/abc123";
const EMAIL = "test@example.com";

function mockFetch(status: number) {
  return vi.fn<typeof fetch>().mockResolvedValue(new Response("{}", { status }));
}

describe("isValidEmail", () => {
  it.each(["test@example.com", " test@example.com ", "a.b+c@sub.example.co.uk"])("accepts %s", (v) => {
    expect(isValidEmail(v)).toBe(true);
  });
  it.each(["", "test", "test@", "test@example", "te st@example.com", "@example.com"])("rejects %s", (v) => {
    expect(isValidEmail(v)).toBe(false);
  });
});

describe("submitToWaitlist", () => {
  it("posts only the email and the 18+ confirmation, without cookies", async () => {
    const fetchImpl = mockFetch(200);
    const result = await submitToWaitlist(ENDPOINT, ` ${EMAIL} `, { fetchImpl });

    expect(result).toEqual({ kind: "success" });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe(ENDPOINT);
    expect(init?.method).toBe("POST");
    expect(init?.credentials).toBe("omit");
    expect(new Headers(init?.headers).get("Accept")).toBe("application/json");
    const body = init?.body as URLSearchParams;
    expect([...body.keys()].sort()).toEqual(["age_confirmed", "email"]);
    expect(body.get("email")).toBe(EMAIL);
    expect(body.get("age_confirmed")).toBe("yes");
  });

  it.each([
    [422, "invalid-email"],
    [400, "invalid-email"],
    [429, "rate-limited"],
    [500, "error"],
    [403, "error"],
  ])("maps HTTP %i to %s", async (status, kind) => {
    expect(await submitToWaitlist(ENDPOINT, EMAIL, { fetchImpl: mockFetch(status) })).toEqual({ kind });
  });

  it("returns error when the network fails", async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockRejectedValue(new TypeError("Failed to fetch"));
    expect(await submitToWaitlist(ENDPOINT, EMAIL, { fetchImpl })).toEqual({ kind: "error" });
  });

  it("gives up after the timeout", async () => {
    const fetchImpl = vi.fn<typeof fetch>((_url, init) => {
      return new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () => reject(new DOMException("aborted", "AbortError")));
      });
    });
    expect(await submitToWaitlist(ENDPOINT, EMAIL, { fetchImpl, timeoutMs: 10 })).toEqual({ kind: "error" });
  });
});

describe("parseWaitlistEndpoint", () => {
  it("treats empty or unset as not connected", () => {
    expect(parseWaitlistEndpoint(undefined)).toBeNull();
    expect(parseWaitlistEndpoint("")).toBeNull();
    expect(parseWaitlistEndpoint("   ")).toBeNull();
  });
  it("accepts https on the form service named in the Privacy Policy, and local http for testing", () => {
    expect(parseWaitlistEndpoint("https://formspree.io/f/test123")).toBe("https://formspree.io/f/test123");
    expect(parseWaitlistEndpoint("http://localhost:4010/ok", { allowLocal: true })).toBe("http://localhost:4010/ok");
  });
  it("refuses a localhost endpoint unless the build explicitly opts in", () => {
    expect(() => parseWaitlistEndpoint("http://localhost:4010/ok")).toThrow(/NEXT_PUBLIC_ALLOW_LOCAL_BUILD/);
  });
  it("fails loudly on a bad value", () => {
    expect(() => parseWaitlistEndpoint("not a url")).toThrow(/not a valid URL/);
    expect(() => parseWaitlistEndpoint("http://formspree.io/f/test123")).toThrow(/https/);
  });
  it("refuses any other host, so data can't silently go somewhere the Privacy Policy doesn't name", () => {
    expect(() => parseWaitlistEndpoint(ENDPOINT)).toThrow(/must be on formspree\.io/);
    expect(() => parseWaitlistEndpoint("https://formspree.io.evil.test/f/x")).toThrow(/must be on formspree\.io/);
  });
});
