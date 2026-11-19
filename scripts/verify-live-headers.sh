#!/usr/bin/env bash
# scripts/verify-live-headers.sh: checks a LIVE site's security headers with curl only.
# No third-party services. Exits non-zero if anything is missing.
#
# Usage:  scripts/verify-live-headers.sh https://your-domain.example
#         (a base path is fine too: https://hap008.github.io/atlas-site)
#
# Checks the home page, a legal page, a missing page (404) and a static asset for every
# header scripts/postbuild.ts writes into _headers, the CSP <meta> tag in the HTML,
# the http → https redirect, that no cookie is set, and security.txt.

set -u

BASE="${1:-}"
if [ -z "$BASE" ]; then
  echo "Usage: $0 https://your-domain.example" >&2
  exit 2
fi
BASE="${BASE%/}"

fails=0
pass() { printf '  \342\234\223 %s\n' "$1"; }
fail() { printf '  \342\234\227 %s\n' "$1"; fails=$((fails + 1)); }

# header_value <headers> <name> : prints the (last) value of a header, case-insensitive
header_value() {
  printf '%s\n' "$1" | tr -d '\r' | awk -v n="$(printf '%s' "$2" | tr 'A-Z' 'a-z'):" \
    'BEGIN{IGNORECASE=1} { k=tolower($1); if (k==n) { $1=""; sub(/^ /,""); v=$0 } } END{ print v }'
}

# expect <headers> <name> <extended-regex> <label>
expect() {
  local value
  value="$(header_value "$1" "$2")"
  if [ -z "$value" ]; then fail "$4: $2 is missing"
  elif printf '%s' "$value" | grep -Eqi -- "$3"; then pass "$4: $2"
  else fail "$4: $2 has an unexpected value: $value"
  fi
}

check_page() {
  local url="$1" label="$2" expect_status="$3" headers status
  headers="$(curl -sS -D - -o /dev/null --max-time 20 "$url")" || { fail "$label: could not fetch $url"; return; }
  status="$(printf '%s\n' "$headers" | head -1 | awk '{print $2}')"
  echo
  echo "== $label  ($url)  HTTP $status"
  printf '%s\n' "$headers" | tr -d '\r' | grep -Ei '^(content-security-policy|strict-transport-security|x-content-type-options|x-frame-options|referrer-policy|permissions-policy|cross-origin-[a-z-]+|set-cookie):' | sed 's/^/    /'
  [ "$status" = "$expect_status" ] && pass "$label: status $status" || fail "$label: expected HTTP $expect_status, got $status"

  expect "$headers" "Content-Security-Policy" "frame-ancestors 'none'" "$label"
  expect "$headers" "Content-Security-Policy" "object-src 'none'" "$label"
  expect "$headers" "Content-Security-Policy" "base-uri 'self'" "$label"
  expect "$headers" "Content-Security-Policy" "form-action https://formspree\.io" "$label"
  expect "$headers" "Strict-Transport-Security" "max-age=[0-9]{8,}; *includeSubDomains" "$label"
  expect "$headers" "X-Content-Type-Options" "^nosniff$" "$label"
  expect "$headers" "X-Frame-Options" "^DENY$" "$label"
  expect "$headers" "Referrer-Policy" "strict-origin-when-cross-origin|no-referrer" "$label"
  expect "$headers" "Permissions-Policy" "camera=\(\).*geolocation=\(\).*microphone=\(\)" "$label"
  expect "$headers" "Cross-Origin-Opener-Policy" "^same-origin$" "$label"
  expect "$headers" "Cross-Origin-Resource-Policy" "^same-origin$" "$label"

  local csp
  csp="$(header_value "$headers" "Content-Security-Policy")"
  if printf '%s' "$csp" | grep -Eq "unsafe-inline|unsafe-eval"; then fail "$label: CSP header contains 'unsafe-*'"; else pass "$label: no 'unsafe-*' in CSP header"; fi
  if printf '%s\n' "$headers" | grep -qi '^set-cookie:'; then fail "$label: a cookie was set"; else pass "$label: no cookie set"; fi
}

check_meta_csp() {
  local url="$1" label="$2" body
  body="$(curl -sS --max-time 20 "$url")" || { fail "$label: could not fetch body"; return; }
  if printf '%s' "$body" | grep -q "http-equiv=\"Content-Security-Policy\" content=\"default-src 'self'; script-src 'self' 'sha256-"; then
    pass "$label: hash-based CSP <meta> tag present"
  else
    fail "$label: hash-based CSP <meta> tag missing from the HTML"
  fi
  if printf '%s' "$body" | grep -o 'http-equiv="Content-Security-Policy" content="[^"]*"' | grep -Eq "unsafe-inline|unsafe-eval"; then
    fail "$label: CSP <meta> tag contains 'unsafe-*'"
  else
    pass "$label: no 'unsafe-*' in CSP <meta> tag"
  fi
}

echo "Checking $BASE"

check_page "$BASE/" "home" 200
check_meta_csp "$BASE/" "home"
check_page "$BASE/privacy/" "privacy" 200
check_meta_csp "$BASE/privacy/" "privacy"
check_page "$BASE/this-page-does-not-exist-$$/" "404 page" 404
check_meta_csp "$BASE/this-page-does-not-exist-$$/" "404 page"

# A static asset: the first stylesheet the home page links to.
asset="$(curl -sS --max-time 20 "$BASE/" | grep -o 'href="[^"]*/_next/static/[^"]*\.css"' | head -1 | sed 's/^href="//; s/"$//')"
echo
if [ -n "$asset" ]; then
  origin="$(printf '%s' "$BASE" | sed -E 's#^(https?://[^/]+).*#\1#')"
  aheaders="$(curl -sS -D - -o /dev/null --max-time 20 "$origin$asset")"
  echo "== static asset  ($origin$asset)"
  expect "$aheaders" "X-Content-Type-Options" "^nosniff$" "asset"
  expect "$aheaders" "Content-Security-Policy" "default-src 'none'" "asset"
else
  fail "asset: could not find a stylesheet link on the home page"
fi

# http → https
echo
echo "== http redirect"
case "$BASE" in
  https://*)
    http_url="http://${BASE#https://}/"
    redirect="$(curl -sS -o /dev/null --max-time 20 -w '%{http_code} %{redirect_url}' "$http_url" 2>/dev/null || true)"
    case "$redirect" in
      30[1278]\ https://*) pass "http redirects to https ($redirect)" ;;
      *) fail "http does not redirect to https (got: $redirect)" ;;
    esac ;;
  *) fail "base URL is not https" ;;
esac

# security.txt
echo
echo "== security.txt"
sectxt="$(curl -sS --max-time 20 -w '\n%{http_code}' "$BASE/.well-known/security.txt")"
code="$(printf '%s' "$sectxt" | tail -1)"
if [ "$code" = "200" ]; then
  printf '%s\n' "$sectxt" | sed '$d' | sed 's/^/    /'
  printf '%s' "$sectxt" | grep -q '^Contact: mailto:' && pass "security.txt has Contact" || fail "security.txt has no Contact"
  printf '%s' "$sectxt" | grep -q '^Expires: ' && pass "security.txt has Expires" || fail "security.txt has no Expires"
  printf '%s' "$sectxt" | grep -q '^Policy: https://' && pass "security.txt has Policy" || fail "security.txt has no Policy"
else
  fail "security.txt returned HTTP $code"
fi

echo
if [ "$fails" -gt 0 ]; then
  echo "FAILED: $fails check(s) did not pass."
  exit 1
fi
echo "OK: every header check passed."
