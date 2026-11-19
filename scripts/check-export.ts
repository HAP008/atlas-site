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
 *
 * Reads the base path from out/robots.txt (written from site.config.ts), so it
 * never drifts from the real config.
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const OUT = join(import.meta.dirname, "..", "out");
const CONTACT_EMAIL = "huzaifapardiwala@gmail.com";
const DRAFT_LINE = "Draft: not yet reviewed by a lawyer or accountant";
const LEGAL_PAGES = ["privacy", "terms", "refunds", "cookies", "acceptable-use", "security"];

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
  for (const s of html.matchAll(/<script[^>]*\ssrc="([^"]+)"/g)) {
    if (new URL(s[1], `${siteOrigin}/`).origin !== siteOrigin) fail(`${pageRel}: third-party script ${s[1]}`);
  }
  for (const l of html.matchAll(/<link[^>]*\shref="(https?:\/\/[^"]+)"[^>]*>/g)) {
    if (/rel="(stylesheet|preconnect|dns-prefetch|preload)"/.test(l[0]) && new URL(l[1]).origin !== siteOrigin) {
      fail(`${pageRel}: third-party resource ${l[1]}`);
    }
  }
  const visible = html.replace(/<script[\s\S]*?<\/script>/g, "");
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

// --- report -----------------------------------------------------------------------------
if (failures.length) {
  process.stderr.write(`check:export FAILED (${failures.length})\n${failures.map((f) => `  ✗ ${f}`).join("\n")}\n`);
  process.exit(1);
}
process.stdout.write(
  `check:export OK: ${htmlFiles.length} HTML files, ${locs.length} sitemap pages, ${linksChecked} internal links, base path "${basePath}"\n`,
);
