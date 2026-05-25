#!/usr/bin/env node
/**
 * Enumerate every package in node_modules that declares a non-trivial
 * preinstall / install / postinstall script, and diff the list against
 * a checked-in allowlist at .supply-chain/install-hooks.allowlist.
 *
 * New names in the tree but not in the allowlist = fail. Names in the
 * allowlist but not in the tree = fail (drift — allowlist is stale).
 *
 * Use `--update` to regenerate the allowlist from the current tree.
 * Run after any dependency change:
 *   yarn install
 *   node scripts/audit-install-hooks.mjs --update
 *   git add .supply-chain/install-hooks.allowlist
 *
 * Mirrors valory-xyz/autonolas-frontend-mono/scripts/audit-install-hooks.mjs
 * (recursive walk, trivial-hook filter, bidirectional drift). One deliberate
 * local improvement: `--update` PRESERVES the human-written justification
 * comment for packages already in the allowlist and only tags genuinely-new
 * packages with `TODO: justify`, instead of clobbering all comments.
 *
 * See SUPPLY-CHAIN-SECURITY.md §6.
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

// Paths are anchored to the current working directory, not a CLI argument.
// yarn scripts always run from the workspace root, which is what we want.
// Taking a root path from argv would let it flow into readFileSync /
// writeFileSync as an unvalidated path (a path-traversal sink flagged by
// static analysis). The only CLI option the script accepts is `--update`,
// matched as a literal string below — it is never used as a file path.
const ROOT = resolve('.');
const ALLOWLIST_PATH = resolve(ROOT, '.supply-chain/install-hooks.allowlist');
const NODE_MODULES = resolve(ROOT, 'node_modules');
const UPDATE = process.argv.includes('--update');

const HOOK_KEYS = ['preinstall', 'install', 'postinstall'];

// Defence-in-depth: bound recursion into nested node_modules in case
// a pathological tree (symlink loop, malicious self-containment) exists.
// Real hoisted trees never exceed single-digit depth.
const MAX_DEPTH = 20;

// Hook commands we treat as trivial (no-op / log only). Everything else
// counts as "carries an install hook".
//
// The echo pattern uses a negative lookahead to reject any shell metachar
// that could chain a real command (e.g. `echo "ok" && node install.js`,
// `echo $(curl …)`). Without this, an attacker prefixing `echo ` would slip
// past the trivial filter.
const TRIVIAL = [
  /^(?!.*[&|;`$()<>])echo(\s|$)/,
  /^true$/,
  /^:$/,
  /^exit\s+0$/,
];

function isTrivial(cmd) {
  if (!cmd || typeof cmd !== 'string') return true;
  const t = cmd.trim();
  if (!t) return true;
  return TRIVIAL.some((r) => r.test(t));
}

/**
 * Recursively walk node_modules, yielding every package.json path.
 * Symlinked entries are skipped (Dirent.isDirectory() is false on a symlink) —
 * rare in this tree because Yarn 1.x hoists rather than symlinks. Out of scope
 * for the registry-published-malicious-package threat model; if a workflow
 * change ever introduces symlinked deps, this needs to follow symlinks via
 * realpathSync with cycle detection.
 */
function* walkPackageJsons(dir, depth = 0) {
  if (depth > MAX_DEPTH) return;
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const full = join(dir, entry.name);
    // Scoped packages: recurse into @scope/ to find @scope/pkg/package.json
    if (entry.name.startsWith('@')) {
      yield* walkPackageJsons(full, depth + 1);
      continue;
    }
    const pkgJson = join(full, 'package.json');
    if (existsSync(pkgJson)) {
      try {
        if (statSync(pkgJson).isFile()) yield pkgJson;
      } catch {}
    }
    // Recurse into nested node_modules (hoisting-related)
    const nested = join(full, 'node_modules');
    if (existsSync(nested)) yield* walkPackageJsons(nested, depth + 1);
  }
}

function collectHooks() {
  if (!existsSync(NODE_MODULES)) {
    console.error(`node_modules not found at ${NODE_MODULES} — run \`yarn install\` first.`);
    process.exit(2);
  }
  const found = new Map(); // name -> Set of "hook: cmd"
  for (const path of walkPackageJsons(NODE_MODULES)) {
    let pkg;
    try {
      pkg = JSON.parse(readFileSync(path, 'utf8'));
    } catch {
      continue;
    }
    if (!pkg.name || !pkg.scripts) continue;
    for (const hook of HOOK_KEYS) {
      const cmd = pkg.scripts[hook];
      if (!cmd || isTrivial(cmd)) continue;
      if (!found.has(pkg.name)) found.set(pkg.name, new Set());
      found.get(pkg.name).add(`${hook}: ${cmd.replace(/\s+/g, ' ').trim()}`);
    }
  }
  return found;
}

// Set of package names (for the gate comparison).
function loadAllowlist() {
  if (!existsSync(ALLOWLIST_PATH)) return new Set();
  const raw = readFileSync(ALLOWLIST_PATH, 'utf8');
  const names = new Set();
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const name = trimmed.split(/\s+#/)[0].trim();
    if (name) names.add(name);
  }
  return names;
}

// Map of package name -> existing comment text (after the first `#`), so
// `--update` can preserve human-written justifications across regenerations.
function loadExistingComments() {
  const comments = new Map();
  if (!existsSync(ALLOWLIST_PATH)) return comments;
  for (const line of readFileSync(ALLOWLIST_PATH, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const name = trimmed.split(/\s+#/)[0].trim();
    const hashIdx = trimmed.indexOf('#');
    if (name && hashIdx !== -1) comments.set(name, trimmed.slice(hashIdx + 1).trim());
  }
  return comments;
}

function writeAllowlist(hooks) {
  const existing = loadExistingComments();
  const names = [...hooks.keys()].sort();
  const header = [
    '# .supply-chain/install-hooks.allowlist',
    '#',
    '# Every package in node_modules that declares a non-trivial',
    '# preinstall / install / postinstall script. Regenerate with',
    '# `yarn audit:install-hooks:update` after any dependency change.',
    '# CI runs the same script without --update and fails if this file',
    '# drifts from the tree (new hook OR stale entry).',
    '#',
    '# Format: <package>  # <what the hook does and why it is acceptable>',
    '# A new package is written with a "TODO: justify" tag — replace it with a',
    '# real reason. Existing justifications are preserved across --update.',
    '',
  ];
  let added = 0;
  const lines = names.map((name) => {
    if (existing.has(name)) return `${name}  # ${existing.get(name)}`;
    added += 1;
    const hookSummary = [...hooks.get(name)].sort().join(' | ');
    return `${name}  # ${hookSummary} — TODO: justify`;
  });
  writeFileSync(ALLOWLIST_PATH, `${header.concat(lines).join('\n')}\n`);
  return { total: names.length, added };
}

const found = collectHooks();

if (UPDATE) {
  const { total, added } = writeAllowlist(found);
  console.log(`Wrote ${total} entries to ${ALLOWLIST_PATH} (${added} new, ${total - added} preserved).`);
  process.exit(0);
}

const allowed = loadAllowlist();
const foundNames = new Set(found.keys());
const unexpected = [...foundNames].filter((n) => !allowed.has(n)).sort();
const missing = [...allowed].filter((n) => !foundNames.has(n)).sort();

if (unexpected.length === 0 && missing.length === 0) {
  console.log(`install-hooks: OK (${foundNames.size} allowlisted).`);
  process.exit(0);
}

if (unexpected.length > 0) {
  console.error('::error::install-hook audit found NEW packages with install hooks not in the allowlist:');
  for (const name of unexpected) {
    console.error(`  + ${name}`);
    for (const hook of found.get(name)) console.error(`      ${hook}`);
  }
  console.error('');
  console.error('Review the hook. If it is legitimate, add the package to');
  console.error('.supply-chain/install-hooks.allowlist (run: yarn audit:install-hooks:update).');
}

if (missing.length > 0) {
  console.error('::error::install-hook allowlist has entries no longer in the tree (drift):');
  for (const name of missing) console.error(`  - ${name}`);
  console.error('');
  console.error('Remove the stale entries (run: yarn audit:install-hooks:update).');
}

process.exit(1);
