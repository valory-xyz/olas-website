#!/usr/bin/env node
/**
 * License allowlist gate (PARANOID posture). Every PRODUCTION
 * dependency's license must be in the allowlist, resolved by a
 * `licenseOverrides` entry, or exempted (by exact NAME for general
 * packages, by NARROW PREFIX only for publisher-controlled platform-binary
 * families). UNKNOWN / unlisted licenses FAIL — they are resolved, not
 * silenced.
 *
 * Scope = production. devDependencies don't ship and generate considerable
 * transitive-license noise, so they are not scanned. Override via
 * `"scope": "all"` in the config if a future need arises.
 *
 * Necessary because npm has no native enforcement gate for license policy.
 * `license-checker` (the original) reports any package without an SPDX
 * string in its package.json as UNKNOWN. The rseidelsohn fork reads
 * LICENSE files for those, giving a real classification surface.
 *
 * Drop-in: place beside license-check.lib.mjs, add a config at
 * .supply-chain/license-allowlist.json (resolved against process.cwd()),
 * and add `license-checker-rseidelsohn` as a devDependency. For a multi-tree
 * repo, run it once per tree from each tree's working directory (each reads
 * its own .supply-chain/license-allowlist.json). See README.md.
 */

/* eslint-disable no-undef, no-console -- standalone Node CLI: uses Node/JS globals and reports on stdout/stderr (works across legacy + flat eslint configs) */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, relative } from 'node:path';

// Static ESM import: license-checker-rseidelsohn is `type: module`, so a
// `require()` of it throws ERR_REQUIRE_ESM on Node < 22 (Node 22 added
// require(esm)). `import * as` works on every supported Node. `init` is a
// named export.
import * as checker from 'license-checker-rseidelsohn';

import { evalExpr } from './license-check.lib.mjs';

const ROOT = resolve('.');
const ALLOWLIST_PATH = resolve(ROOT, '.supply-chain/license-allowlist.json');

// Bound the checker so a stuck node_modules walk (broken symlink loop,
// filesystem hiccup) can't pin the CI job to the workflow-level timeout.
const CHECKER_TIMEOUT_MS = 5 * 60 * 1000;
const ROOT_PKG = (() => {
  try {
    return JSON.parse(readFileSync(resolve(ROOT, 'package.json'), 'utf8'));
  } catch {
    return {};
  }
})();
const SELF_PKG = ROOT_PKG.name && ROOT_PKG.version ? `${ROOT_PKG.name}@${ROOT_PKG.version}` : null;
// Direct production dependencies — used as a sanity floor: the production scan
// MUST contain most of these. `license-checker`'s read-installed can silently
// return a near-empty tree on some installs (transitive read-installed-packages
// conflicts), which would otherwise make the gate pass vacuously (false green).
const DIRECT_PROD_DEPS = Object.keys(ROOT_PKG.dependencies || {});

function loadAllowlist() {
  if (!existsSync(ALLOWLIST_PATH)) {
    console.error(`::error::missing ${ALLOWLIST_PATH}`);
    process.exit(2);
  }
  let data;
  try {
    data = JSON.parse(readFileSync(ALLOWLIST_PATH, 'utf8'));
  } catch (err) {
    console.error(`::error::failed to parse ${ALLOWLIST_PATH}: ${err.message}`);
    process.exit(2);
  }
  const validateEntry = (entry, kind, keyField) => {
    const errors = [];
    if (typeof entry[keyField] !== 'string' || !entry[keyField].trim()) errors.push(`\`${keyField}\` is required`);
    if (typeof entry.spdx !== 'string' || !entry.spdx.trim()) errors.push('`spdx` is required');
    if (typeof entry.reason !== 'string' || !entry.reason.trim()) errors.push('`reason` is required');
    if (typeof entry.added !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(entry.added)) {
      errors.push('`added` must be YYYY-MM-DD');
    }
    if (typeof entry.review !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(entry.review)) {
      errors.push('`review` must be YYYY-MM-DD');
    }
    if (errors.length) {
      console.error(`::error::malformed ${kind} entry in ${ALLOWLIST_PATH}: ${errors.join('; ')} — ${JSON.stringify(entry)}`);
      process.exit(2);
    }
  };
  for (const entry of data.licenseOverrides || []) validateEntry(entry, 'licenseOverrides', 'package');
  for (const entry of data.exemptions || []) validateEntry(entry, 'exemptions', 'package');
  for (const entry of data.exemptionPrefixes || []) validateEntry(entry, 'exemptionPrefixes', 'prefix');
  return data;
}

const allowlist = loadAllowlist();
const allowedSet = new Set(allowlist.allowedSpdx || []);
const unauthorizedSet = new Set(allowlist.unauthorizedSpdx || []);
const overrideByName = new Map();
for (const e of allowlist.licenseOverrides || []) overrideByName.set(e.package, e);
const exemptByName = new Map();
for (const e of allowlist.exemptions || []) exemptByName.set(e.package, e);
// Most-specific-wins: sort by prefix length desc so a future `@img/sharp-` entry
// resolves before `@img/`. Without this, ordering is implicit and easy to get wrong.
const exemptPrefixes = [...(allowlist.exemptionPrefixes || [])].sort(
  (a, b) => b.prefix.length - a.prefix.length,
);

const scope = allowlist.scope || 'production';
if (scope !== 'production' && scope !== 'all') {
  console.error(`::error::invalid scope "${scope}" in ${ALLOWLIST_PATH} (must be "production" or "all")`);
  process.exit(2);
}

const initOpts = { start: ROOT, excludePrivatePackages: true };
if (scope === 'production') initOpts.production = true;

const timeoutHandle = setTimeout(() => {
  console.error(
    `::error::license-checker did not finish within ${CHECKER_TIMEOUT_MS / 1000}s — aborting.`,
  );
  process.exit(2);
}, CHECKER_TIMEOUT_MS);

checker.init(initOpts, (err, report) => {
  clearTimeout(timeoutHandle);
  if (err) {
    console.error('::error::license-checker failed to scan the dependency tree:', err.message || err);
    process.exit(2);
  }

  // Scan-completeness guard (fail loud, never false-green): if the scan didn't
  // surface the repo's own direct production dependencies, the dependency-tree
  // read is broken — do NOT report a pass.
  const scannedNames = new Set(
    Object.keys(report)
      .filter((k) => k !== SELF_PKG)
      .map((k) => (k.lastIndexOf('@') > 0 ? k.slice(0, k.lastIndexOf('@')) : k)),
  );
  if (DIRECT_PROD_DEPS.length > 0) {
    // Two independent floors, both must hold for the scan to be trusted:
    //   (1) EVERY direct production dependency must appear in the scan. They are
    //       explicitly declared and installed, so a correct production scan
    //       cannot omit one. Even a single miss means the tree read is broken
    //       (the false-green symptom is a near-empty report). A half-floor let
    //       a badly truncated scan through; PARANOID demands all-present.
    //   (2) the total scanned count must be at least the direct-dep count — a
    //       belt-and-braces absolute floor against the degenerate ~1-package read.
    const missing = DIRECT_PROD_DEPS.filter((d) => !scannedNames.has(d));
    if (missing.length > 0 || scannedNames.size < DIRECT_PROD_DEPS.length) {
      const present = DIRECT_PROD_DEPS.length - missing.length;
      console.error(
        `::error::license-check: scan looks incomplete — only ${present}/${DIRECT_PROD_DEPS.length} ` +
          `direct production dependencies were found in a scan of ${scannedNames.size} package(s). ` +
          (missing.length ? `Missing: ${missing.join(', ')}. ` : '') +
          `The dependency tree could not be read reliably (often a transitive ` +
          `read-installed-packages conflict). Refusing to report a pass. ` +
          `Try a clean reinstall (rm -rf node_modules && yarn install).`,
      );
      process.exit(2);
    }
  }

  const violations = [];
  const overridden = [];
  const exempted = [];
  const prefixHits = new Map();

  const today = new Date().toISOString().slice(0, 10);
  const expired = [];
  const matchedNames = new Set();
  const matchedPrefixes = new Set();

  for (const [pkgVersion, info] of Object.entries(report)) {
    if (SELF_PKG && pkgVersion === SELF_PKG) continue;
    const lastAt = pkgVersion.lastIndexOf('@');
    const name = lastAt > 0 ? pkgVersion.slice(0, lastAt) : pkgVersion;

    // Exact-name exemption short-circuits everything: license is irrelevant.
    const ex = exemptByName.get(name);
    if (ex) {
      matchedNames.add(name);
      exempted.push({ name, pkgVersion, declared: info.licenses, entry: ex });
      if (ex.review && ex.review < today) expired.push({ kind: 'exemption', name, entry: ex });
      continue;
    }

    // License override: replace declared with resolved SPDX, then evaluate.
    // Used for UNKNOWNs whose LICENSE file is permissive (e.g. map-stream).
    // Distinct from exemption — these are CORRECTIONS, not policy exceptions.
    const ov = overrideByName.get(name);
    const effective = ov ? ov.spdx : info.licenses;
    if (ov) {
      matchedNames.add(name);
      overridden.push({ name, pkgVersion, declared: info.licenses, entry: ov });
      if (ov.review && ov.review < today) expired.push({ kind: 'override', name, entry: ov });
    }

    const cls = evalExpr(effective, allowedSet, unauthorizedSet);
    if (cls === 'allowed') continue;

    // Last resort: narrow prefix exemption (publisher-controlled scope,
    // uniform license stance — e.g. @img/sharp-libvips-* platform binaries).
    // NEVER use for general namespaces like @types/ where each sub-package
    // is independently licensed.
    const prefixEntry = exemptPrefixes.find((p) => name.startsWith(p.prefix));
    if (prefixEntry) {
      matchedPrefixes.add(prefixEntry.prefix);
      const list = prefixHits.get(prefixEntry.prefix) || [];
      list.push({ pkgVersion, declared: info.licenses });
      prefixHits.set(prefixEntry.prefix, list);
      if (prefixEntry.review && prefixEntry.review < today) {
        expired.push({ kind: 'exemptionPrefix', name: prefixEntry.prefix, entry: prefixEntry });
      }
      continue;
    }

    // Relative path keeps CI logs portable across runners (no leaked /home/runner/work/…
    // or local /Users/<name>/ paths) without losing locality info for debugging.
    const relPath = info.path ? relative(ROOT, info.path) || info.path : '';
    violations.push({
      name,
      pkgVersion,
      declared: info.licenses,
      effective,
      cls,
      path: relPath,
      repository: info.repository,
    });
  }

  // Drift detection: overrides/exemptions/prefixes whose package(s) are no
  // longer in the tree. Always informational; gate still exits 0 on a clean
  // license result.
  const stale = [];
  for (const e of allowlist.licenseOverrides || []) {
    if (!matchedNames.has(e.package)) stale.push({ kind: 'override', name: e.package, entry: e });
  }
  for (const e of allowlist.exemptions || []) {
    if (!matchedNames.has(e.package)) stale.push({ kind: 'exemption', name: e.package, entry: e });
  }
  for (const e of allowlist.exemptionPrefixes || []) {
    if (!matchedPrefixes.has(e.prefix)) stale.push({ kind: 'exemptionPrefix', name: e.prefix, entry: e });
  }

  if (overridden.length) {
    console.log(`Overrides applied (${overridden.length}):`);
    for (const { pkgVersion, declared, entry } of overridden) {
      console.log(`  ${pkgVersion}  declared=${JSON.stringify(declared)} → spdx=${entry.spdx}`);
      console.log(`    ${entry.reason}`);
      console.log(`    added ${entry.added}, review by ${entry.review}`);
    }
    console.log('');
  }
  if (exempted.length) {
    console.log(`Exemptions applied (${exempted.length}):`);
    for (const { pkgVersion, declared, entry } of exempted) {
      console.log(`  ${pkgVersion}  declared=${JSON.stringify(declared)} → exempt (${entry.spdx})`);
      console.log(`    ${entry.reason}`);
      console.log(`    added ${entry.added}, review by ${entry.review}`);
    }
    console.log('');
  }
  if (prefixHits.size) {
    console.log(`Prefix exemptions matched (${prefixHits.size}):`);
    for (const [prefix, hits] of prefixHits) {
      const entry = exemptPrefixes.find((p) => p.prefix === prefix);
      console.log(`  prefix ${prefix} → exempt (${entry.spdx}); ${hits.length} package(s)`);
      for (const h of hits) console.log(`    ${h.pkgVersion}  declared=${JSON.stringify(h.declared)}`);
      console.log(`    ${entry.reason}`);
      console.log(`    added ${entry.added}, review by ${entry.review}`);
    }
    console.log('');
  }

  for (const e of expired) {
    console.log(
      `::warning::License ${e.kind} for ${e.name} expired on ${e.entry.review}. Re-justify with a fresh review date or remove if the upstream license has been corrected.`,
    );
  }
  for (const s of stale) {
    console.log(
      `::warning::License ${s.kind} for ${s.name} is no longer matched by any installed package. Remove it from .supply-chain/license-allowlist.json.`,
    );
  }

  if (violations.length) {
    console.error('');
    console.error(`::error::${violations.length} license violation(s) in the installed tree:`);
    for (const v of violations) {
      console.error(`  [${v.cls}] ${v.pkgVersion}`);
      console.error(`    license: ${JSON.stringify(v.declared)}`);
      if (v.effective !== v.declared) console.error(`    effective: ${JSON.stringify(v.effective)}`);
      if (v.repository) console.error(`    repo: ${v.repository}`);
      if (v.path) console.error(`    path: ${v.path}`);
    }
    console.error(
      '\nResolve each:\n' +
        '  (a) license is fine          → add the SPDX id to allowedSpdx[]\n' +
        '  (b) declared but mis-mapped  → add a licenseOverrides[] entry (CORRECTION; not a policy exception)\n' +
        '  (c) accepted copyleft        → add to exemptions[] (exact name) with reason + dated review\n' +
        '  (d) removable                → drop the dependency\n' +
        'Config: .supply-chain/license-allowlist.json\n',
    );
    process.exit(1);
  }

  const acceptedSummary = `${overridden.length} overridden, ${exempted.length} exempted by name, ${prefixHits.size} prefix group(s)`;
  console.log(
    `license-check: OK (${scannedNames.size} pkgs scanned, ${acceptedSummary}, 0 violations) — scope=${scope}.`,
  );
  process.exit(0);
});
