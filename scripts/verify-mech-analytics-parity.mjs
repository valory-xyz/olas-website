// Copyright 2026 Valory AG
// SPDX-License-Identifier: Apache-2.0
//
// Parity verification: the olas-website predict page's `partialRoi` and
// `successRate` fields are the two metrics migrating to mech-analytics
// per the consumer-migration plan (see mech-analytics docs). This
// script proves that switching those two fields from the current
// subgraph-derived computation to the mech-analytics API preserves the
// numbers a visitor sees. Every other field on the predict page keeps
// its current computation and isn't the script's concern.
//
// The script compares 16 cells per run:
//   2 fields × 4 windows × 2 platforms
//     fields    = { partialRoi, successRate }
//     windows   = { 7d, 30d, 90d, max }   (max ↔ mech-analytics 'all')
//     platforms = { omenstrat, polystrat }
//
// The omenstrat side of mech-analytics is a client-side aggregation of
// agent 14 and agent 25 (both classified as valory_trader on Gnosis) —
// same weighted-average discipline mech-analytics itself uses in
// _aggregate_agent for multi-Safe agents. Polystrat is a single agent
// (137 / 86) so no aggregation is needed.
//
// Report shape mirrors mech-predict/scripts/verify_migration_swap.py:
// metadata header, per-cell PASS/FAIL, aggregate verdict, --output-dir
// writes <window>.md and <window>.json artifacts for a K8s Job pattern.
//
// Exit codes:
//   0 — every cell within tolerance
//   1 — unexpected error (sentinel: only success flips to 0)
//   3 — one or more cells diverge beyond tolerance
//   4 — required mech-analytics field missing from the response
//
// Usage:
//   BLOB_READ_WRITE_TOKEN=... MECH_ANALYTICS_URL=https://... \
//     node scripts/verify-mech-analytics-parity.mjs [--output-dir ./out]

import { execSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';

import { list } from '@vercel/blob';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const SNAPSHOT_CATEGORY = 'predict-v2';

// Same versioning discipline snapshot-storage.ts uses. Bump when the
// upstream constant changes.
const SCHEMA_VERSION = '20260708';

const OMENSTRAT_AGENTS = [
  { chainId: 100, agentId: 14 },
  { chainId: 100, agentId: 25 },
];
const POLYSTRAT_AGENT = { chainId: 137, agentId: 86 };

// olas-website window names in `WindowedMetric` -> mech-analytics window
// names in `AgentWindow`. `max` is the all-time window in both APIs; the
// names differ.
const WINDOW_MAP = {
  '7d': '7d',
  '30d': '30d',
  '90d': '90d',
  max: 'all',
};

// Default tolerance: relative 1e-4 for percent-valued metrics. Percent
// scale means a 0.01% delta trips this; anything smaller is
// float-precision noise. Both sides pull integer counts through
// float arithmetic so exact equality is not a realistic bar.
const DEFAULT_TOLERANCE_REL = 1e-4;

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const { values: args } = parseArgs({
  options: {
    'mech-analytics-url': { type: 'string' },
    'output-dir': { type: 'string' },
    tolerance: { type: 'string' },
    verbose: { type: 'boolean', short: 'v' },
    help: { type: 'boolean', short: 'h' },
  },
});

// --help exits before any env-var requirement so the Docker image's
// entrypoint can be smoke-tested (`docker run --rm <image> --help`)
// without secrets. Everything below the CLI block needs real config.
if (args.help) {
  process.stdout.write(
    'Usage: node scripts/verify-mech-analytics-parity.mjs [options]\n' +
      '\n' +
      'Parity check: olas-website predict-page partialRoi/successRate vs the\n' +
      'mech-analytics /v1/metrics/ai-agent endpoints (16 cells per run).\n' +
      '\n' +
      'Options:\n' +
      '  --mech-analytics-url <url>  mech-analytics base URL (or MECH_ANALYTICS_URL env)\n' +
      '  --output-dir <dir>          write parity-<ts>.md/.json artifacts here\n' +
      `  --tolerance <rel>           relative tolerance (default ${DEFAULT_TOLERANCE_REL})\n` +
      '  -v, --verbose               log fetched blob URL\n' +
      '  -h, --help                  show this help and exit 0\n' +
      '\n' +
      'Required env: BLOB_READ_WRITE_TOKEN (Vercel Blob read token, secret).\n' +
      '\n' +
      'Exit codes: 0 pass, 1 unexpected error, 3 divergence, 4 missing field.\n'
  );
  process.exit(0);
}

const mechAnalyticsUrl = args['mech-analytics-url'] || process.env.MECH_ANALYTICS_URL;
if (!mechAnalyticsUrl) {
  console.error('MECH_ANALYTICS_URL (env or --mech-analytics-url) is required');
  process.exit(1);
}
if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error('BLOB_READ_WRITE_TOKEN is required to read the olas-website snapshot');
  process.exit(1);
}
const outputDir = args['output-dir'] ? path.resolve(args['output-dir']) : null;
const tolerance = args.tolerance ? Number(args.tolerance) : DEFAULT_TOLERANCE_REL;
const verbose = Boolean(args.verbose);

// ---------------------------------------------------------------------------
// stdout capture (mirrors mech-predict's Tee for artifact writing)
// ---------------------------------------------------------------------------

const reportChunks = [];

const emit = (line = '') => {
  process.stdout.write(`${line}\n`);
  reportChunks.push(`${line}\n`);
};

const section = (title) => {
  emit('');
  emit(`=== ${title} ===`);
};

// ---------------------------------------------------------------------------
// Provenance header
// ---------------------------------------------------------------------------

const scriptGitSha = () => {
  if (process.env.GIT_SHA) return process.env.GIT_SHA;
  try {
    return execSync('git rev-parse HEAD', { cwd: import.meta.dirname })
      .toString()
      .trim();
  } catch {
    return 'unknown';
  }
};

const metadata = {
  run_at_utc: new Date().toISOString(),
  script_git_sha: scriptGitSha(),
  mech_analytics_url: mechAnalyticsUrl,
  tolerance_rel: tolerance,
  snapshot_category: SNAPSHOT_CATEGORY,
  snapshot_schema_version: SCHEMA_VERSION,
};

emit('=== Run metadata ===');
emit(`  run_at (UTC):        ${metadata.run_at_utc}`);
emit(`  script git SHA:      ${metadata.script_git_sha}`);
emit(`  mech-analytics URL:  ${metadata.mech_analytics_url}`);
emit(`  tolerance (rel):     ${metadata.tolerance_rel}`);

// ---------------------------------------------------------------------------
// Data pulls
// ---------------------------------------------------------------------------

// Both metrics live in a Vercel Blob keyed by category + schema version.
// Fetching the blob directly (over its public URL) is much cheaper than
// re-running fetchAllPredictMetrics and produces the exact values a
// visitor sees today — which is the parity question.
const fetchOlasWebsiteSnapshot = async () => {
  const envPrefix = `metrics-${process.env.NODE_ENV || 'production'}`;
  const filename = `${envPrefix}-${SCHEMA_VERSION}-${SNAPSHOT_CATEGORY}.json`;
  const { blobs } = await list({ prefix: filename, limit: 1 });
  const blob = (blobs || []).find((b) => b.pathname === filename);
  if (!blob) {
    throw new Error(
      `no snapshot blob found for filename=${filename}; check ` +
        'BLOB_READ_WRITE_TOKEN environment and NODE_ENV'
    );
  }
  if (verbose) emit(`  fetched blob:        ${blob.url}`);
  const res = await fetch(blob.url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`snapshot fetch failed: ${res.status} ${res.statusText}`);
  const snapshot = await res.json();
  if (!snapshot?.data?.omenstrat || !snapshot?.data?.polystrat) {
    throw new Error('snapshot is malformed: missing omenstrat/polystrat blocks');
  }
  return snapshot.data;
};

const fetchMechAnalyticsAgent = async (chainId, agentId) => {
  const url = `${mechAnalyticsUrl.replace(/\/$/, '')}/v1/metrics/ai-agent/${chainId}/${agentId}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`mech-analytics ${chainId}/${agentId}: ${res.status} ${res.statusText}`);
  }
  return res.json();
};

// ---------------------------------------------------------------------------
// Cross-agent aggregation (omenstrat = agent 14 + agent 25 on Gnosis)
//
// mech-analytics itself aggregates multi-Safe agents in
// _aggregate_agent (etl/api/routes/agent.py:303). It uses:
//   * ROI:  sum(payout) / sum(cost)  — never mean of ratios
//   * Accuracy: bet-count-weighted mean of per-Safe accuracy
// Because the per-agent endpoint returns already-aggregated ROI (not
// raw payout/cost), a client-side sum can't perfectly reproduce
// mech-analytics's payout-weighted ROI for the omenstrat pair. We
// approximate with an n_bets-weighted mean of ROI, which is the
// best we can do from the exposed fields, and note the caveat in
// the report. This is one of the gaps the parity script surfaces
// — a genuine bug in omenstrat parity would blow past the
// tolerance regardless of this approximation.
// ---------------------------------------------------------------------------

const weightedMean = (pairs) => {
  const nonNull = pairs.filter(([value]) => value != null && Number.isFinite(value));
  if (nonNull.length === 0) return null;
  const totalWeight = nonNull.reduce((sum, [, weight]) => sum + (weight || 0), 0);
  if (totalWeight === 0) return null;
  const weightedSum = nonNull.reduce((sum, [value, weight]) => sum + value * (weight || 0), 0);
  return weightedSum / totalWeight;
};

const aggregateOmenstrat = (agentResponses, windowKey) => {
  // Both agents' window blocks; nulls when the rollup has nothing.
  const windows = agentResponses.map((r) => r?.windows?.[windowKey] ?? null);
  const nBetsFor = (w, platform) => (w ? w[`n_bets_${platform}`] || 0 : 0);
  // Weight ROI and accuracy by the platform-specific bet count. If both
  // sides are zero-bet, the metric collapses to null (nothing to
  // compare) which the diff step treats as an unresolved cell.
  return {
    roi_omen: weightedMean(windows.map((w) => [w?.roi_omen, nBetsFor(w, 'omen')])),
    roi_polymarket: weightedMean(
      windows.map((w) => [w?.roi_polymarket, nBetsFor(w, 'polymarket')])
    ),
    tool_accuracy_omen: weightedMean(
      windows.map((w) => [w?.tool_accuracy_omen, nBetsFor(w, 'omen')])
    ),
    tool_accuracy_polymarket: weightedMean(
      windows.map((w) => [w?.tool_accuracy_polymarket, nBetsFor(w, 'polymarket')])
    ),
  };
};

// ---------------------------------------------------------------------------
// Field extraction
//
// olas-website stores percent values (e.g. 12.5 for 12.5%). mech-analytics
// stores ratios (e.g. 0.125 for 12.5%). The diff step converts before
// comparing.
// ---------------------------------------------------------------------------

const olasPartialRoi = (data, platform, olasWindow) => {
  const wm = data?.[platform]?.partialRoi?.value?.[olasWindow];
  return wm == null ? null : Number(wm);
};

const olasAccuracy = (data, platform, olasWindow) => {
  const wm = data?.[platform]?.successRate?.value?.[olasWindow];
  return wm == null ? null : Number(wm);
};

// mech-analytics returns ROI as a ratio; multiply by 100 for percent.
// The specific platform (omen vs polymarket) is inferred from the
// consumer platform key: omenstrat -> omen, polystrat -> polymarket.
const MECH_PLATFORM_MAP = { omenstrat: 'omen', polystrat: 'polymarket' };

const mechRoiPercent = (windowFields, consumerPlatform) => {
  const key = `roi_${MECH_PLATFORM_MAP[consumerPlatform]}`;
  const value = windowFields?.[key];
  return value == null ? null : value * 100;
};

const mechAccuracyPercent = (windowFields, consumerPlatform) => {
  const key = `tool_accuracy_${MECH_PLATFORM_MAP[consumerPlatform]}`;
  const value = windowFields?.[key];
  return value == null ? null : value * 100;
};

// ---------------------------------------------------------------------------
// Diff logic
// ---------------------------------------------------------------------------

const compareCell = (oldValue, newValue) => {
  if (oldValue == null && newValue == null) return { status: 'both-null' };
  if (oldValue == null || newValue == null) {
    return { status: 'null-mismatch', oldValue, newValue };
  }
  if (!Number.isFinite(oldValue) || !Number.isFinite(newValue)) {
    return { status: 'non-finite', oldValue, newValue };
  }
  const denom = Math.max(Math.abs(oldValue), 1e-6);
  const relDiff = Math.abs(oldValue - newValue) / denom;
  return {
    status: relDiff <= tolerance ? 'pass' : 'fail',
    oldValue,
    newValue,
    relDiff,
  };
};

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

let exitCode = 1; // sentinel: any unexpected exit stays 1
let verdict = 'ERROR';
const cellResults = [];

try {
  section('Data pulls');
  emit('  pulling olas-website snapshot from Vercel Blob...');
  const olasData = await fetchOlasWebsiteSnapshot();
  emit(
    `  snapshot fetched (timestamp: ${olasData.omenstrat?.partialRoi?.status?.checkedAt || 'unknown'})`
  );

  emit('  pulling mech-analytics agent responses...');
  const [omenstratAgent14, omenstratAgent25, polystratAgent] = await Promise.all([
    fetchMechAnalyticsAgent(OMENSTRAT_AGENTS[0].chainId, OMENSTRAT_AGENTS[0].agentId),
    fetchMechAnalyticsAgent(OMENSTRAT_AGENTS[1].chainId, OMENSTRAT_AGENTS[1].agentId),
    fetchMechAnalyticsAgent(POLYSTRAT_AGENT.chainId, POLYSTRAT_AGENT.agentId),
  ]);

  section('Per-cell diff');
  emit(
    '  platform     window   field         old (olas)   new (mech-analytics)   rel diff   status'
  );
  for (const [platform, mechResponse] of [
    ['omenstrat', null], // aggregated below
    ['polystrat', polystratAgent],
  ]) {
    for (const [olasWindow, mechWindow] of Object.entries(WINDOW_MAP)) {
      const mechWindowFields =
        platform === 'omenstrat'
          ? aggregateOmenstrat([omenstratAgent14, omenstratAgent25], mechWindow)
          : mechResponse?.windows?.[mechWindow];

      if (!mechWindowFields) {
        cellResults.push({
          platform,
          window: olasWindow,
          field: 'partialRoi',
          status: 'missing-field',
        });
        cellResults.push({
          platform,
          window: olasWindow,
          field: 'successRate',
          status: 'missing-field',
        });
        emit(`  ${platform.padEnd(12)} ${olasWindow.padEnd(8)} (mech-analytics window missing)`);
        continue;
      }

      for (const [fieldName, olasGetter, mechGetter] of [
        ['partialRoi', olasPartialRoi, mechRoiPercent],
        ['successRate', olasAccuracy, mechAccuracyPercent],
      ]) {
        const oldValue = olasGetter(olasData, platform, olasWindow);
        const newValue = mechGetter(mechWindowFields, platform);
        const result = compareCell(oldValue, newValue);
        cellResults.push({ platform, window: olasWindow, field: fieldName, ...result });
        const oldStr = oldValue == null ? 'null' : oldValue.toFixed(4);
        const newStr = newValue == null ? 'null' : newValue.toFixed(4);
        const relStr = result.relDiff == null ? '-' : result.relDiff.toExponential(2);
        emit(
          `  ${platform.padEnd(12)} ${olasWindow.padEnd(8)} ${fieldName.padEnd(13)} ${oldStr.padStart(10)}   ${newStr.padStart(18)}   ${relStr.padStart(9)}   ${result.status}`
        );
      }
    }
  }

  section('Verdict');
  const failures = cellResults.filter(
    (r) => r.status === 'fail' || r.status === 'null-mismatch' || r.status === 'non-finite'
  );
  const missing = cellResults.filter((r) => r.status === 'missing-field');
  emit(`  cells checked:       ${cellResults.length}`);
  emit(`  cells passed:        ${cellResults.filter((r) => r.status === 'pass').length}`);
  emit(`  cells both-null:     ${cellResults.filter((r) => r.status === 'both-null').length}`);
  emit(`  cells failed:        ${failures.length}`);
  emit(`  cells missing field: ${missing.length}`);

  if (missing.length > 0) {
    emit('');
    emit(
      `FAIL (missing field): ${missing.length} cell(s) — mech-analytics response is missing the expected window/field.`
    );
    exitCode = 4;
    verdict = 'FAIL';
  } else if (failures.length > 0) {
    emit('');
    emit(`FAIL (divergence): ${failures.length} cell(s) diverged beyond tolerance ${tolerance}.`);
    for (const f of failures) {
      emit(
        `  - ${f.platform}/${f.window}/${f.field}: old=${f.oldValue}, new=${f.newValue}, status=${f.status}`
      );
    }
    exitCode = 3;
    verdict = 'FAIL';
  } else {
    emit('');
    emit('PASS: every cell within tolerance.');
    exitCode = 0;
    verdict = 'PASS';
  }
} catch (err) {
  emit('');
  emit(`ERROR: ${err.message}`);
  if (err.stack) emit(err.stack);
  // exitCode remains 1 (sentinel)
} finally {
  emit('');
  emit(`verdict: ${verdict}  exit_code: ${exitCode}`);
  if (outputDir) {
    mkdirSync(outputDir, { recursive: true });
    const slug = `parity-${metadata.run_at_utc.replace(/[:.]/g, '-')}`;
    const mdPath = path.join(outputDir, `${slug}.md`);
    const jsonPath = path.join(outputDir, `${slug}.json`);
    writeFileSync(mdPath, reportChunks.join(''), 'utf8');
    writeFileSync(
      jsonPath,
      `${JSON.stringify(
        { metadata, cells: cellResults, verdict, exit_code: exitCode },
        null,
        2
      )}\n`,
      'utf8'
    );
    emit(`\nwrote ${mdPath}`);
    emit(`wrote ${jsonPath}`);
  }
  process.exit(exitCode);
}
