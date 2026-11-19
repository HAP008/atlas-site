#!/usr/bin/env bash
# scripts/verify-live-headers.sh: checks a LIVE site's security headers with curl only.
# No third-party services. Exits non-zero if anything is missing or weaker than expected.
#
# Usage:  scripts/verify-live-headers.sh https://your-domain.example
#
# Checks the home page, a legal page, a missing page (404), a stylesheet, the icon and the
# social image for the headers scripts/postbuild.ts writes into _headers; the CSP <meta> tag;
# the http → https redirect; that no cookie is set; and security.txt.
#
# What it does NOT check: that the hashes in the CSP <meta> tag match the scripts on the page
# (a host feature that rewrites HTML, such as Cloudflare's Rocket Loader or email obfuscation,
# would break that). `npm run check:export` proves it for the build; a browser with the
# console open proves it for the live site. Keep HTML-rewriting features off at the host.
#
# It passes only at the final settings (HSTS of a year or more with includeSubDomains),
# so it fails during the HSTS ramp-up and on GitHub Pages, which can't send these headers.

set -u

BASE="${1:-}"
if [ -z "$BASE" ]; then
  echo "Usage: $0 https://your-domain.example" >&2
  exit 2
fi
BASE="${BASE%/}"
ORIGIN="$(printf '%s' "$BASE" | sed -E 's#^(https?://[^/]+).*#\1#')"

fails=0
pass() { printf '  \342\234\223 %s\n' "$1"; }
fail() { printf '  \342\234\227 %s\n' "$1"; fails=$((fails + 1)); }

# header_values <headers> <name> : every value of that header, one per line (case-insensitive name)
header_values() {
  printf '%s\n' "$1" | tr -d '\r' | awk -v n="$(printf '%s' "$2" | tr 'A-Z' 'a-z'):" \
    '{ k=tolower($1); if (k==n) { $1=""; sub(/^ /,""); print } }'
}

# expect_one <headers> <name> <extended-regex> <label> : exactly one such header, and it must match
expect_one() {
  local values count
  values="$(header_values "$1" "$2")"
  count="$(printf '%s' "$values" | grep -c . || true)"
  if [ "$count" -eq 0 ]; then fail "$4: $2 is missing"
  elif [ "$count" -gt 1 ]; then fail "$4: $2 is sent $count times"
  elif printf '%s' "$values" | grep -Eq -- "$3"; then pass "$4: $2"
  else fail "$4: $2 has an unexpected value: $values"
  fi
}

# csp_has <csp> <extended-regex> <label> <what>
csp_has() {
  if printf '%s' "$1" | grep -Eq -- "$2"; then pass "$3: CSP $4"; else fail "$3: CSP is missing or has a weaker $4"; fi
}

FORM_ACTION="(^|; )form-action ('none'|https://formspree\.io/f/[A-Za-z0-9]+)(;|$)"

check_page() {
  local url="$1" label="$2" expect_status="$3" headers status csp
  headers="$(curl -sS -D - -o /dev/null --max-time 20 "$url")" || { fail "$label: could not fetch $url"; return; }
  status="$(printf '%s\n' "$headers" | head -1 | awk '{print $2}')"
  echo
  echo "== $label  ($url)  HTTP $status"
  printf '%s\n' "$headers" | tr -d '\r' | grep -Ei '^(content-security-policy|strict-transport-security|x-content-type-options|x-frame-options|referrer-policy|permissions-policy|cross-origin-[a-z-]+|set-cookie):' | sed 's/^/    /'
  [ "$status" = "$expect_status" ] && pass "$label: status $status" || fail "$label: expected HTTP $expect_status, got $status"

  csp="$(header_values "$headers" "Content-Security-Policy")"
  if [ -z "$csp" ]; then
    fail "$label: Content-Security-Policy header is missing"
  elif [ "$(printf '%s' "$csp" | grep -c .)" -gt 1 ]; then
    fail "$label: more than one Content-Security-Policy header on a page"
  else
    csp_has "$csp" "(^|; )frame-ancestors 'none'(;|$)" "$label" "frame-ancestors 'none'"
    csp_has "$csp" "(^|; )object-src 'none'(;|$)" "$label" "object-src 'none'"
    csp_has "$csp" "(^|; )base-uri 'self'(;|$)" "$label" "base-uri 'self'"
    csp_has "$csp" "(^|; )script-src-attr 'none'(;|$)" "$label" "script-src-attr 'none'"
    csp_has "$csp" "$FORM_ACTION" "$label" "form-action (none, or one exact Formspree form)"
    if printf '%s' "$csp" | grep -Eqi "unsafe-|\*"; then fail "$label: CSP header contains 'unsafe-*' or a wildcard"; else pass "$label: no 'unsafe-*' or wildcard in CSP header"; fi
  fi

  expect_one "$headers" "Strict-Transport-Security" "^max-age=[1-9][0-9]{7,}; *includeSubDomains$" "$label"
  expect_one "$headers" "X-Content-Type-Options" "^nosniff$" "$label"
  expect_one "$headers" "X-Frame-Options" "^DENY$" "$label"
  expect_one "$headers" "Referrer-Policy" "^(strict-origin-when-cross-origin|no-referrer)$" "$label"
  expect_one "$headers" "Permissions-Policy" "camera=\(\).*geolocation=\(\).*microphone=\(\).*payment=\(\)" "$label"
  expect_one "$headers" "Cross-Origin-Opener-Policy" "^same-origin$" "$label"
  expect_one "$headers" "Cross-Origin-Embedder-Policy" "^require-corp$" "$label"
  expect_one "$headers" "Cross-Origin-Resource-Policy" "^same-origin$" "$label"

  if printf '%s\n' "$headers" | grep -qi '^set-cookie:'; then fail "$label: a cookie was set"; else pass "$label: no cookie set"; fi
}

check_meta_csp() {
  local url="$1" label="$2" body meta
  body="$(curl -sS --max-time 20 "$url")" || { fail "$label: could not fetch body"; return; }
  meta="$(printf '%s' "$body" | grep -o 'http-equiv="Content-Security-Policy" content="[^"]*"' | head -1)"
  if [ -z "$meta" ]; then fail "$label: CSP <meta> tag missing from the HTML"; return; fi
  if printf '%s' "$meta" | grep -q "content=\"default-src 'self'; script-src 'self' 'sha256-"; then
    pass "$label: hash-based CSP <meta> tag present"
  else
    fail "$label: CSP <meta> tag is not the expected hash-based policy"
  fi
  if printf '%s' "$meta" | grep -Eqi "unsafe-|\*"; then
    fail "$label: CSP <meta> tag contains 'unsafe-*' or a wildcard"
  else
    pass "$label: no 'unsafe-*' or wildcard in CSP <meta> tag"
  fi
}

# check_asset <url> <label> <header> <regex>
check_asset() {
  local headers
  headers="$(curl -sS -D - -o /dev/null --max-time 20 "$1")" || { fail "$2: could not fetch $1"; return; }
  echo "== $2  ($1)"
  expect_one "$headers" "X-Content-Type-Options" "^nosniff$" "$2"
  local values
  values="$(header_values "$headers" "$3")"
  if [ -z "$values" ]; then fail "$2: $3 is missing"
  elif printf '%s' "$values" | grep -Eq -- "$4"; then pass "$2: $3"
  else fail "$2: $3 has an unexpected value: $values"
  fi
}

echo "Checking $BASE"

check_page "$BASE/" "home" 200
check_meta_csp "$BASE/" "home"
check_page "$BASE/privacy/" "privacy" 200
check_meta_csp "$BASE/privacy/" "privacy"
check_page "$BASE/this-page-does-not-exist-$$/" "404 page" 404
check_meta_csp "$BASE/this-page-does-not-exist-$$/" "404 page"

echo
asset="$(curl -sS --max-time 20 "$BASE/" | grep -o 'href="[^"]*/_next/static/[^"]*\.css"' | head -1 | sed 's/^href="//; s/"$//')"
if [ -n "$asset" ]; then
  check_asset "$ORIGIN$asset" "stylesheet" "Content-Security-Policy" "default-src 'none'"
else
  fail "stylesheet: could not find a stylesheet link on the home page"
fi
check_asset "$BASE/icon.svg" "icon.svg" "Content-Security-Policy" "default-src 'none'"
check_asset "$BASE/sitemap.xml" "sitemap.xml" "Content-Security-Policy" "default-src 'none'"
check_asset "$BASE/opengraph-image.png" "social image" "Cross-Origin-Resource-Policy" "^cross-origin$"

echo
echo "== http redirect"
case "$BASE" in
  https://*)
    http_url="http://${BASE#https://}/"
    redirect="$(curl -sS -o /dev/null --max-time 20 -w '%{http_code} %{redirect_url}' "$http_url" 2>/dev/null || true)"
    code="${redirect%% *}"; target="${redirect#* }"
    case "$code" in
      301|308)
        case "$target" in
          "$BASE"|"$BASE"/*) pass "http redirects permanently to the same https address ($redirect)" ;;
          *) fail "http redirects somewhere unexpected: $target" ;;
        esac ;;
      *) fail "http does not permanently redirect to https (got: $redirect)" ;;
    esac ;;
  *) fail "base URL is not https" ;;
esac

echo
echo "== security.txt"
sectxt="$(curl -sS --max-time 20 -w '\n%{http_code}' "$BASE/.well-known/security.txt")"
code="$(printf '%s' "$sectxt" | tail -1)"
if [ "$code" = "200" ]; then
  printf '%s\n' "$sectxt" | sed '$d' | sed 's/^/    /'
  printf '%s' "$sectxt" | grep -q '^Contact: mailto:' && pass "security.txt has Contact" || fail "security.txt has no Contact"
  printf '%s' "$sectxt" | grep -q '^Expires: ' && pass "security.txt has Expires" || fail "security.txt has no Expires"
  printf '%s' "$sectxt" | grep -q "^Policy: $BASE/security/" && pass "security.txt Policy points at this site" || fail "security.txt Policy doesn't point at $BASE/security/"
else
  fail "security.txt returned HTTP $code"
fi

echo
if [ "$fails" -gt 0 ]; then
  echo "FAILED: $fails check(s) did not pass."
  exit 1
fi
echo "OK: every header check passed."
