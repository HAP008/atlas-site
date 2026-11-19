/**
 * Unit tests for scripts/postbuild.ts: CSP hashing, the header set, the Cloudflare
 * _headers file and security.txt. Pure functions only; no build needed.
 */

import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  DENIED_FEATURES,
  headerCsp,
  headersFile,
  inlineScriptHashes,
  insertMetaCsp,
  metaCsp,
  securityHeaders,
  securityTxt,
  type HeaderInputs,
} from "@/scripts/postbuild";

const inputs: HeaderInputs = {
  siteUrl: "https://example.test",
  basePath: "",
  formHost: "formspree.io",
  hstsMaxAge: 31_536_000,
};

const sha = (s: string) => `'sha256-${createHash("sha256").update(s, "utf8").digest("base64")}'`;

describe("inlineScriptHashes", () => {
  it("hashes inline scripts exactly as written, skips external ones, and de-duplicates", () => {
    const html = `<script src="/a.js"></script><script>one()</script><script id="x">two()\n</script><script>one()</script>`;
    expect(inlineScriptHashes(html)).toEqual([sha("one()"), sha("two()\n")]);
  });
});

describe("metaCsp (per-page policy)", () => {
  const policy = metaCsp(inputs, [sha("a"), sha("b")]);
  it("allows only our own scripts plus the hashed inline ones", () => {
    expect(policy).toContain(`script-src 'self' ${sha("a")} ${sha("b")}`);
    expect(policy).toContain("default-src 'self'");
    expect(policy).toContain("script-src-attr 'none'");
  });
  it("never uses unsafe-inline, unsafe-eval, wildcards or data:", () => {
    expect(policy).not.toMatch(/unsafe-|\*|data:|blob:|https?:\/\/(?!formspree\.io)/);
  });
  it("lets the form talk to Formspree and nowhere else", () => {
    expect(policy).toContain("connect-src 'self' https://formspree.io");
    expect(policy).toContain("form-action https://formspree.io");
  });
  it("omits frame-ancestors, which browsers ignore in a meta tag", () => {
    expect(policy).not.toContain("frame-ancestors");
  });
});

describe("headerCsp (response header policy)", () => {
  const policy = headerCsp(inputs);
  it("has frame-ancestors, object-src, base-uri and form-action", () => {
    for (const d of ["frame-ancestors 'none'", "object-src 'none'", "base-uri 'self'", "form-action https://formspree.io"]) {
      expect(policy).toContain(d);
    }
  });
  it("has no default-src or script-src, which would block the hashed scripts allowed by the meta tag", () => {
    expect(policy).not.toMatch(/default-src|script-src(?!-attr)/);
  });
  it("only upgrades insecure requests on an https site", () => {
    expect(policy).toContain("upgrade-insecure-requests");
    expect(headerCsp({ ...inputs, siteUrl: "http://localhost:8788" })).not.toContain("upgrade-insecure-requests");
  });
});

describe("insertMetaCsp", () => {
  it("puts the policy straight after the charset, before any script", () => {
    const html = `<html><head><meta charSet="utf-8"/><script src="/a.js"></script></head></html>`;
    const out = insertMetaCsp(html, "default-src 'self'");
    expect(out.indexOf("Content-Security-Policy")).toBeLessThan(out.indexOf("<script"));
    expect(out).toContain(`<meta charSet="utf-8"/><meta http-equiv="Content-Security-Policy" content="default-src 'self'"/>`);
  });
  it("fails loudly if it can't place the tag or the page already has one", () => {
    expect(() => insertMetaCsp("<html><head></head></html>", "x")).toThrow(/charSet/);
    const once = insertMetaCsp(`<head><meta charSet="utf-8"/></head>`, "x");
    expect(() => insertMetaCsp(once, "x")).toThrow(/already has/);
  });
});

describe("securityHeaders", () => {
  const headers = new Map(securityHeaders(inputs));
  it("sends HSTS for a year with subdomains and without preload", () => {
    expect(headers.get("Strict-Transport-Security")).toBe("max-age=31536000; includeSubDomains");
  });
  it("sets nosniff, frame denial, referrer policy and cross-origin isolation", () => {
    expect(headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(headers.get("X-Frame-Options")).toBe("DENY");
    expect(headers.get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
    expect(headers.get("Cross-Origin-Opener-Policy")).toBe("same-origin");
    expect(headers.get("Cross-Origin-Resource-Policy")).toBe("same-origin");
  });
  it("denies every listed browser feature", () => {
    const policy = headers.get("Permissions-Policy") ?? "";
    for (const feature of DENIED_FEATURES) expect(policy).toContain(`${feature}=()`);
    expect(policy).not.toMatch(/=\((self|\*)/);
  });
});

describe("headersFile (Cloudflare _headers)", () => {
  it("applies the headers to every route and tightens static assets", () => {
    const file = headersFile(inputs);
    expect(file.startsWith("/*\n  Content-Security-Policy: ")).toBe(true);
    expect(file).toContain("/_next/*\n  Content-Security-Policy: default-src 'none'; frame-ancestors 'none'");
    expect(file).toContain("/opengraph-image.png\n  ! Cross-Origin-Resource-Policy\n  Cross-Origin-Resource-Policy: cross-origin");
  });
  it("respects the base path and Cloudflare's 2,000-character line limit", () => {
    const file = headersFile({ ...inputs, basePath: "/atlas-site" });
    expect(file.startsWith("/atlas-site/*\n")).toBe(true);
    expect(Math.max(...file.split("\n").map((l) => l.length))).toBeLessThan(2000);
  });
});

describe("securityTxt", () => {
  it("has the required fields pointing at this site", () => {
    const txt = securityTxt({ siteUrl: "https://example.test", contactEmail: "test@example.com", expires: "2027-05-19" });
    expect(txt).toContain("Contact: mailto:test@example.com\n");
    expect(txt).toContain("Expires: 2027-05-19T00:00:00.000Z\n");
    expect(txt).toContain("Canonical: https://example.test/.well-known/security.txt\n");
    expect(txt).toContain("Policy: https://example.test/security/\n");
  });
});
