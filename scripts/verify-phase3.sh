#!/usr/bin/env bash
# Verifies Phase 3 on a deployed site, the way a crawler would see it.
#
#   scripts/verify-phase3.sh https://olas-website-git-feature-structured-data.vercel.app / /faq /data
#
# For each path it reports the canonical, how many JSON-LD blocks are served and their
# types, and whether the Organization block is there. Then it fetches robots.txt and the
# sitemap and prints the host every URL in them uses — the point of the apex/www fix is
# that all three agree. Nothing here needs a browser; it reads the served HTML only.

set -u
base="${1:?usage: verify-phase3.sh <base-url> [paths...]}"
base="${base%/}"
shift
paths=("$@")
[ ${#paths[@]} -eq 0 ] && paths=("/")

# Vercel previews sit behind deployment protection: an anonymous fetch lands on the
# vercel.com login page, which is HTML and would otherwise be reported as "no canonical".
# Pass a protection-bypass token as VERCEL_BYPASS (Vercel → project → Deployment Protection).
fetch() {
  curl -sL --max-time 30 -A "Mozilla/5.0 (compatible; phase3-check)"     ${VERCEL_BYPASS:+-H "x-vercel-protection-bypass: $VERCEL_BYPASS"} "$1"
}

probe=$(fetch "$base/")
if printf '%s' "$probe" | grep -q 'vercel.com/login'; then
  echo "This deployment is behind Vercel's login. Either set VERCEL_BYPASS to the project's"
  echo "protection-bypass token, or run this against production once merged."
  exit 2
fi

printf "%-36s %-44s %s\n" "path" "canonical" "json-ld"
for p in "${paths[@]}"; do
  html=$(fetch "$base$p")
  canonical=$(printf '%s' "$html" | grep -o '<link rel="canonical" href="[^"]*"' | head -1 | sed 's/.*href="//; s/"$//')
  types=$(printf '%s' "$html" | grep -o '<script type="application/ld+json"[^>]*>[^<]*' | grep -o '"@type":"[A-Za-z]*"' | sed 's/"@type"://; s/"//g' | sort | uniq -c | awk '{printf "%s×%s ", $2, $1}')
  printf "%-36s %-44s %s\n" "$p" "${canonical:-MISSING}" "${types:-NONE}"
done

echo
echo "robots.txt:"; fetch "$base/robots.txt" | sed 's/^/  /'
echo
sm=$(fetch "$base/sitemap.xml")
# next-sitemap emits an index that points at sitemap-0.xml
if printf '%s' "$sm" | grep -q "<sitemapindex"; then sm=$(fetch "$base/sitemap-0.xml"); fi
echo "sitemap: $(printf '%s' "$sm" | grep -c '<loc>') URL(s), hosts used:"
printf '%s' "$sm" | grep -o '<loc>[^<]*' | sed 's|<loc>||' | awk -F/ '{print "  " $3}' | sort | uniq -c
