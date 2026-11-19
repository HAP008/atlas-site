/**
 * scripts/check-export.ts: checks the built static export in ./out.
 * Run after `npm run build`: `npm run check:export`. Exits 1 on any failure.
 *
 * Checks:
 *  1. Every page in sitemap.xml exists as a file, plus 404.html, robots.txt, .nojekyll.
 *  2. Every internal href/src in every HTML file resolves to a file in ./out,
 *     carries the base path, and every #anchor exists on its target page.
 *  3. Every legal page opens with the "Draft: not yet reviewed…" line.
 *  4. Pricing shows "launch pricing to be confirmed".
 *  5. No third-party scripts or stylesheets, and no email address other than the contact email.
 *  6. Security: every page has a hash-based CSP covering each inline script, no 'unsafe-*',
 *     no inline handlers or styles, no source maps, no eval; _headers and security.txt are complete.
 *
 * Reads the base path from out/robots.txt (written from site.config.ts), so it
 * never drifts from the real config.
 */

import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { JSDOM } from "jsdom";

const OUT = join(import.meta.dirname, "..", "out");
const CONTACT_EMAIL = "huzaifapardiwala@gmail.com";
const DRAFT_LINE = "Draft: not yet reviewed by a lawyer or accountant";
const LEGAL_PAGES = ["privacy", "terms", "refunds", "cookies", "acceptable-use", "security"];

/** form-action must be 'none' (waitlist not connected) or exactly one Formspree form, never the whole service. */
const FORM_ACTION = /form-action (?:'none'|https:\/\/formspree\.io\/f\/[A-Za-z0-9]+)(?:;|$)/;

const failures: string[] = [];
const fail = (msg: string) => failures.push(msg);

if (!existsSync(OUT)) {
  process.stderr.write("out/ not found. Run `npm run build` first.\n");
  process.exit(1);
}

function walk(dir: string): string[] {
  let files: string[] = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) files = files.concat(walk(full));
    else files.push(full);
  }
  return files;
}

// --- base path and site URL from robots.txt -------------------------------------------
const robotsPath = join(OUT, "robots.txt");
if (!existsSync(robotsPath)) fail("robots.txt missing");
const robots = existsSync(robotsPath) ? readFileSync(robotsPath, "utf8") : "";
const sitemapMatch = robots.match(/Sitemap:\s*(\S+)/i);
const sitemapUrl = sitemapMatch ? new URL(sitemapMatch[1]) : null;
if (!sitemapUrl) fail("robots.txt has no Sitemap line");
const basePath = sitemapUrl ? sitemapUrl.pathname.replace(/\/sitemap\.xml$/, "") : "";
const siteOrigin = sitemapUrl ? sitemapUrl.origin : "";

/** Map a URL path under the base path to a file in out/. Returns null if it doesn't resolve. */
function resolveToFile(pathname: string): string | null {
  if (!pathname.startsWith(`${basePath}/`) && pathname !== basePath) return null;
  const rel = decodeURIComponent(pathname.slice(basePath.length)) || "/";
  const candidates = rel.endsWith("/")
    ? [join(OUT, rel, "index.html")]
    : [join(OUT, rel), join(OUT, `${rel}.html`), join(OUT, rel, "index.html")];
  return candidates.find((c) => existsSync(c) && statSync(c).isFile()) ?? null;
}

// --- 1. required files and sitemap pages ----------------------------------------------
for (const required of ["index.html", "404.html", ".nojekyll", "sitemap.xml", "icon.svg"]) {
  if (!existsSync(join(OUT, required))) fail(`missing out/${required}`);
}
const sitemapXml = existsSync(join(OUT, "sitemap.xml")) ? readFileSync(join(OUT, "sitemap.xml"), "utf8") : "";
const locs = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (locs.length === 0) fail("sitemap.xml lists no pages");
for (const loc of locs) {
  const url = new URL(loc);
  if (url.origin !== siteOrigin) fail(`sitemap entry on wrong host: ${loc}`);
  if (!resolveToFile(url.pathname)) fail(`sitemap page missing from export: ${loc}`);
}

// --- 2. internal links and anchors ----------------------------------------------------
const htmlFiles = walk(OUT).filter((f) => f.endsWith(".html"));
const idCache = new Map<string, Set<string>>();
function idsIn(file: string): Set<string> {
  let ids = idCache.get(file);
  if (!ids) {
    ids = new Set([...readFileSync(file, "utf8").matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
    idCache.set(file, ids);
  }
  return ids;
}

let linksChecked = 0;
for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  const pageRel = relative(OUT, file);
  // The page's own URL path, for resolving relative links.
  const pagePath = `${basePath}/${pageRel.replace(/index\.html$/, "").replace(/\.html$/, "")}`;

  for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const raw = m[1].replace(/&amp;/g, "&");
    if (/^(mailto:|tel:|data:|javascript:)/i.test(raw)) continue;
    const url = new URL(raw, `${siteOrigin}${pagePath}`);
    if (url.origin !== siteOrigin) continue;
    linksChecked++;

    if (raw.startsWith("/") && basePath && !raw.startsWith(`${basePath}/`)) {
      fail(`${pageRel}: link without base path: ${raw}`);
      continue;
    }
    const target = resolveToFile(url.pathname);
    if (!target) {
      fail(`${pageRel}: broken internal link: ${raw}`);
      continue;
    }
    if (url.hash && target.endsWith(".html")) {
      const id = decodeURIComponent(url.hash.slice(1));
      if (!idsIn(target).has(id)) fail(`${pageRel}: anchor #${id} not found on ${relative(OUT, target)}`);
    }
  }

  // --- 5. no third-party scripts/styles, no stray emails --------------------------------
  // Parsed with a real HTML parser; regexes over HTML miss variants like <SCRIPT> or </script >.
  const page = new JSDOM(html).window.document;
  for (const el of page.querySelectorAll("script[src]")) {
    const src = el.getAttribute("src") ?? "";
    if (new URL(src, `${siteOrigin}/`).origin !== siteOrigin) fail(`${pageRel}: third-party script ${src}`);
  }
  for (const el of page.querySelectorAll("link[href]")) {
    const href = el.getAttribute("href") ?? "";
    const rel = (el.getAttribute("rel") ?? "").toLowerCase();
    if (/stylesheet|preconnect|dns-prefetch|preload|modulepreload|prefetch/.test(rel) && new URL(href, `${siteOrigin}/`).origin !== siteOrigin) {
      fail(`${pageRel}: third-party resource ${href}`);
    }
  }
  for (const el of page.querySelectorAll("script")) el.remove();
  const visible = page.documentElement.outerHTML;
  for (const e of visible.matchAll(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g)) {
    if (e[0].toLowerCase() !== CONTACT_EMAIL) fail(`${pageRel}: unexpected email address in output: ${e[0]}`);
  }
}

// --- 3. legal pages are marked as drafts ----------------------------------------------
for (const page of LEGAL_PAGES) {
  const file = join(OUT, page, "index.html");
  if (!existsSync(file)) {
    fail(`legal page missing: /${page}/`);
    continue;
  }
  const text = readFileSync(file, "utf8");
  const mainStart = text.indexOf('id="main"');
  const draftAt = text.indexOf(DRAFT_LINE, mainStart);
  const h1At = text.indexOf("<h1", mainStart);
  if (draftAt === -1) fail(`/${page}/ is missing the draft line`);
  else if (h1At !== -1 && draftAt > h1At + 2000) fail(`/${page}/ draft line is not at the top`);
}

// --- 4. pricing is visibly a placeholder ----------------------------------------------
const pricingFile = join(OUT, "pricing", "index.html");
if (existsSync(pricingFile)) {
  if (!/launch pricing to be confirmed/i.test(readFileSync(pricingFile, "utf8"))) {
    fail("/pricing/ is missing the 'launch pricing to be confirmed' note");
  }
} else fail("pricing page missing");

// --- 6. security: CSP on every page, no inline handlers/styles, headers file, security.txt ----
// Uses a real HTML parser (jsdom) and its own hashing, independent of the regex in scripts/postbuild.ts,
// so a bug or a missed <script> variant there is caught here.
// Inline scripts must be one of the exact, data-only forms Next.js emits. Anything else means
// something in the build injected code, and the page must not ship (its hash would be allow-listed).
const NEXT_FLIGHT_PUSH = /^self\.__next_f\.push\(\[\d+,"(?:[^"\\]|\\.)*"\]\)$/;
const NEXT_FLIGHT_INIT = "(self.__next_f=self.__next_f||[]).push([0])";
const TURBOPACK_PUSH = /^\(globalThis\["TURBOPACK"\] \|\| \(globalThis\["TURBOPACK"\] = \[\]\)\)\.push\((\{[\s\S]*\})\);?\s*$/;
function isKnownNextInlineScript(code: string): boolean {
  if (code === NEXT_FLIGHT_INIT || NEXT_FLIGHT_PUSH.test(code)) return true;
  const turbopack = code.match(TURBOPACK_PUSH);
  if (!turbopack) return false;
  try {
    JSON.parse(turbopack[1]); // a plain data object, no code
    return true;
  } catch {
    return false;
  }
}
for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  const pageRel = relative(OUT, file);
  const meta = html.match(/<meta http-equiv="Content-Security-Policy" content="([^"]+)"\/>/);
  if (!meta) {
    fail(`${pageRel}: no Content-Security-Policy meta tag`);
    continue;
  }
  const policy = meta[1];
  if (/unsafe-|\*|\bdata:|\bblob:/i.test(policy)) fail(`${pageRel}: CSP contains 'unsafe-*', a wildcard, data: or blob:`);
  for (const needed of ["default-src 'self'", "object-src 'none'", "base-uri 'self'", "script-src-attr 'none'"]) {
    if (!policy.includes(needed)) fail(`${pageRel}: CSP is missing "${needed}"`);
  }
  if (!FORM_ACTION.test(policy)) fail(`${pageRel}: CSP form-action is not 'none' or one exact formspree.io form`);
  const dom = new JSDOM(html);
  const scripts = [...dom.window.document.querySelectorAll("script")];
  for (const script of scripts.filter((s) => !s.hasAttribute("src"))) {
    const code = script.textContent ?? "";
    const hash = `'sha256-${createHash("sha256").update(code, "utf8").digest("base64")}'`;
    if (!policy.includes(hash)) fail(`${pageRel}: an inline script is not covered by the CSP`);
    if (!isKnownNextInlineScript(code)) fail(`${pageRel}: unexpected inline script (not a form Next.js emits): ${code.slice(0, 60)}`);
  }
  if (html.includes("\r")) fail(`${pageRel}: contains carriage returns (browsers would hash inline scripts differently)`);
  const metaEl = dom.window.document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  if (metaEl?.parentElement?.tagName !== "HEAD" || dom.window.document.head.children[1] !== metaEl) {
    fail(`${pageRel}: CSP meta tag is not the second element in <head> (right after the charset)`);
  }
  const doc = dom.window.document;
  for (const el of doc.querySelectorAll("*")) {
    for (const attr of el.getAttributeNames()) {
      if (/^on/i.test(attr)) fail(`${pageRel}: inline event handler attribute ${attr} on <${el.tagName.toLowerCase()}>`);
    }
  }
  if (doc.querySelector("[style]")) fail(`${pageRel}: inline style attribute (blocked by style-src 'self')`);
  if (doc.querySelector("style")) fail(`${pageRel}: inline <style> element (blocked by style-src 'self')`);
  if (doc.querySelector("iframe, object, embed, base")) fail(`${pageRel}: <iframe>, <object>, <embed> or <base> element`);
  for (const a of doc.querySelectorAll("a[href], area[href]")) {
    const href = (a.getAttribute("href") ?? "").trim();
    if (/^(javascript|data|vbscript):/i.test(href)) fail(`${pageRel}: ${href.slice(0, 20)} link`);
    if (/^https?:/i.test(href) && new URL(href).origin !== siteOrigin) {
      const rel = (a.getAttribute("rel") ?? "").toLowerCase().split(/\s+/);
      if (!rel.includes("noopener") || !rel.includes("noreferrer")) fail(`${pageRel}: external link without rel="noopener noreferrer": ${href}`);
    }
  }
}

const allFiles = walk(OUT);
for (const f of allFiles.filter((f) => f.endsWith(".map"))) fail(`source map shipped: ${relative(OUT, f)}`);
for (const f of allFiles.filter((f) => f.endsWith(".js"))) {
  if (/\beval\(|new Function\(/.test(readFileSync(f, "utf8"))) fail(`eval or new Function in ${relative(OUT, f)}`);
}

const headersPath = join(OUT, "_headers");
if (!existsSync(headersPath)) fail("_headers file missing");
else {
  const headers = readFileSync(headersPath, "utf8");
  for (const name of [
    "Content-Security-Policy",
    "Strict-Transport-Security",
    "X-Content-Type-Options",
    "X-Frame-Options",
    "Referrer-Policy",
    "Permissions-Policy",
    "Cross-Origin-Opener-Policy",
    "Cross-Origin-Embedder-Policy",
    "Cross-Origin-Resource-Policy",
  ]) {
    if (!headers.includes(`  ${name}: `)) fail(`_headers is missing ${name}`);
  }
  if (!headers.includes("frame-ancestors 'none'")) fail("_headers CSP is missing frame-ancestors 'none'");
  if (/unsafe-/i.test(headers)) fail("_headers contains an 'unsafe-*' keyword");
  if (!FORM_ACTION.test(headers.match(/Content-Security-Policy: .*/)?.[0] ?? "")) fail("_headers CSP form-action is not 'none' or one exact formspree.io form");
  if (/preload/i.test(headers.match(/Strict-Transport-Security: .*/)?.[0] ?? "")) fail("HSTS has `preload` (needs the owner's decision first)");
  if (headers.split("\n").some((l) => l.length > 2000)) fail("_headers has a line over 2,000 characters");
}

const securityTxtPath = join(OUT, ".well-known", "security.txt");
if (!existsSync(securityTxtPath)) fail(".well-known/security.txt missing");
else {
  const txt = readFileSync(securityTxtPath, "utf8");
  if (!txt.includes(`Contact: mailto:${CONTACT_EMAIL}`)) fail("security.txt Contact doesn't match the site's contact email");
  if (!txt.includes(`Policy: ${siteOrigin}${basePath}/security/`)) fail("security.txt Policy doesn't point at the Security page");
  const expires = Date.parse(txt.match(/Expires: (\S+)/)?.[1] ?? "");
  if (!(expires > Date.now())) fail("security.txt has expired or has no Expires line");
  else if (expires - Date.now() > 366 * 86_400_000) fail("security.txt Expires is more than a year away");
  const securityPage = join(OUT, "security", "index.html");
  if (existsSync(securityPage) && !readFileSync(securityPage, "utf8").includes(CONTACT_EMAIL)) {
    fail("Security page doesn't show the same contact as security.txt");
  }
}

// --- report -----------------------------------------------------------------------------
if (failures.length) {
  process.stderr.write(`check:export FAILED (${failures.length})\n${failures.map((f) => `  ✗ ${f}`).join("\n")}\n`);
  process.exit(1);
}
process.stdout.write(
  `check:export OK: ${htmlFiles.length} HTML files, ${locs.length} sitemap pages, ${linksChecked} internal links, base path "${basePath}"\n`,
);
