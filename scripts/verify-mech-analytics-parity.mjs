// Copyright 2026 Valory AG
// SPDX-License-Identifier: Apache-2.0
//
// Parity verification for the olas-website / mech-analytics consumer
// migration (mech-analytics docs/consumer_migration.md §4, §12 Q4).
//
// Corrected frame (this replaces the script's original partialRoi /
// successRate diff): partialRoi and successRate do NOT migrate to
// mech-analytics. The website keeps its own formulas. The migration
// (merged behind the USE_MECH_ANALYTICS flag, PR #548) only swaps
//   * the per-request mech-request feed inside
//     fetchIncrementalMechRequests (roi-distribution.ts:469) and the
//     tool-accuracy per-request pull (tool-accuracy.ts:148) to
//     /v1/data/scored-rows, and
//   * the senderTotal aggregate to agent_aggregates.n_mech_requests.
// Comparing the two independent ROI implementations end-to-end fails on
// definitional gaps (different populations, mech fees on one side,
// settlement-vs-placement bucketing) even when the migration is
// correct. What this script gates instead is the count-source swap
// itself, per consumer_migration.md §4 "Manual diff before
// parallel-run" and §12 Q4:
//
// Check 1 — open-market count parity (the core gate).
//   Reproduces the consumer's post-swap QMR pipeline on both sides for
//   the same window and compares the resulting "still open" counts.
//   * subgraph side: build QMR from marketplace-subgraph requests,
//     consume via dailyProfitStatistics profitParticipants (normalizeTitle
//     matching) — the exact algorithm roi-distribution.ts runs today.
//   * analytics side: feed scored-rows through the same consumer
//     filtering (mech-analytics.ts::fetchMechRequestsFromAnalytics
//     skips invalid rows and rows without requester/title; nothing else
//     is filtered — crucially, market_id is NOT gated), build the same
//     QMR shape, then consume via the same dailyStats logic.
//   The old version of this check gated on analytics rows with
//   market_id IS NOT NULL, but the consumer doesn't do that — 99% of
//   chain-100 rows in per_request_scores have market_id NULL (the
//   column is populated only for a small recent tail), so the previous
//   gate dropped ~99% of legitimate rows and produced a fake 0-vs-1326
//   divergence in prod. The (a)/(b)/(c) row-bucket breakdown is still
//   reported for context but is not the gated number.
//
// Check 2 — scored-rows row parity.
//   For the same window, the row set from
//   getMechRequestsIncrementalQuery (requester, blockTimestamp,
//   questionTitle) must match the rows from /v1/data/scored-rows
//   (requester, requested_at, question_title). Missing / extra rows
//   are reported per side.
//
// Check 3 — senderTotal parity.
//   agent_aggregates.n_mech_requests (window 'all', via
//   /v1/metrics/ai-agent/{chain}/{agent}) vs the marketplace
//   subgraph's Sender.totalLegacyRequests summed over the same
//   registered Safes (from the /instances endpoint). Compared with a
//   small absolute tolerance — see COUNT_TOLERANCE_DEFAULT below for
//   why exact equality is not the bar on this one check.
//   NOTE the field name is misleading. Verified in the subgraph
//   handler (autonolas-subgraph/subgraphs/marketplace/src/marketplace/
//   mech-marketplace.ts), `totalLegacyRequests` is bumped on BOTH the
//   on-chain (handleMarketplaceRequest) and off-chain
//   (handleMarketplaceDeliveryWithSignatures) paths, so it is actually
//   the grand total of every request the Safe made. The previous
//   version summed it with `totalMarketplaceRequests`, which counts
//   the on-chain path twice and produced a chronic 2× divergence
//   in prod. See pickSubgraphSenderTotal in the -lib module.
//
// NOT in this script — flag-on vs flag-off openRequestCount (§12 Q4's
// framing). Exercising the site's own fetchIncrementalMechRequests /
// fetchAllTimeAgents path twice (USE_MECH_ANALYTICS on/off) requires
// the Next.js runtime plus the Vercel Blob QMR state; a standalone
// node script cannot honestly reproduce it. That comparison is the
// staging parallel-run check, done by ops on the deployed site, not
// by this script.
//
// Exit codes:
//   0 — every check passed
//   1 — unexpected error (sentinel: only success paths overwrite it)
//   2 — vacuous run: every check had nothing to compare on either side
//   3 — divergence on one or more checks (outranks 4: a data gap on
//       one check must not mask a real divergence on another)
//   4 — data gap: a required field was null/missing on one side, or a
//       fetch was truncated, with no divergence found elsewhere
//
// Usage:
//   MECH_ANALYTICS_URL=https://... \
//   NEXT_PUBLIC_GNOSIS_MARKETPLACE_SUBGRAPH_URL=... \
//   NEXT_PUBLIC_POLYGON_MARKETPLACE_SUBGRAPH_URL=... \
//   NEXT_PUBLIC_OLAS_PREDICT_AGENTS_SUBGRAPH_URL=... \
//   NEXT_PUBLIC_OLAS_POLYMARKET_AGENTS_SUBGRAPH_URL=... \
//     node scripts/verify-mech-analytics-parity.mjs [--output-dir ./out]
//
// Window override for backfills (mutually exclusive with --window-days):
//   node scripts/verify-mech-analytics-parity.mjs \
//     --since 2026-07-01T00:00:00Z --until 2026-07-08T00:00:00Z
//
// Subgraph URLs embed API keys — they are secrets. This script never
// prints them (presence is logged as yes/no; HTTP errors carry status
// codes only, never the URL).

import { execSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';

import {
  normalizeTitle,
  isoFromUnixSec,
  scrub,
  safeOrigin,
  parsePositiveInt,
  parseNonNegativeInt,
  parseAwareIso,
  computeWindow,
  computeSubgraphOpenCount,
  classifyAnalyticsRows,
  computeAnalyticsOpenCount,
  diffRowSets,
  pickSubgraphSenderTotal,
} from './verify-mech-analytics-parity-lib.mjs';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

// Window for checks 1 and 2. consumer_migration.md §4 "Manual diff
// before parallel-run" gates on the last-4-days open-market count
// (markets resolve in ~4 days at steady state).
const WINDOW_DAYS_DEFAULT = 4;

// Rows requested in the last few minutes may exist on the subgraph but
// not yet in per_request_scores (score_new_rows runs on a 5-minute
// tick). Trim the near edge of the window on BOTH sides so scoring lag
// doesn't show up as fake missing rows.
const LAG_BUFFER_MINUTES_DEFAULT = 30;

// Check 3 absolute tolerance. Both sides ultimately read the same
// subgraph Sender counters, but mech-analytics caches them at rollup
// time (etl/readers/marketplace_subgraph.py::fetch_sender_request_counts)
// while this script reads the subgraph live — and the counters
// increment at settlement, not at request time (documented semantics,
// consumer_migration.md §4). A handful of requests settling between
// the rollup tick and this run is expected, not a divergence. Counts
// are otherwise compared exactly (checks 1 and 2 use zero tolerance).
const COUNT_TOLERANCE_DEFAULT = 5;

// Mech-analytics keeps a 24h finality gate on Omen: rows only flip to
// `resolved` 24h after finalization (consumer_migration.md §6). The
// subgraph's dailyProfitStatistics consumes a market as soon as the
// day's stats record it, so markets resolved in the last ~24h are
// consumed on the subgraph side but still `pending` in analytics.
// Over a 4-day window that's a chronic delta that turns honest runs
// red. Cap check-1 dailyStats consumption at (now - N h) to align.
const FINALITY_LAG_HOURS_DEFAULT = 24;

const DAY_SECONDS = 86400;
const SUBGRAPH_PAGE = 1000;
// graph-node rejects skip > 5000; a full page at that offset means the
// fetch is truncated and the affected checks degrade to a data gap.
const SUBGRAPH_MAX_SKIP = 5000;
const SCORED_ROWS_PAGE = 1000;
const SCORED_ROWS_MAX_PAGES = 500;
const SENDER_ID_CHUNK = 100;

// One platform = one (marketplace-subgraph chain, daily-stats subgraph,
// mech-analytics chain_id/agent_id) triple. Agent ids per
// consumer_migration.md §4: omenstrat /100/14, polystrat /137/86.
const PLATFORMS = [
  {
    key: 'omenstrat',
    chainId: 100,
    agentId: 14,
    marketplaceUrlEnv: 'NEXT_PUBLIC_GNOSIS_MARKETPLACE_SUBGRAPH_URL',
    dailyStatsUrlEnv: 'NEXT_PUBLIC_OLAS_PREDICT_AGENTS_SUBGRAPH_URL',
    // getOmenDailyProfitStatsQuery (queries.ts:721) exposes the title
    // as `question` on profitParticipants.
    participantTitleField: 'question',
  },
  {
    key: 'polystrat',
    chainId: 137,
    agentId: 86,
    marketplaceUrlEnv: 'NEXT_PUBLIC_POLYGON_MARKETPLACE_SUBGRAPH_URL',
    dailyStatsUrlEnv: 'NEXT_PUBLIC_OLAS_POLYMARKET_AGENTS_SUBGRAPH_URL',
    // getPolymarketDailyProfitStatsQuery (queries.ts:790) nests the
    // title under `metadata.title`.
    participantTitleField: 'metadata.title',
  },
];

const REQUIRED_ENV = [
  'MECH_ANALYTICS_URL',
  ...PLATFORMS.flatMap((p) => [p.marketplaceUrlEnv, p.dailyStatsUrlEnv]),
];

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const { values: args } = parseArgs({
  options: {
    'mech-analytics-url': { type: 'string' },
    'output-dir': { type: 'string' },
    'window-days': { type: 'string' },
    since: { type: 'string' },
    until: { type: 'string' },
    'lag-buffer-minutes': { type: 'string' },
    'finality-lag-hours': { type: 'string' },
    'count-tolerance': { type: 'string' },
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
      'Gates the mech-request count-source swap of the olas-website predict-page\n' +
      'migration (consumer_migration.md §4 / §12 Q4). Three checks per platform\n' +
      '(omenstrat=gnosis/100/14, polystrat=polygon/137/86):\n' +
      '  1. open-market count parity: same QMR + dailyStats consumption pipeline\n' +
      '     the consumer runs, executed against both sides for the same window\n' +
      '  2. scored-rows row parity: (requester, timestamp, title) row sets match\n' +
      '  3. senderTotal parity: agent_aggregates.n_mech_requests vs subgraph\n' +
      '     Sender.totalLegacyRequests (misnamed — it is the grand total,\n' +
      '     bumped on both on-chain and off-chain paths) per Safe\n' +
      'Flag-on/off openRequestCount comparison is the staging parallel-run\n' +
      'check done by ops on the deployed site — it is NOT run here.\n' +
      '\n' +
      'Options:\n' +
      '  --mech-analytics-url <url>   mech-analytics base URL (or MECH_ANALYTICS_URL env)\n' +
      `  --window-days <n>            checks 1+2 trailing window (default ${WINDOW_DAYS_DEFAULT});\n` +
      '                               ignored when --since/--until are given\n' +
      '  --since <iso>                explicit window lower bound (ISO 8601, must include\n' +
      '                               timezone offset). Requires --until.\n' +
      '  --until <iso>                explicit window upper bound (ISO 8601, must include\n' +
      '                               timezone offset). Requires --since. Mutually\n' +
      '                               exclusive with --window-days / --lag-buffer-minutes.\n' +
      `  --lag-buffer-minutes <n>     trailing-window near-edge trim (default ${LAG_BUFFER_MINUTES_DEFAULT});\n` +
      '                               ignored when --since/--until are given\n' +
      `  --finality-lag-hours <n>     check 1 consumption cutoff for the analytics 24h\n` +
      `                               finality gate (default ${FINALITY_LAG_HOURS_DEFAULT})\n` +
      `  --count-tolerance <n>        check 3 absolute tolerance (default ${COUNT_TOLERANCE_DEFAULT})\n` +
      '  --output-dir <dir>           write parity-<ts>.md/.json artifacts here\n' +
      '  -v, --verbose                log per-page fetch progress\n' +
      '  -h, --help                   show this help and exit 0\n' +
      '\n' +
      'Required env (subgraph URLs embed API keys — all secrets, never logged):\n' +
      `  ${REQUIRED_ENV.join('\n  ')}\n` +
      '\n' +
      'Exit codes: 0 pass, 1 error, 2 vacuous, 3 divergence, 4 data gap.\n'
  );
  process.exit(0);
}

const mechAnalyticsUrl = args['mech-analytics-url'] || process.env.MECH_ANALYTICS_URL;
const missingEnv = REQUIRED_ENV.filter(
  (name) => !(name === 'MECH_ANALYTICS_URL' ? mechAnalyticsUrl : process.env[name])
);
if (missingEnv.length > 0) {
  console.error(`missing required configuration: ${missingEnv.join(', ')}`);
  process.exit(1);
}

// parsePositiveInt / parseNonNegativeInt live in the -lib module and throw
// on bad input. Wrap here so the CLI still emits a clean error to stderr
// and exits 1 instead of spraying a stack trace.
const cliInt = (fn, raw, label, fallback) => {
  try {
    return fn(raw, label, fallback);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

// --since / --until are mutually exclusive with --window-days /
// --lag-buffer-minutes (an explicit window means the operator chose the
// exact bounds, so the trailing-window knobs don't apply). Reject the
// combination up front so the operator sees a clear message instead of
// silent priority behavior.
if ((args.since || args.until) && (args['window-days'] || args['lag-buffer-minutes'])) {
  console.error(
    '--since / --until are mutually exclusive with --window-days and --lag-buffer-minutes'
  );
  process.exit(1);
}

const outputDir = args['output-dir'] ? path.resolve(args['output-dir']) : null;
const windowDays = cliInt(parsePositiveInt, args['window-days'], 'window-days', WINDOW_DAYS_DEFAULT);
const lagBufferMinutes = cliInt(
  parseNonNegativeInt,
  args['lag-buffer-minutes'],
  'lag-buffer-minutes',
  LAG_BUFFER_MINUTES_DEFAULT
);
const finalityLagHours = cliInt(
  parseNonNegativeInt,
  args['finality-lag-hours'],
  'finality-lag-hours',
  FINALITY_LAG_HOURS_DEFAULT
);
const countTolerance = cliInt(
  parseNonNegativeInt,
  args['count-tolerance'],
  'count-tolerance',
  COUNT_TOLERANCE_DEFAULT
);

let sinceDate = null;
let untilDate = null;
try {
  sinceDate = parseAwareIso(args.since, 'since');
  untilDate = parseAwareIso(args.until, 'until');
} catch (err) {
  console.error(err.message);
  process.exit(1);
}

const verbose = Boolean(args.verbose);

const mechAnalyticsBase = mechAnalyticsUrl.replace(/\/$/, '');

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

// Window resolution: parseAwareIso rejects naive datetimes, computeWindow
// enforces the all-or-nothing --since/--until pairing and until > since,
// and falls back to the trailing (now - windowDays, now - lag) window
// otherwise. Same shape as verify_migration_swap.py's _compute_window.
let windowStartSec;
let windowEndSec;
let windowSource;
try {
  ({
    windowStartSec,
    windowEndSec,
    source: windowSource,
  } = computeWindow({
    since: sinceDate,
    until: untilDate,
    nowSec: Math.floor(Date.now() / 1000),
    windowDays,
    lagBufferMinutes,
  }));
} catch (err) {
  console.error(err.message);
  process.exit(1);
}

const metadata = {
  run_at_utc: new Date().toISOString(),
  script_git_sha: scriptGitSha(),
  mech_analytics_url: safeOrigin(mechAnalyticsUrl),
  window_source: windowSource,
  window_days: windowSource === 'trailing' ? windowDays : null,
  lag_buffer_minutes: windowSource === 'trailing' ? lagBufferMinutes : null,
  finality_lag_hours: finalityLagHours,
  count_tolerance_abs: countTolerance,
  window_start_utc: isoFromUnixSec(windowStartSec),
  window_end_utc: isoFromUnixSec(windowEndSec),
};

emit('=== Run metadata ===');
emit(`  run_at (UTC):         ${metadata.run_at_utc}`);
emit(`  script git SHA:       ${metadata.script_git_sha}`);
emit(`  mech-analytics URL:   ${metadata.mech_analytics_url}`);
emit(`  window source:        ${metadata.window_source}`);
if (windowSource === 'trailing') {
  emit(`  window (days):        ${metadata.window_days}`);
  emit(`  lag buffer (min):     ${metadata.lag_buffer_minutes}`);
}
emit(`  window:               (${metadata.window_start_utc}, ${metadata.window_end_utc}]`);
emit(`  finality lag (h):     ${metadata.finality_lag_hours} (check 1 only)`);
emit(`  count tolerance (±):  ${metadata.count_tolerance_abs} (check 3 only)`);
for (const name of REQUIRED_ENV.slice(1)) {
  // Presence only — the URLs embed API keys.
  emit(`  ${name}: set`);
}

// ---------------------------------------------------------------------------
// HTTP helpers
// ---------------------------------------------------------------------------

// POST { query } like the site's GraphQLClient does under the hood
// (common-util/graphql/client.ts). Error messages carry the label and
// status only — never the URL, which embeds the API key.
const gqlRequest = async (url, query, label) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) {
    throw new Error(`${label}: subgraph returned HTTP ${res.status}`);
  }
  const body = await res.json();
  if (Array.isArray(body.errors) && body.errors.length > 0) {
    throw new Error(`${label}: GraphQL error: ${body.errors[0]?.message ?? 'unknown'}`);
  }
  return body.data ?? {};
};

// ---------------------------------------------------------------------------
// Marketplace subgraph pulls
// ---------------------------------------------------------------------------

// Same query shape and pagination discipline as
// getMechRequestsIncrementalQuery (common-util/graphql/queries.ts:816)
// + fetchIncrementalMechRequests (roi-distribution.ts:229). A full page
// at the graph-node skip ceiling marks the result truncated instead of
// silently under-counting.
const fetchMarketplaceRequests = async (url, windowStartSec, windowEndSec, label) => {
  const rows = [];
  let skip = 0;
  let truncated = false;
  for (;;) {
    const data = await gqlRequest(
      url,
      `query MechRequestsIncremental {
        requests(
          first: ${SUBGRAPH_PAGE}
          skip: ${skip}
          where: { blockTimestamp_gt: "${windowStartSec}" }
          orderBy: blockTimestamp
          orderDirection: asc
        ) {
          id
          sender { id }
          blockTimestamp
          parsedRequest { questionTitle }
        }
      }`,
      label
    );
    const page = data?.requests ?? [];
    if (verbose) emit(`  [${label}] requests page skip=${skip} rows=${page.length}`);
    rows.push(...page);
    if (page.length < SUBGRAPH_PAGE) break;
    skip += SUBGRAPH_PAGE;
    if (skip > SUBGRAPH_MAX_SKIP) {
      truncated = true;
      break;
    }
  }

  // Mirror the site's per-row guards (roi-distribution.ts:251-254):
  // rows without sender, title, or a positive timestamp never enter QMR.
  const usable = [];
  let skippedMissingKey = 0;
  let skippedAfterWindowEnd = 0;
  for (const req of rows) {
    const requester = req.sender?.id?.toLowerCase();
    const title = req.parsedRequest?.questionTitle;
    const ts = Number(req.blockTimestamp ?? 0);
    if (!requester || !title || ts <= 0) {
      skippedMissingKey += 1;
      continue;
    }
    if (ts > windowEndSec) {
      skippedAfterWindowEnd += 1;
      continue;
    }
    // req.id is the marketplace subgraph's Request.id — same identifier
    // the mech-analytics lake writes back as `request_id`, so check 2
    // can match on it when both sides have it (see diffRowSets).
    usable.push({
      requester,
      ts,
      title,
      requestId: typeof req.id === 'string' ? req.id.toLowerCase() : null,
    });
  }
  return { rows: usable, truncated, skippedMissingKey, skippedAfterWindowEnd };
};

// Subset of getOmenDailyProfitStatsQuery (queries.ts:721) /
// getPolymarketDailyProfitStatsQuery (queries.ts:790): only the fields
// the settlement-consumption matching needs.
const fetchDailyStats = async (url, dateGte, dateLte, participantTitleField, label) => {
  const participantSelection =
    participantTitleField === 'question' ? 'question' : 'metadata { title }';
  const stats = [];
  let skip = 0;
  let truncated = false;
  for (;;) {
    const data = await gqlRequest(
      url,
      `query DailyProfitStats {
        dailyProfitStatistics(
          first: ${SUBGRAPH_PAGE}
          skip: ${skip}
          where: { date_gte: ${dateGte}, date_lte: ${dateLte} }
          orderBy: date
          orderDirection: asc
        ) {
          traderAgent { id }
          date
          profitParticipants { ${participantSelection} }
        }
      }`,
      label
    );
    const page = data?.dailyProfitStatistics ?? [];
    if (verbose) emit(`  [${label}] daily-stats page skip=${skip} rows=${page.length}`);
    stats.push(...page);
    if (page.length < SUBGRAPH_PAGE) break;
    skip += SUBGRAPH_PAGE;
    if (skip > SUBGRAPH_MAX_SKIP) {
      truncated = true;
      break;
    }
  }
  return { stats, truncated };
};

// getMarketplaceSendersQuery (queries.ts) narrowed to the Safes under
// verification via id_in — the site pages every sender, but check 3
// only needs the registered Safes' counters. See pickSubgraphSenderTotal
// in the -lib module for the counter choice.
const fetchSenderTotals = async (url, safeIds, label) => {
  const totals = new Map();
  for (let i = 0; i < safeIds.length; i += SENDER_ID_CHUNK) {
    const chunk = safeIds.slice(i, i + SENDER_ID_CHUNK);
    const idList = chunk.map((id) => `"${id}"`).join(', ');
    const data = await gqlRequest(
      url,
      `query MarketplaceSendersById {
        senders(first: ${SENDER_ID_CHUNK}, where: { id_in: [${idList}] }) {
          id
          totalLegacyRequests
        }
      }`,
      label
    );
    for (const sender of data?.senders ?? []) {
      const total = pickSubgraphSenderTotal(sender);
      if (total != null) totals.set(sender.id.toLowerCase(), total);
    }
  }
  return totals;
};

// ---------------------------------------------------------------------------
// mech-analytics pulls
// ---------------------------------------------------------------------------

const fetchJson = async (url, label) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`${label}: mech-analytics returned HTTP ${res.status}`);
  }
  return res.json();
};

// Pages /v1/data/scored-rows the same way the site's client does
// (common-util/api/predict/mech-analytics.ts::iterateScoredRows).
// `since` is >= on requested_at, so windowStart+1s reproduces the
// subgraph's strict blockTimestamp_gt boundary. `until` is exclusive
// on the API but the subgraph keeps rows at ts == windowEndSec (only
// ts > windowEndSec is skipped), so windowEndSec+1 keeps the two
// sides' inclusive-end semantics symmetric.
const fetchScoredRows = async (chainId, windowStartSec, windowEndSec, label) => {
  const rows = [];
  let truncated = false;
  const url = new URL(`${mechAnalyticsBase}/v1/data/scored-rows`);
  url.searchParams.set('chain_id', String(chainId));
  url.searchParams.set('since', isoFromUnixSec(windowStartSec + 1));
  url.searchParams.set('until', isoFromUnixSec(windowEndSec + 1));
  url.searchParams.set('limit', String(SCORED_ROWS_PAGE));

  let cursor = null;
  let pages = 0;
  for (;;) {
    if (cursor) url.searchParams.set('cursor', cursor);
    const page = await fetchJson(url, label);
    if (!Array.isArray(page.rows)) {
      throw new Error(`${label}: scored-rows response has no rows array`);
    }
    if (verbose) emit(`  [${label}] scored-rows page ${pages + 1} rows=${page.rows.length}`);
    rows.push(...page.rows);
    pages += 1;
    if (!page.next_cursor) break;
    if (typeof page.next_cursor !== 'string') {
      throw new Error(`${label}: scored-rows next_cursor is not a string`);
    }
    if (pages >= SCORED_ROWS_MAX_PAGES) {
      truncated = true;
      break;
    }
    cursor = page.next_cursor;
  }
  return { rows, truncated };
};

const fetchAgentAggregate = async (chainId, agentId) => {
  const label = `ai-agent ${chainId}/${agentId}`;
  const agent = await fetchJson(
    `${mechAnalyticsBase}/v1/metrics/ai-agent/${chainId}/${agentId}`,
    label
  );
  // days=0 skips the per-Safe daily series — check 3 only needs the
  // registered Safe addresses.
  const instances = await fetchJson(
    `${mechAnalyticsBase}/v1/metrics/ai-agent/${chainId}/${agentId}/instances?days=0`,
    `${label}/instances`
  );
  if (!Array.isArray(instances)) {
    throw new Error(`${label}: instances response is not an array`);
  }
  return { agent, instances };
};

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

let exitCode = 1; // sentinel: only the verdict block overwrites it
let verdict = 'ERROR';
const checkResults = [];

const record = (result) => {
  checkResults.push(result);
  return result;
};

try {
  for (const platform of PLATFORMS) {
    const { key, chainId, agentId } = platform;
    const marketplaceUrl = process.env[platform.marketplaceUrlEnv];
    const dailyStatsUrl = process.env[platform.dailyStatsUrlEnv];

    section(`${key} (chain ${chainId}, agent ${agentId}) — data pulls`);
    const [marketplace, dailyStats, scoredRows, aggregate] = await Promise.all([
      fetchMarketplaceRequests(marketplaceUrl, windowStartSec, windowEndSec, `${key}:marketplace`),
      // date_lte is capped at (now - finality lag) so the subgraph
      // side doesn't consume settlements still inside the analytics
      // 24h finality gate — otherwise recent settlements would show as
      // consumed on the subgraph but pending in analytics and produce
      // a chronic delta on honest runs. `nowSec` for the lag is
      // computed against the actual clock, not the window end, so an
      // explicit --since/--until run still trims the DailyStats side
      // by the same gate.
      fetchDailyStats(
        dailyStatsUrl,
        Math.floor(windowStartSec / DAY_SECONDS) * DAY_SECONDS,
        // For a trailing window the cap is (now - finality lag) — the
        // usual guard. For an explicit --since/--until historical window
        // the cap becomes (windowEnd + finality lag), so we don't
        // uselessly sweep months of daily-stats to consume settlements
        // that already happened well after the window closed. Both
        // stay in effect (`min`), so operators can't accidentally
        // widen the consumption horizon by picking a huge window.
        Math.min(
          Math.floor(Date.now() / 1000) - finalityLagHours * 60 * 60,
          windowEndSec + finalityLagHours * 60 * 60
        ),
        platform.participantTitleField,
        `${key}:daily-stats`
      ),
      fetchScoredRows(chainId, windowStartSec, windowEndSec, `${key}:scored-rows`),
      fetchAgentAggregate(chainId, agentId),
    ]);
    emit(`  marketplace requests in window: ${marketplace.rows.length}`);
    emit(
      `    (skipped: missing sender/title/ts=${marketplace.skippedMissingKey}, ` +
        `after window end=${marketplace.skippedAfterWindowEnd}` +
        `${marketplace.truncated ? ', TRUNCATED at subgraph skip cap' : ''})`
    );
    emit(
      `  daily-stat rows: ${dailyStats.stats.length}` +
        `${dailyStats.truncated ? ' (TRUNCATED at subgraph skip cap)' : ''}`
    );
    emit(
      `  scored rows in window: ${scoredRows.rows.length}` +
        `${scoredRows.truncated ? ' (TRUNCATED at page cap)' : ''}`
    );

    const { counts, usable: usableAnalyticsRows } = classifyAnalyticsRows(scoredRows.rows);

    // ---- Check 1: open-market count parity --------------------------------
    section(`${key} — check 1: open-market count parity`);
    const subgraphOpen = computeSubgraphOpenCount(
      marketplace.rows,
      dailyStats.stats,
      platform.participantTitleField
    );
    // Analytics side runs the SAME QMR + dailyStats consumption pipeline
    // the consumer runs post-swap. This is the number that actually
    // matters for the swap — not the (a) bucket the previous version
    // gated on. See computeAnalyticsOpenCount in the -lib module for
    // why market_id filtering is wrong.
    const analyticsOpen = computeAnalyticsOpenCount(
      usableAnalyticsRows,
      dailyStats.stats,
      platform.participantTitleField
    );
    emit(
      `  subgraph feed: ${marketplace.rows.length} requests, ` +
        `${subgraphOpen.consumed} consumed by settlement matching → open=${subgraphOpen.open}`
    );
    emit(
      `  analytics feed: ${analyticsOpen.ingested} rows ingested ` +
        `(${analyticsOpen.skippedInvalid} invalid skipped), ` +
        `${analyticsOpen.consumed} consumed by settlement matching → open=${analyticsOpen.open}`
    );
    emit('  raw scored-rows breakdown (informational, previously gated (a)):');
    emit(`    (a) pending + market_id: ${counts.pending_with_market}`);
    emit(`    (b) invalid:             ${counts.invalid}`);
    emit(`    (c) no market_id:        ${counts.no_market_id}`);
    emit(`        resolved:            ${counts.resolved}`);
    emit(`        missing key skipped: ${counts.skipped_missing_key}`);

    const check1Truncated = marketplace.truncated || dailyStats.truncated || scoredRows.truncated;
    let check1Status;
    if (marketplace.rows.length === 0 && scoredRows.rows.length === 0) {
      check1Status = 'vacuous';
      emit('  VACUOUS: no rows on either side in the window.');
    } else if (subgraphOpen.open === analyticsOpen.open) {
      // Exact equality — counts get no tolerance (unlike check 3, both
      // sides here describe the same window of the same requests).
      check1Status = check1Truncated ? 'gap' : 'pass';
      emit(
        check1Truncated
          ? `  MATCH on truncated data (${subgraphOpen.open}) — treating as a data gap, not a pass.`
          : `  PASS: open-market counts match exactly (${subgraphOpen.open}).`
      );
    } else if (check1Truncated) {
      // A truncated fetch cannot prove a divergence — the missing rows
      // could account for the whole delta.
      check1Status = 'gap';
      emit(
        `  GAP: counts differ (subgraph=${subgraphOpen.open}, analytics=${analyticsOpen.open}) but a fetch was truncated.`
      );
    } else {
      check1Status = 'divergence';
      emit(
        `  DIVERGENCE: subgraph open=${subgraphOpen.open} vs analytics open=${analyticsOpen.open}.`
      );
    }
    record({
      check: 'open_market_count',
      platform: key,
      status: check1Status,
      subgraph_open: subgraphOpen.open,
      subgraph_consumed: subgraphOpen.consumed,
      analytics_open: analyticsOpen.open,
      analytics_consumed: analyticsOpen.consumed,
      analytics_ingested: analyticsOpen.ingested,
      analytics_invalid_skipped: analyticsOpen.skippedInvalid,
      analytics_row_buckets: counts,
      truncated: check1Truncated,
    });

    // ---- Check 2: scored-rows row parity ----------------------------------
    section(`${key} — check 2: scored-rows row parity`);
    const rowDiff = diffRowSets(marketplace.rows, usableAnalyticsRows);
    emit(
      `  subgraph rows: ${marketplace.rows.length}, analytics rows: ${usableAnalyticsRows.length}`
    );
    emit(`  missing in analytics: ${rowDiff.missingInAnalytics}`);
    emit(`  extra in analytics:   ${rowDiff.extraInAnalytics}`);
    if (rowDiff.tsFallbackKeys > 0) {
      emit(
        `  ${rowDiff.tsFallbackKeys} key(s) matched via (requester, ts, title) fallback ` +
          '— once live lake writes turn on, requested_at can drift from blockTimestamp ' +
          'by seconds-to-minutes, so a divergence with a nonzero fallback count may be ' +
          'ts drift rather than a missing/extra row.'
      );
    }
    for (const sample of rowDiff.missingSamples) emit(`    missing: ${sample}`);
    for (const sample of rowDiff.extraSamples) emit(`    extra:   ${sample}`);

    const check2Truncated = marketplace.truncated || scoredRows.truncated;
    let check2Status;
    if (marketplace.rows.length === 0 && usableAnalyticsRows.length === 0) {
      check2Status = 'vacuous';
      emit('  VACUOUS: no rows on either side in the window.');
    } else if (rowDiff.missingInAnalytics === 0 && rowDiff.extraInAnalytics === 0) {
      check2Status = check2Truncated ? 'gap' : 'pass';
      emit(
        check2Truncated
          ? '  MATCH on truncated data — treating as a data gap, not a pass.'
          : '  PASS: row sets match exactly.'
      );
    } else if (check2Truncated) {
      check2Status = 'gap';
      emit('  GAP: row sets differ but a fetch was truncated — rerun with a smaller window.');
    } else {
      check2Status = 'divergence';
      emit('  DIVERGENCE: row sets differ.');
    }
    record({
      check: 'row_parity',
      platform: key,
      status: check2Status,
      subgraph_rows: marketplace.rows.length,
      analytics_rows: usableAnalyticsRows.length,
      missing_in_analytics: rowDiff.missingInAnalytics,
      extra_in_analytics: rowDiff.extraInAnalytics,
      missing_samples: rowDiff.missingSamples,
      extra_samples: rowDiff.extraSamples,
      ts_fallback_keys: rowDiff.tsFallbackKeys,
      truncated: check2Truncated,
    });

    // ---- Check 3: senderTotal parity --------------------------------------
    section(`${key} — check 3: senderTotal parity`);
    const safes = aggregate.instances
      .map((entry) => entry?.agent_address?.toLowerCase())
      .filter(Boolean);
    // Null is preserved, never coerced to 0: windows.all === null means
    // "no rollup row", which must not read as "zero requests".
    const allWindow = aggregate.agent?.windows?.all ?? null;
    const analyticsTotal = allWindow == null ? null : (allWindow.n_mech_requests ?? null);

    let check3Status;
    if (safes.length === 0 && analyticsTotal == null) {
      check3Status = 'vacuous';
      emit('  VACUOUS: no registered Safes and no rollup row — nothing to compare.');
      record({ check: 'sender_total', platform: key, status: check3Status, safes: 0 });
    } else if (analyticsTotal == null) {
      check3Status = 'gap';
      emit(
        `  GAP: ${safes.length} Safe(s) registered but agent_aggregates has no 'all' window row.`
      );
      record({
        check: 'sender_total',
        platform: key,
        status: check3Status,
        safes: safes.length,
        analytics_total: null,
      });
    } else {
      const senderTotals = await fetchSenderTotals(marketplaceUrl, safes, `${key}:senders`);
      // A Safe absent from the senders result legitimately means "never
      // made a request" (subgraph entities are created on first
      // request) — that is an actual 0, not a fetch failure (failures
      // throw above).
      let subgraphTotal = 0;
      let safesWithoutSender = 0;
      for (const safe of safes) {
        const total = senderTotals.get(safe);
        if (total == null) safesWithoutSender += 1;
        else subgraphTotal += total;
      }
      const delta = Math.abs(analyticsTotal - subgraphTotal);
      emit(`  registered Safes: ${safes.length} (${safesWithoutSender} with no sender entity)`);
      emit(`  analytics n_mech_requests (all): ${analyticsTotal}`);
      emit(`  subgraph Σ(totalLegacyRequests): ${subgraphTotal}`);
      emit(`  |delta| = ${delta} (tolerance ±${countTolerance}, settlement-lag allowance)`);
      if (delta <= countTolerance) {
        check3Status = 'pass';
        emit('  PASS: totals within the settlement-lag tolerance.');
      } else {
        check3Status = 'divergence';
        emit('  DIVERGENCE: totals differ beyond the settlement-lag tolerance.');
      }
      record({
        check: 'sender_total',
        platform: key,
        status: check3Status,
        safes: safes.length,
        safes_without_sender: safesWithoutSender,
        analytics_total: analyticsTotal,
        subgraph_total: subgraphTotal,
        delta,
        tolerance_abs: countTolerance,
      });
    }
  }

  // ---- Verdict -------------------------------------------------------------
  section('Verdict');
  const byStatus = (status) => checkResults.filter((r) => r.status === status);
  const divergences = byStatus('divergence');
  const gaps = byStatus('gap');
  const vacuous = byStatus('vacuous');
  emit(`  checks run:       ${checkResults.length}`);
  emit(`  passed:           ${byStatus('pass').length}`);
  emit(`  diverged:         ${divergences.length}`);
  emit(`  data gaps:        ${gaps.length}`);
  emit(`  vacuous:          ${vacuous.length}`);

  // Precedence: divergence (3) outranks gap (4) so an incomplete fetch
  // on one check can never mask a real regression on another. The
  // all-vacuous guard (2) stops a run where nothing was comparable from
  // reading as a PASS.
  if (divergences.length > 0) {
    emit('');
    emit(`FAIL (divergence): ${divergences.map((r) => `${r.platform}/${r.check}`).join(', ')}`);
    exitCode = 3;
    verdict = 'FAIL';
  } else if (gaps.length > 0) {
    emit('');
    emit(`FAIL (data gap): ${gaps.map((r) => `${r.platform}/${r.check}`).join(', ')}`);
    exitCode = 4;
    verdict = 'FAIL';
  } else if (vacuous.length === checkResults.length) {
    emit('');
    emit('VACUOUS: every check had nothing to compare on either side — not a pass.');
    exitCode = 2;
    verdict = 'VACUOUS';
  } else {
    emit('');
    emit('PASS: every non-vacuous check matched.');
    exitCode = 0;
    verdict = 'PASS';
  }
} catch (err) {
  emit('');
  emit(`ERROR: ${scrub(err.message)}`);
  if (err.stack) emit(scrub(err.stack));
  if (err.cause) emit(`cause: ${scrub(err.cause.message ?? err.cause)}`);
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
      `${JSON.stringify({ metadata, checks: checkResults, verdict, exit_code: exitCode }, null, 2)}\n`,
      'utf8'
    );
    emit(`\nwrote ${mdPath}`);
    emit(`wrote ${jsonPath}`);
  }
  // The explicit exit is needed because undici keep-alive sockets would
  // otherwise hold the event loop open — but stdout writes are async
  // when piped (docker logs, K8s), and a bare process.exit() discards
  // whatever is still buffered, including the verdict line. Queue the
  // exit behind a final zero-byte write so the buffer drains first.
  process.stdout.write('', () => process.exit(exitCode));
}
