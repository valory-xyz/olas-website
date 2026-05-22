#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Install-hook diff gate (Yarn 1.x).
 *
 * Scans node_modules for packages that declare lifecycle install scripts
 * (preinstall / install / postinstall) and compares them against
 * `.supply-chain/install-hooks.allowlist`. A new transitive dependency that
 * starts running an install script is exactly the kind of supply-chain change
 * `yarn audit` won't flag (it's not a published CVE) — this gate makes it
 * reviewable before it runs.
 *
 *   node scripts/audit-install-hooks.mjs            → fail on unallowlisted hooks
 *   node scripts/audit-install-hooks.mjs --update   → regenerate the allowlist
 *
 * The package.json `scripts` keys are present whether or not the hook ran, so
 * this works after `yarn install --ignore-scripts`.
 *
 * NOTE: authored to the plan's spec; the valory-xyz/agents-fun reference
 * `scripts/audit-install-hooks.mjs` wasn't reachable when this was written.
 * This intentionally does NOT auto-allow "trivial" hooks — every hook must be
 * explicitly allowlisted with a justification. Reconcile against upstream if a
 * trivial-hook fast path is desired.
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const NODE_MODULES = join(ROOT, 'node_modules');
const ALLOWLIST_PATH = join(ROOT, '.supply-chain', 'install-hooks.allowlist');
const HOOK_KEYS = ['preinstall', 'install', 'postinstall'];
const UPDATE = process.argv.includes('--update');

function* packageDirs() {
  if (!existsSync(NODE_MODULES)) return;
  for (const name of readdirSync(NODE_MODULES)) {
    if (name.startsWith('.')) continue;
    if (name.startsWith('@')) {
      const scopeDir = join(NODE_MODULES, name);
      for (const sub of readdirSync(scopeDir)) {
        if (sub.startsWith('.')) continue;
        yield [`${name}/${sub}`, join(scopeDir, sub)];
      }
    } else {
      yield [name, join(NODE_MODULES, name)];
    }
  }
}

const describe = (scripts) =>
  HOOK_KEYS.filter((k) => scripts[k])
    .map((k) => `${k}: ${scripts[k]}`)
    .join('; ');

const collectHooks = () => {
  const hooks = [];
  for (const [pkg, dir] of packageDirs()) {
    const manifest = join(dir, 'package.json');
    if (!existsSync(manifest)) continue;
    let json;
    try {
      json = JSON.parse(readFileSync(manifest, 'utf8'));
    } catch {
      continue;
    }
    const scripts = json.scripts || {};
    const found = {};
    for (const k of HOOK_KEYS) if (scripts[k]) found[k] = scripts[k];
    if (Object.keys(found).length > 0) hooks.push({ pkg, scripts: found });
  }
  hooks.sort((a, b) => a.pkg.localeCompare(b.pkg));
  return hooks;
};

// Returns Map<pkg, fullLine> for existing entries, so `--update` can preserve
// human-written justifications instead of clobbering them with the raw command.
const parseAllowlistEntries = () => {
  const entries = new Map();
  if (!existsSync(ALLOWLIST_PATH)) return entries;
  for (const line of readFileSync(ALLOWLIST_PATH, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const pkg = trimmed.split('#')[0].trim();
    if (pkg) entries.set(pkg, trimmed);
  }
  return entries;
};

const parseAllowlist = () => new Set(parseAllowlistEntries().keys());

const hooks = collectHooks();

if (!existsSync(NODE_MODULES)) {
  console.error('::error::node_modules not found — run yarn install first.');
  process.exit(2);
}

if (UPDATE) {
  const header = [
    '# Install-hook allowlist — packages with preinstall/install/postinstall scripts.',
    '# Regenerate with `yarn audit:install-hooks:update`, then justify each entry.',
    '# Format: <package> # <what the hook does and why it is acceptable>',
    '# An entry tagged "TODO: justify" is unreviewed — replace it with a real reason.',
    '',
  ];
  // Preserve existing (human-justified) lines; flag genuinely new packages as TODO.
  const existing = parseAllowlistEntries();
  let added = 0;
  const lines = hooks.map((h) => {
    if (existing.has(h.pkg)) return existing.get(h.pkg);
    added += 1;
    return `${h.pkg} # ${describe(h.scripts)} — TODO: justify`;
  });
  writeFileSync(ALLOWLIST_PATH, `${header.concat(lines).join('\n')}\n`);
  console.log(
    `Wrote ${hooks.length} install-hook entr(ies) to ${ALLOWLIST_PATH} (${added} new, ${hooks.length - added} preserved)`
  );
  process.exit(0);
}

const allowed = parseAllowlist();
const unexpected = hooks.filter((h) => !allowed.has(h.pkg));

if (unexpected.length > 0) {
  for (const h of unexpected) {
    console.error(`::error::Unallowlisted install hook: ${h.pkg} — ${describe(h.scripts)}`);
  }
  console.error(
    `::error::${unexpected.length} package(s) with install hooks are not in .supply-chain/install-hooks.allowlist. Review each, then run: yarn audit:install-hooks:update`
  );
  process.exit(1);
}

console.log(`Install-hook gate passed: ${hooks.length} hook(s) found, all allowlisted.`);
