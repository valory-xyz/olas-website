#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Production dependency audit gate (Yarn 1.x).
 *
 * Yarn 1's `yarn audit` exit code is a severity bitmask (1=info, 2=low,
 * 4=moderate, 8=high, 16=critical), not a --level comparison — so we parse the
 * NDJSON advisory stream directly and fail only on high/critical findings that
 * are NOT in `.supply-chain/audit-allowlist.json`.
 *
 * Allowlist entries past their `review` date emit a warning (the entry still
 * suppresses, but it's flagged for re-evaluation).
 *
 * NOTE: this mirrors the intent of the valory-xyz/agents-fun reference
 * `scripts/audit.mjs`. The reference repo's path wasn't reachable when this was
 * authored — reconcile against the upstream original for exact fleet parity.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ALLOWLIST_PATH = join(ROOT, '.supply-chain', 'audit-allowlist.json');
const BLOCKING = new Set(['high', 'critical']);

const loadAllowlist = () => {
  if (!existsSync(ALLOWLIST_PATH)) return { entries: [] };
  try {
    return JSON.parse(readFileSync(ALLOWLIST_PATH, 'utf8'));
  } catch (e) {
    console.error(`::error::Cannot parse ${ALLOWLIST_PATH}: ${e.message}`);
    process.exit(2);
  }
  return { entries: [] };
};

const runAudit = () => {
  const res = spawnSync('yarn', ['audit', '--json', '--groups', 'dependencies'], {
    cwd: ROOT,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
  if (res.error) {
    console.error(`::error::Failed to run yarn audit: ${res.error.message}`);
    process.exit(2);
  }
  const advisories = [];
  for (const line of (res.stdout || '').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    let obj;
    try {
      obj = JSON.parse(trimmed);
    } catch {
      continue;
    }
    if (obj.type === 'auditAdvisory' && obj.data?.advisory) {
      const a = obj.data.advisory;
      advisories.push({
        id: String(a.id),
        ghsa: a.github_advisory_id,
        module: a.module_name,
        severity: a.severity,
        title: a.title,
        url: a.url,
      });
    }
  }
  return advisories;
};

const main = () => {
  const allowlist = loadAllowlist();
  const allowById = new Map((allowlist.entries || []).map((e) => [String(e.id), e]));

  // Warn on expired review dates.
  const today = new Date().toISOString().slice(0, 10);
  for (const e of allowlist.entries || []) {
    if (e.review && e.review < today) {
      console.warn(
        `::warning::Audit allowlist entry ${e.id} (${e.package}) review date ${e.review} has passed — re-evaluate.`
      );
    }
  }

  // Dedup high/critical advisories by id (yarn lists one per dependency path).
  const byId = new Map();
  for (const a of runAudit()) {
    if (BLOCKING.has(a.severity)) byId.set(a.id, a);
  }

  const unsuppressed = [];
  for (const [id, a] of byId) {
    if (allowById.has(id)) {
      console.log(`allowlisted: [${a.severity}] ${a.module} (advisory ${a.id}, ${a.ghsa})`);
    } else {
      unsuppressed.push(a);
    }
  }

  if (unsuppressed.length > 0) {
    for (const a of unsuppressed) {
      console.error(
        `::error::[${a.severity}] ${a.module} — advisory ${a.id} (${a.ghsa}): ${a.title} — ${a.url}`
      );
    }
    console.error(
      `::error::${unsuppressed.length} high/critical advisory(ies) not in .supply-chain/audit-allowlist.json.`
    );
    process.exit(1);
  }

  console.log(
    `Audit gate passed: 0 unsuppressed high/critical advisories (${byId.size - unsuppressed.length} allowlisted).`
  );
};

main();
