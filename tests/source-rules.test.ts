/**
 * Source rules from CLAUDE.md §5 and §7, enforced in code rather than by memory:
 * - no console.* in site code (the waitlist form handles email addresses)
 * - no `any` without an explaining comment on the same or previous line
 * - no .js source files
 * - no third-party <script> tags or analytics
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = join(__dirname, "..");
const SOURCE_DIRS = ["app", "components", "lib", "content"];

function walk(dir: string): string[] {
  let out: string[] = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out = out.concat(walk(full));
    else out.push(full);
  }
  return out;
}

const files = SOURCE_DIRS.flatMap((d) => {
  try {
    return walk(join(ROOT, d));
  } catch {
    return [];
  }
});
const codeFiles = files.filter((f) => /\.(ts|tsx|mdx)$/.test(f));

describe("source rules", () => {
  it("has source files to check", () => {
    expect(codeFiles.length).toBeGreaterThan(0);
  });

  it("never calls console.* in site code", () => {
    const offenders = codeFiles.filter((f) => /\bconsole\.\w+\s*\(/.test(readFileSync(f, "utf8")));
    expect(offenders.map((f) => relative(ROOT, f))).toEqual([]);
  });

  it("never uses `any` without a comment explaining why", () => {
    const offenders: string[] = [];
    for (const f of codeFiles.filter((x) => /\.(ts|tsx)$/.test(x))) {
      const lines = readFileSync(f, "utf8").split("\n");
      lines.forEach((line, i) => {
        if (/(:\s*any\b|\bas\s+any\b|<any>)/.test(line)) {
          const explained = /\/\/|\/\*/.test(line) || /\/\/|\/\*/.test(lines[i - 1] ?? "");
          if (!explained) offenders.push(`${relative(ROOT, f)}:${i + 1}`);
        }
      });
    }
    expect(offenders).toEqual([]);
  });

  it("has no .js source files", () => {
    const js = files.filter((f) => /\.(js|jsx)$/.test(f));
    expect(js.map((f) => relative(ROOT, f))).toEqual([]);
  });

  it("loads no third-party scripts or analytics", () => {
    const patterns = [
      /<script[^>]+src=["']https?:\/\//i,
      /googletagmanager|google-analytics|gtag\(|plausible|posthog|segment\.com|hotjar|clarity\.ms|@vercel\/analytics/i,
      /document\.cookie|localStorage|sessionStorage/,
    ];
    const offenders = codeFiles.filter((f) => {
      const text = readFileSync(f, "utf8");
      return patterns.some((p) => p.test(text));
    });
    expect(offenders.map((f) => relative(ROOT, f))).toEqual([]);
  });
});
