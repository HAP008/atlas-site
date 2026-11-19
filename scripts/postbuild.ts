/**
 * scripts/postbuild.ts: runs after `next build` (see package.json "build").
 *
 * 1. Adds a Content-Security-Policy <meta> tag to every HTML page in ./out, listing the
 *    SHA-256 hash of each inline script Next put on that page. No 'unsafe-inline', no nonce.
 * 2. Writes ./out/_headers (Cloudflare format): security headers for every route.
 * 3. Writes ./out/.well-known/security.txt from site.config.ts.
 *
 * Why the script rules live in a <meta> tag and not the header: Cloudflare limits each
 * _headers line to 2,000 characters, and the home page alone needs ~2,000 characters of
 * hashes. Browsers enforce every CSP they receive, so header + meta together give one
 * strict policy. The header deliberately has no default-src/script-src (it would block
 * the hashed scripts); it carries everything else, including the header-only
 * frame-ancestors. Static assets get an extra `default-src 'none'` policy.
 *
 * If this fails, the build fails: a page can't ship without its CSP.
 * Depends on: site.config.ts (site URL, base path, form host, security.txt expiry).
 */

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export type HeaderInputs = {
  /** e.g. "https://example.app" or "https://hap008.github.io/atlas-site" */
  siteUrl: string;
  /** "" at a domain root, "/atlas-site" on GitHub Pages */
  basePath: string;
  /** The only third-party host the site talks to, e.g. "formspree.io" */
  formHost: string;
  hstsMaxAge: number;
};

/** Every browser feature the site doesn't use is switched off. It uses none of them. */
export const DENIED_FEATURES = [
  "accelerometer",
  "autoplay",
  "bluetooth",
  "browsing-topics",
  "camera",
  "display-capture",
  "encrypted-media",
  "fullscreen",
  "geolocation",
  "gyroscope",
  "hid",
  "idle-detection",
  "magnetometer",
  "microphone",
  "midi",
  "payment",
  "picture-in-picture",
  "publickey-credentials-get",
  "screen-wake-lock",
  "serial",
  "usb",
  "xr-spatial-tracking",
] as const;

const INLINE_SCRIPT = /<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/g;

export function inlineScriptHashes(html: string): string[] {
  const hashes = [...html.matchAll(INLINE_SCRIPT)].map(
    (m) => `'sha256-${createHash("sha256").update(m[1], "utf8").digest("base64")}'`,
  );
  return [...new Set(hashes)];
}

function sharedDirectives({ siteUrl, formHost }: HeaderInputs): string[] {
  const form = `https://${formHost}`;
  return [
    "style-src 'self'",
    "img-src 'self'",
    "font-src 'self'",
    `connect-src 'self' ${form}`,
    "media-src 'self'",
    "manifest-src 'self'",
    "object-src 'none'",
    "frame-src 'none'",
    "child-src 'none'",
    "worker-src 'none'",
    "base-uri 'self'",
    `form-action ${form}`,
    // Only meaningful (and only safe for local http testing) on an https site.
    ...(siteUrl.startsWith("https://") ? ["upgrade-insecure-requests"] : []),
  ];
}

/** The per-page policy for the <meta> tag: the script rules plus everything a meta tag can carry. */
export function metaCsp(inputs: HeaderInputs, scriptHashes: string[]): string {
  return [
    "default-src 'self'",
    ["script-src 'self'", ...scriptHashes].join(" "),
    "script-src-attr 'none'",
    ...sharedDirectives(inputs),
  ].join("; ");
}

/** The policy sent as a response header on every route. No default-src/script-src: see the file header. */
export function headerCsp(inputs: HeaderInputs): string {
  return ["script-src-attr 'none'", ...sharedDirectives(inputs), "frame-ancestors 'none'"].join("; ");
}

export function insertMetaCsp(html: string, policy: string): string {
  if (/http-equiv="Content-Security-Policy"/i.test(html)) {
    throw new Error("page already has a CSP meta tag (postbuild ran twice?)");
  }
  const anchor = /<meta charSet="utf-8"\s*\/>/i;
  if (!anchor.test(html)) throw new Error("could not find <meta charSet> to place the CSP after");
  // Right after the charset: before any script or stylesheet, so the policy governs all of them.
  return html.replace(anchor, (m) => `${m}<meta http-equiv="Content-Security-Policy" content="${policy}"/>`);
}

export function securityHeaders(inputs: HeaderInputs): [string, string][] {
  return [
    ["Content-Security-Policy", headerCsp(inputs)],
    // No `preload`: joining the browser preload list is hard to undo and needs the owner's decision.
    ["Strict-Transport-Security", `max-age=${inputs.hstsMaxAge}; includeSubDomains`],
    ["X-Content-Type-Options", "nosniff"],
    ["X-Frame-Options", "DENY"],
    ["Referrer-Policy", "strict-origin-when-cross-origin"],
    ["Permissions-Policy", DENIED_FEATURES.map((f) => `${f}=()`).join(", ")],
    ["Cross-Origin-Opener-Policy", "same-origin"],
    ["Cross-Origin-Embedder-Policy", "require-corp"],
    ["Cross-Origin-Resource-Policy", "same-origin"],
  ];
}

/** Cloudflare `_headers` file. Rules that match the same URL are combined. */
export function headersFile(inputs: HeaderInputs): string {
  const p = inputs.basePath;
  const lines: string[] = [`${p}/*`, ...securityHeaders(inputs).map(([k, v]) => `  ${k}: ${v}`)];
  // Static files never need to load anything. A second policy only ever tightens the first.
  for (const path of [`${p}/_next/*`, `${p}/icon.svg`, `${p}/sitemap.xml`]) {
    lines.push(path, "  Content-Security-Policy: default-src 'none'; frame-ancestors 'none'");
  }
  // The social preview image must be loadable from other sites (link previews).
  lines.push(`${p}/opengraph-image.png`, "  ! Cross-Origin-Resource-Policy", "  Cross-Origin-Resource-Policy: cross-origin");
  const tooLong = lines.find((l) => l.length > 2000);
  if (tooLong) throw new Error(`_headers line over Cloudflare's 2,000 character limit: ${tooLong.slice(0, 60)}…`);
  return `${lines.join("\n")}\n`;
}

export function securityTxt(args: { siteUrl: string; contactEmail: string; expires: string }): string {
  return [
    `Contact: mailto:${args.contactEmail}`,
    `Expires: ${args.expires}T00:00:00.000Z`,
    "Preferred-Languages: en",
    `Canonical: ${args.siteUrl}/.well-known/security.txt`,
    `Policy: ${args.siteUrl}/security/`,
    "",
  ].join("\n");
}

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

async function main() {
  const root = join(dirname(fileURLToPath(import.meta.url)), "..");
  const out = join(root, "out");
  if (!existsSync(out)) throw new Error("out/ not found. Run `next build` first.");

  // Loaded by URL so Node runs the TypeScript file directly; typed from the module itself.
  const config: typeof import("../site.config") = await import(pathToFileURL(join(root, "site.config.ts")).href);
  const { siteConfig } = config;
  const inputs: HeaderInputs = {
    siteUrl: siteConfig.siteUrl,
    basePath: siteConfig.basePath,
    formHost: siteConfig.waitlistService.host,
    hstsMaxAge: siteConfig.security.hstsMaxAgeSeconds,
  };

  const daysLeft = (Date.parse(`${siteConfig.security.securityTxtExpires}T00:00:00Z`) - Date.now()) / 86_400_000;
  if (!(daysLeft > 0)) {
    throw new Error("security.txt has expired. Set a new date (under a year away) in site.config.ts → security.securityTxtExpires.");
  }
  if (daysLeft < 30) {
    process.stdout.write(`::warning::security.txt expires in ${Math.floor(daysLeft)} days. Update site.config.ts → security.securityTxtExpires.\n`);
  }

  const pages = walk(out).filter((f) => f.endsWith(".html"));
  let maxHashes = 0;
  for (const file of pages) {
    const html = readFileSync(file, "utf8");
    const hashes = inlineScriptHashes(html);
    maxHashes = Math.max(maxHashes, hashes.length);
    try {
      writeFileSync(file, insertMetaCsp(html, metaCsp(inputs, hashes)));
    } catch (error) {
      throw new Error(`${relative(out, file)}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  writeFileSync(join(out, "_headers"), headersFile(inputs));
  mkdirSync(join(out, ".well-known"), { recursive: true });
  writeFileSync(
    join(out, ".well-known", "security.txt"),
    securityTxt({
      siteUrl: siteConfig.siteUrl,
      contactEmail: siteConfig.contactEmail,
      expires: siteConfig.security.securityTxtExpires,
    }),
  );

  process.stdout.write(
    `postbuild OK: CSP added to ${pages.length} pages (up to ${maxHashes} script hashes each), _headers and security.txt written\n`,
  );
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((error: unknown) => {
    process.stderr.write(`postbuild FAILED: ${error instanceof Error ? error.message : String(error)}\n`);
    process.exit(1);
  });
}
