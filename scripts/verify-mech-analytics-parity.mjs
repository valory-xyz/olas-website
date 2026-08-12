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
// Check 2 — row parity ("displayable rows" definition).
//   For the same window, the set of rows a user would see rendered
//   on the predict page as a completed prediction must match on both
//   sides. Symmetric filter:
//     * subgraph side: `isDelivered: true AND
//       parsedRequest.questionTitle IS NOT NULL` in the WHERE clause
//       of the marketplace-subgraph `requests` query.
//     * analytics side: `/v1/data/scored-rows` ONLY (scored rows have
//       `tool NOT NULL AND delivered_at NOT NULL` by construction, so
//       they are exactly the delivered + parseable set).
//   Off-chain requests (subgraph `MarketplaceDeliveryWithSignatures`)
//   and unscored/shell rows (analytics `/v1/data/unscored-rows`)
//   drop symmetrically on both sides — they are not in the
//   displayable-rows population. Their counts are surfaced in the
//   artifact as `subgraph_off_chain_count` and
//   `analytics_unscored_count` for observability only.
//   The prior definition compared "all subgraph requests" against
//   "all analytics rows (scored + unscored + off-chain)": those are
//   two different populations, and the transient states between them
//   (undelivered, unparseable-payload) are legitimate real-world
//   behaviour that will never match cleanly. Adding undelivered rows
//   to mech-analytics would require a new lifecycle sweep
//   (undelivered → scored transitions) — out of scope by design.
//   Missing / extra rows are reported per side against the new
//   population.
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
//   Important: check 3 gates the POST-SWAP number. Once the migration
//   ships, the site reads `agent_aggregates.n_mech_requests` from
//   mech-analytics, which is populated directly by
//   `sender.totalLegacyRequests` (mech-analytics/etl/readers/
//   marketplace_subgraph.py:298), and that is what this check compares.
//   The current live-site formula at common-util/api/predict/
//   roi-distribution.ts:349 still does
//   `Number(sender.totalLegacyRequests) + Number(sender.totalMarketplaceRequests)`
//   — the exact double-counting sum this script diagnoses as the
//   check-3 bug. That means a green check 3 does NOT gate what users
//   see on the live site today; it gates the safety of the swap. Fixing
//   roi-distribution.ts:349 is out of scope for this parity script
//   (that lives with product sign-off and a separate PR) — but ops
//   should know that the pre-cutover live number and the post-cutover
//   verifier number differ by roughly a factor of two until that lands.
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
  decideVerdict,
  resolveCheck1Status,
  resolveCheck2Status,
  SKIP_RATIO_THRESHOLD,
} from './verify-mech-analytics-parity-lib.mjs';

const SKIP_RATIO_THRESHOLD_PCT = Math.round(SKIP_RATIO_THRESHOLD * 100);

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
// graph-node rejects skip > 5000 and per-day request volume on Gnosis
// (~21k/day) can exceed the resulting 6000-row cap even on a one-day
// window, so pagination is cursor-based on the entity timestamp. This
// cap is a runaway-loop guard, not a coverage limit; it should never
// be hit on a healthy 7-day window (7d × 21k ≈ 150k rows ÷ 1000/page
// ≈ 150 pages).
const SUBGRAPH_MAX_PAGES = 500;
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
      '  2. row parity ("displayable rows"): the rows a user would see rendered\n' +
      '     on the predict page as a completed prediction must match on both\n' +
      '     sides. Symmetric filter: subgraph isDelivered=true + questionTitle\n' +
      '     non-null, analytics /v1/data/scored-rows only. Off-chain and unscored\n' +
      '     rows drop symmetrically and are surfaced as observability only.\n' +
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
const windowDays = cliInt(
  parsePositiveInt,
  args['window-days'],
  'window-days',
  WINDOW_DAYS_DEFAULT
);
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
// Request-id normalisation
// ---------------------------------------------------------------------------

// The marketplace subgraph stores Request.id as a 0x-prefixed hex
// string. Predict-api stores mech_requests.request_id as the same
// 256-bit value in decimal (from the on-chain event's ``requestId``
// uint256) for marketplace-era rows, and mech-analytics carries that
// through unchanged — but pre-marketplace rows in per_request_scores
// (2023-era backfill on chain 100 and some rollovers on chain 137)
// were stored as 0x-hex too. Result: the analytics API mixes both
// formats depending on when the row was written. Normalising both
// sides to the same base10 representation makes id-based parity
// order-invariant and format-agnostic.
const normaliseRequestId = (raw) => {
  if (typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  if (trimmed.length === 0) return null;
  if (/^0x[0-9a-fA-F]+$/.test(trimmed)) {
    try {
      return BigInt(trimmed).toString(10);
    } catch {
      return null;
    }
  }
  if (/^[0-9]+$/.test(trimmed)) return trimmed;
  // Anything else (unrecognized encoding) is returned lower-cased so a
  // future non-hex/non-decimal id shape still round-trips; matching
  // will only succeed when both sides carry the same shape.
  return trimmed.toLowerCase();
};

// ---------------------------------------------------------------------------
// HTTP helpers
// ---------------------------------------------------------------------------

// Transient 5xx / network hiccups on either the graph gateway or the
// mech-analytics API used to abort the whole run (a single 504 mid-
// pagination wiped the ~50 pages of state already accumulated). Retry
// on 5xx and network errors with a short exponential backoff before
// escalating to a hard error. GraphQL-level errors (body.errors) are
// still fatal on the first attempt — those are query bugs, not
// transient.
const RETRY_MAX_ATTEMPTS = 5;
const RETRY_BASE_DELAY_MS = 500;

const shouldRetryHttp = (status) => status >= 500 && status < 600;

const withRetry = async (attemptFn, label) => {
  let lastError;
  for (let attempt = 1; attempt <= RETRY_MAX_ATTEMPTS; attempt += 1) {
    try {
      return await attemptFn(attempt);
    } catch (err) {
      lastError = err;
      const status = err?.retryableStatus;
      const isNetwork = err?.isNetwork === true;
      if (!status && !isNetwork) throw err;
      if (attempt === RETRY_MAX_ATTEMPTS) break;
      const delay = RETRY_BASE_DELAY_MS * 2 ** (attempt - 1);
      if (verbose) {
        emit(
          `  [${label}] transient failure (${status ? `HTTP ${status}` : 'network'}), ` +
            `retry ${attempt}/${RETRY_MAX_ATTEMPTS - 1} in ${delay}ms`
        );
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw lastError;
};

// POST { query } like the site's GraphQLClient does under the hood
// (common-util/graphql/client.ts). Error messages carry the label and
// status only — never the URL, which embeds the API key.
const gqlRequest = (url, query, label) =>
  withRetry(async () => {
    let res;
    try {
      res = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ query }),
      });
    } catch (netErr) {
      const wrapped = new Error(`${label}: subgraph network error: ${netErr.message}`);
      wrapped.isNetwork = true;
      throw wrapped;
    }
    if (!res.ok) {
      const err = new Error(`${label}: subgraph returned HTTP ${res.status}`);
      if (shouldRetryHttp(res.status)) err.retryableStatus = res.status;
      throw err;
    }
    const body = await res.json();
    if (Array.isArray(body.errors) && body.errors.length > 0) {
      throw new Error(`${label}: GraphQL error: ${body.errors[0]?.message ?? 'unknown'}`);
    }
    return body.data ?? {};
  }, label);

// ---------------------------------------------------------------------------
// Marketplace subgraph pulls
// ---------------------------------------------------------------------------

// Cursor-based pagination on ``blockTimestamp``. Skip-based pagination
// hits graph-node's ``skip > 5000`` ceiling at 6000 rows per fetch, which
// on Gnosis (~21k requests/day) truncates even a one-day window.
// ``blockTimestamp_gt: cursor`` moves the window forward per page and
// ``blockTimestamp_lte: windowEndSec`` puts the upper bound in the query
// so late rows don't need a post-fetch filter. Same query shape as
// getMechRequestsIncrementalQuery (common-util/graphql/queries.ts:816)
// + fetchIncrementalMechRequests (roi-distribution.ts:229) otherwise.
//
// Row-parity population — "displayable rows": the WHERE clause filters
// to `isDelivered: true AND parsedRequest_: {questionTitle_not: ""}`.
// That is the set the predict page renders today: delivered on-chain
// and whose IPFS payload the subgraph parsed to a non-empty title
// (`_not: ""` in graph-node excludes both empty strings AND null, so
// this also excludes `parsedRequest = null` rows via the nested-filter
// implicit non-null requirement). It mirrors the analytics-side
// scored population, which by construction has
// `tool NOT NULL AND delivered_at NOT NULL` and is further filtered
// analytics-side (buildAnalyticsRowParityEntry) to `question_title`
// non-empty for symmetric displayability. Comparing "all subgraph
// requests" against "all analytics rows" (previous version) is a
// category error — those are two different populations that never
// match cleanly. The transient states (undelivered / unparseable
// payload / empty title) drop symmetrically on both sides under this
// filter.
//
// Pagination: cursor-based on `blockTimestamp` with `_gte` + id-based
// dedup. Skip-based pagination hits graph-node's `skip > 5000` ceiling
// at 6000 rows per fetch, which on Gnosis (~21k requests/day)
// truncates even a one-day window. Using `_gt` would silently lose
// rows at tie-boundary timestamps when >1 row shares the last row's
// blockTimestamp and not all fit on the page — graph-node's secondary
// sort within a tied timestamp isn't guaranteed stable, so a row at
// ts=T past position 1000 would be dropped by `_gt: T` on the next
// page. `_gte: T` + dedup by `Request.id` overlaps by ~1 row per page
// (the last row from the previous page) but guarantees every row at
// ts=T is fetched exactly once. Verified against the omenstrat 4-day
// window: `_gt` reported 6392 rows vs 6393 in analytics scored-rows
// (1 tie-boundary row lost); `_gte` + dedup reports the true 6393.
//
// Same-timestamp saturation: if a full page comes back with every
// row sharing the last row's `blockTimestamp`, we cannot advance the
// cursor at all (the whole page is at ts=T; a `_gte: T` next page
// would re-fetch the same rows in a loop). Advance by 1s and warn —
// dropping rows at that exact second is possible in principle but
// requires >1000 requests to land in a single second on one chain,
// far above steady-state production request rates.
const fetchMarketplaceRequests = async (url, windowStartSec, windowEndSec, label) => {
  const seenIds = new Set();
  const rows = [];
  let cursor = windowStartSec;
  let firstPage = true;
  let truncated = false;
  let pages = 0;
  let duplicatesCollapsed = 0;
  for (;;) {
    // First page uses `_gt: windowStartSec` (the window is
    // (windowStartSec, windowEndSec], matching the subgraph's
    // strict-lower / inclusive-upper contract in fetchIncrementalMechRequests).
    // Subsequent pages use `_gte: lastTs` so tie-boundary rows are
    // included and deduped.
    const tsPredicate = firstPage
      ? `blockTimestamp_gt: "${cursor}"`
      : `blockTimestamp_gte: "${cursor}"`;
    const data = await gqlRequest(
      url,
      `query MechRequestsIncremental {
        requests(
          first: ${SUBGRAPH_PAGE}
          where: {
            ${tsPredicate},
            blockTimestamp_lte: "${windowEndSec}",
            isDelivered: true,
            parsedRequest_: { questionTitle_not: "" }
          }
          orderBy: blockTimestamp
          orderDirection: asc
        ) {
          id
          sender { id }
          blockTimestamp
          isDelivered
          parsedRequest { questionTitle }
        }
      }`,
      label
    );
    const page = data?.requests ?? [];
    if (verbose)
      emit(`  [${label}] requests page ${pages + 1} cursor=${cursor} rows=${page.length}`);
    for (const row of page) {
      if (seenIds.has(row.id)) {
        duplicatesCollapsed += 1;
        continue;
      }
      seenIds.add(row.id);
      rows.push(row);
    }
    pages += 1;
    firstPage = false;
    if (page.length < SUBGRAPH_PAGE) break;
    if (pages >= SUBGRAPH_MAX_PAGES) {
      truncated = true;
      break;
    }
    const lastTs = Number(page[page.length - 1].blockTimestamp);
    const firstTs = Number(page[0].blockTimestamp);
    if (lastTs === firstTs) {
      emit(
        `  [${label}] WARN: same-timestamp saturation at ts=${lastTs} (full page shares a single blockTimestamp) — advancing cursor by 1s`
      );
      cursor = lastTs + 1;
      firstPage = true; // reuse `_gt` on the leap; no boundary to overlap
    } else {
      cursor = lastTs;
    }
  }
  if (verbose && duplicatesCollapsed > 0) {
    emit(`  [${label}] pagination overlap collapsed ${duplicatesCollapsed} duplicate id(s)`);
  }

  // Split the fetched entities into two views:
  //   * `usable` — QMR-shaped rows (requester + title + ts in window),
  //     mirrors roi-distribution.ts:251-254; check 1 (open-market
  //     count) uses this.
  //   * `withRequestId` — same superset (now that the WHERE clause
  //     already gates on isDelivered + parsedRequest.questionTitle
  //     non-null, every returned row has a title), further filtered to
  //     rows whose `request_id` parses via `normaliseRequestId`. Check 2
  //     (row parity) uses this so a subgraph row and its analytics-side
  //     scored counterpart at /v1/data/scored-rows match by id.
  //
  // Attrition breakdown is split into "missing sender/ts" (true schema-
  // regression signal — sender.id nulled or blockTimestamp missing) vs
  // "missing title only" (should be 0 under the new WHERE gate — kept
  // as a paranoid schema-drift telltale, e.g. the subgraph starts
  // returning null titles despite the `_not: null` predicate).
  const usable = [];
  const withRequestId = [];
  let skippedMissingSenderOrTs = 0;
  let skippedMissingTitleOnly = 0;
  let skippedAfterWindowEnd = 0;
  for (const req of rows) {
    const requester = req.sender?.id?.toLowerCase();
    const title = req.parsedRequest?.questionTitle;
    const ts = Number(req.blockTimestamp ?? 0);
    const requestId = normaliseRequestId(req.id);
    if (!requester || ts <= 0) {
      skippedMissingSenderOrTs += 1;
      continue;
    }
    if (ts > windowEndSec) {
      skippedAfterWindowEnd += 1;
      continue;
    }
    if (requestId) {
      withRequestId.push({ requester, ts, title: title ?? null, requestId });
    }
    if (!title) {
      // Kept out of the QMR feed (no title → no settlement match), but
      // already recorded in withRequestId above for check 2.
      skippedMissingTitleOnly += 1;
      continue;
    }
    // req.id is the marketplace subgraph's Request.id — same identifier
    // the mech-analytics lake writes back as `request_id`, so check 2
    // can match on it when both sides have it (see diffRowSets).
    usable.push({ requester, ts, title, requestId });
  }
  return {
    rows: usable,
    withRequestId,
    truncated,
    skippedMissingSenderOrTs,
    skippedMissingTitleOnly,
    // Union kept for the artifact / attribution message; the two-bucket
    // split above drives the attrition guard.
    skippedMissingKey: skippedMissingSenderOrTs + skippedMissingTitleOnly,
    skippedAfterWindowEnd,
  };
};

// Subset of getOmenDailyProfitStatsQuery (queries.ts:721) /
// getPolymarketDailyProfitStatsQuery (queries.ts:790): only the fields
// the settlement-consumption matching needs. Cursor-based on ``date``
// for the same reason as fetchMarketplaceRequests — many trader agents
// share the same ``date`` (dailyProfitStatistics is keyed by
// ``(traderAgent, date)``), and the historical consumption horizon can
// span months on an explicit --since/--until run. Same-``date``
// saturation is handled with a 1-day advance; production has O(100s)
// of trader agents per platform, well under the 1000-row page cap.
const fetchDailyStats = async (url, dateGte, dateLte, participantTitleField, label) => {
  const participantSelection =
    participantTitleField === 'question' ? 'question' : 'metadata { title }';
  const stats = [];
  // Seed cursor so the first fetch's date_gt matches the caller's
  // inclusive date_gte lower bound.
  let cursor = dateGte - 1;
  let truncated = false;
  let pages = 0;
  for (;;) {
    const data = await gqlRequest(
      url,
      `query DailyProfitStats {
        dailyProfitStatistics(
          first: ${SUBGRAPH_PAGE}
          where: { date_gt: ${cursor}, date_lte: ${dateLte} }
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
    if (verbose)
      emit(`  [${label}] daily-stats page ${pages + 1} cursor=${cursor} rows=${page.length}`);
    stats.push(...page);
    pages += 1;
    if (page.length < SUBGRAPH_PAGE) break;
    if (pages >= SUBGRAPH_MAX_PAGES) {
      truncated = true;
      break;
    }
    const lastDate = Number(page[page.length - 1].date);
    const firstDate = Number(page[0].date);
    if (lastDate === firstDate) {
      emit(
        `  [${label}] WARN: same-date saturation at date=${lastDate} (full page shares a single date) — advancing cursor by 1 day`
      );
      cursor = lastDate + DAY_SECONDS;
    } else {
      cursor = lastDate;
    }
  }
  return { stats, truncated };
};

// Off-chain request IDs live only on `MarketplaceDeliveryWithSignatures`
// entities — the off-chain handler
// (autonolas-subgraph/subgraphs/marketplace/src/marketplace/mech-marketplace.ts
// handleMarketplaceDeliveryWithSignatures) does NOT create a `Request`
// entity per off-chain request. Instead it emits one delivery entity
// per settled batch, carrying a `requestIds` array of the off-chain IDs
// that batch settled.
//
// OBSERVABILITY-ONLY. Under the "displayable rows" definition of
// row_parity (see fetchMarketplaceRequests), row_parity compares the
// delivered + parseable on-chain population against the analytics
// scored population. Off-chain delivery entities carry no
// `isDelivered` flag (they only exist because they settled) and no
// parsed title (title lives in the private IPFS payload), so they
// cannot be placed on either side of the displayable-row comparison
// without conflating populations. The count is still fetched and
// surfaced in the artifact as `subgraph_off_chain_count` so an
// operator can see whether an unexplained residual on the analytics
// side coincides with off-chain activity, but it MUST NOT feed
// row_parity.
//
// Cursor-paginated on `blockTimestamp` — same shape and truncation /
// same-timestamp handling as `fetchMarketplaceRequests` above. The
// entity's own `id` is the batch id (uses transactionHash + log index
// under the hood, `130 chars` shape) and is NOT the per-request id we
// want; the per-request ids are the entries inside the `requestIds`
// array, one entity yielding N entries where N = numDeliveries. Each
// entry is normalised via `normaliseRequestId` (subgraph returns lower-
// case hex Bytes; analytics stores the same uint256 as a decimal string
// for marketplace-era rows; normaliser collapses both to decimal so
// the id-based multiset diff is format-agnostic).
const fetchMarketplaceOffChainRequestIds = async (url, windowStartSec, windowEndSec, label) => {
  const entities = [];
  let cursor = windowStartSec;
  let truncated = false;
  let pages = 0;
  for (;;) {
    const data = await gqlRequest(
      url,
      `query MarketplaceOffChainDeliveries {
        marketplaceDeliveryWithSignatures_collection(
          first: ${SUBGRAPH_PAGE}
          where: { blockTimestamp_gt: "${cursor}", blockTimestamp_lte: "${windowEndSec}" }
          orderBy: blockTimestamp
          orderDirection: asc
        ) {
          id
          requester
          numDeliveries
          requestIds
          blockTimestamp
        }
      }`,
      label
    );
    const page = data?.marketplaceDeliveryWithSignatures_collection ?? [];
    if (verbose)
      emit(`  [${label}] deliveries page ${pages + 1} cursor=${cursor} rows=${page.length}`);
    entities.push(...page);
    pages += 1;
    if (page.length < SUBGRAPH_PAGE) break;
    if (pages >= SUBGRAPH_MAX_PAGES) {
      truncated = true;
      break;
    }
    const lastTs = Number(page[page.length - 1].blockTimestamp);
    const firstTs = Number(page[0].blockTimestamp);
    if (lastTs === firstTs) {
      emit(
        `  [${label}] WARN: same-timestamp saturation at ts=${lastTs} (full page shares a single blockTimestamp) — advancing cursor by 1s`
      );
      cursor = lastTs + 1;
    } else {
      cursor = lastTs;
    }
  }

  const withRequestId = [];
  let skippedMissingSenderOrTs = 0;
  let skippedEmptyRequestIds = 0;
  let skippedAfterWindowEnd = 0;
  let skippedUnparseableId = 0;
  for (const entity of entities) {
    // `requester` on the delivery entity is a Bytes column (not a
    // `Sender` reference), so no `.id` accessor is needed. Lower-case
    // to match the subgraph's Request-side normalisation (`sender.id`
    // is lower-cased by convention).
    const requester = entity.requester?.toLowerCase();
    const ts = Number(entity.blockTimestamp ?? 0);
    const ids = Array.isArray(entity.requestIds) ? entity.requestIds : [];
    if (!requester || ts <= 0) {
      skippedMissingSenderOrTs += 1;
      continue;
    }
    if (ts > windowEndSec) {
      skippedAfterWindowEnd += 1;
      continue;
    }
    if (ids.length === 0) {
      skippedEmptyRequestIds += 1;
      continue;
    }
    for (const raw of ids) {
      const requestId = normaliseRequestId(raw);
      if (!requestId) {
        skippedUnparseableId += 1;
        continue;
      }
      // No title on off-chain rows — the delivery entity doesn't carry
      // a parsed title (title lives in the private IPFS payload, which
      // the subgraph never sees). Analytics-side rows for these same
      // requests also have `question_title` NULL for the same reason.
      // Set title=null; the id-based match in diffRowSets is what
      // pairs them.
      withRequestId.push({ requester, ts, title: null, requestId });
    }
  }

  return {
    withRequestId,
    truncated,
    entitiesFetched: entities.length,
    skippedMissingSenderOrTs,
    skippedEmptyRequestIds,
    skippedAfterWindowEnd,
    skippedUnparseableId,
  };
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

const fetchJson = (url, label) =>
  withRetry(async () => {
    let res;
    try {
      res = await fetch(url);
    } catch (netErr) {
      const wrapped = new Error(`${label}: mech-analytics network error: ${netErr.message}`);
      wrapped.isNetwork = true;
      throw wrapped;
    }
    if (!res.ok) {
      const err = new Error(`${label}: mech-analytics returned HTTP ${res.status}`);
      if (shouldRetryHttp(res.status)) err.retryableStatus = res.status;
      throw err;
    }
    return res.json();
  }, label);

// Pages a paginated mech-analytics data endpoint. `since` is >= on
// requested_at, so windowStart+1s reproduces the subgraph's strict
// blockTimestamp_gt boundary. `until` is exclusive on the API but the
// subgraph keeps rows at ts == windowEndSec (only ts > windowEndSec is
// skipped), so windowEndSec+1 keeps the two sides' inclusive-end
// semantics symmetric. Same shape used for /v1/data/scored-rows and
// /v1/data/unscored-rows (the two endpoints partition per_request_scores
// on column presence — mech-analytics PR #27).
//
// Optional `source` filter (mech-analytics PR #28) narrows the pull to
// one or more of predict-api's ingest labels: `mech_onchain`,
// `mech_offchain`, `ipfs_historical`. Passed as a comma-separated
// `?source=a,b` (server-side flattens comma form and the repeatable
// `?source=a&source=b` form to the same `ANY(text[])` filter; comma is
// shorter for logs). A typo returns 422 rather than an empty page, so
// an unknown value is a hard error at the boundary, not silently
// false-negative parity.
const fetchDataEndpoint = async (
  endpoint,
  chainId,
  windowStartSec,
  windowEndSec,
  label,
  { source } = {}
) => {
  const rows = [];
  let truncated = false;
  const url = new URL(`${mechAnalyticsBase}${endpoint}`);
  url.searchParams.set('chain_id', String(chainId));
  url.searchParams.set('since', isoFromUnixSec(windowStartSec + 1));
  url.searchParams.set('until', isoFromUnixSec(windowEndSec + 1));
  url.searchParams.set('limit', String(SCORED_ROWS_PAGE));
  if (Array.isArray(source) && source.length > 0) {
    url.searchParams.set('source', source.join(','));
  }

  let cursor = null;
  let pages = 0;
  for (;;) {
    if (cursor) url.searchParams.set('cursor', cursor);
    const page = await fetchJson(url, label);
    if (!Array.isArray(page.rows)) {
      throw new Error(`${label}: response has no rows array`);
    }
    if (verbose) emit(`  [${label}] page ${pages + 1} rows=${page.rows.length}`);
    rows.push(...page.rows);
    pages += 1;
    if (!page.next_cursor) break;
    if (typeof page.next_cursor !== 'string') {
      throw new Error(`${label}: next_cursor is not a string`);
    }
    if (pages >= SCORED_ROWS_MAX_PAGES) {
      truncated = true;
      break;
    }
    cursor = page.next_cursor;
  }
  return { rows, truncated };
};

// Mirrors common-util/api/predict/mech-analytics.ts::iterateScoredRows.
// Callers that need to reconcile against the marketplace subgraph's
// on-chain-only `Request` collection pass
// `{ source: ['mech_onchain', 'ipfs_historical'] }` to drop off-chain
// rows at the API boundary — see `fetchDataEndpoint`.
const fetchScoredRows = (chainId, windowStartSec, windowEndSec, label, options) =>
  fetchDataEndpoint('/v1/data/scored-rows', chainId, windowStartSec, windowEndSec, label, options);

// Shell rows (predict-api's unparseable-payload rows) live at
// /v1/data/unscored-rows (mech-analytics PR #27 split them out of
// /v1/data/scored-rows). Shell rows have every score column NULL and
// ``question_title=None`` by construction, so they are the analytics-
// side analogue of subgraph rows whose `parsedRequest.questionTitle`
// resolved to null.
//
// OBSERVABILITY-ONLY. Under the "displayable rows" definition of
// row_parity (see fetchMarketplaceRequests), the subgraph side is
// pre-filtered to delivered + parseable rows, so the analytics side
// must be scored-only (also delivered + parseable) to match the same
// population. Feeding the unscored union into row_parity re-introduces
// the population mismatch the redefinition set out to remove. The
// count is fetched and surfaced in the artifact as
// `analytics_unscored_count` for observability, but it MUST NOT feed
// row_parity.
const fetchUnscoredRows = (chainId, windowStartSec, windowEndSec, label, options) =>
  fetchDataEndpoint(
    '/v1/data/unscored-rows',
    chainId,
    windowStartSec,
    windowEndSec,
    label,
    options
  );

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
    const [marketplace, marketplaceOffChain, dailyStats, scoredRows, unscoredRows, aggregate] =
      await Promise.all([
        fetchMarketplaceRequests(
          marketplaceUrl,
          windowStartSec,
          windowEndSec,
          `${key}:marketplace`
        ),
        // Off-chain request IDs from `MarketplaceDeliveryWithSignatures`
        // entities — the subgraph's `requests(...)` query only returns
        // on-chain rows (the off-chain handler doesn't create `Request`
        // entities). Unioned into the subgraph side of check 2 below so
        // the two sides model the same superset. See
        // `fetchMarketplaceOffChainRequestIds` for the rationale.
        fetchMarketplaceOffChainRequestIds(
          marketplaceUrl,
          windowStartSec,
          windowEndSec,
          `${key}:marketplace-offchain`
        ),
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
        // Scored rows filtered to the on-chain sources — `mech_onchain`
        // (live poller) + `ipfs_historical` (data-lake backfill of past
        // on-chain events). This is the population the marketplace
        // subgraph's `Request` collection also covers (its indexer only
        // fires on on-chain Request events), so filtering here makes the
        // subgraph-vs-analytics comparison symmetric at the API
        // boundary rather than by incidental drop-out downstream. Off-
        // chain rows (`mech_offchain`) don't appear in the subgraph's
        // `Request` collection at all — they're separately fetched via
        // `fetchMarketplaceOffChainRequestIds` for observability only.
        // The API is defined by `SourceLabel` in mech-analytics
        // `etl/api/routes/data.py` (PR #28); typos return 422.
        fetchScoredRows(chainId, windowStartSec, windowEndSec, `${key}:scored-rows`, {
          source: ['mech_onchain', 'ipfs_historical'],
        }),
        fetchUnscoredRows(chainId, windowStartSec, windowEndSec, `${key}:unscored-rows`),
        fetchAgentAggregate(chainId, agentId),
      ]);
    emit(`  marketplace requests in window (QMR-usable): ${marketplace.rows.length}`);
    emit(
      `    (skipped: missing sender/ts=${marketplace.skippedMissingSenderOrTs}, ` +
        `missing title only=${marketplace.skippedMissingTitleOnly}, ` +
        `after window end=${marketplace.skippedAfterWindowEnd}` +
        `${marketplace.truncated ? ', TRUNCATED at subgraph page cap' : ''})`
    );
    emit(
      `  marketplace rows with request_id (row-parity feed): ${marketplace.withRequestId.length}`
    );
    emit(
      `  marketplace off-chain request_ids (from ${marketplaceOffChain.entitiesFetched} ` +
        `MarketplaceDeliveryWithSignatures entities): ${marketplaceOffChain.withRequestId.length}` +
        `${marketplaceOffChain.truncated ? ' (TRUNCATED at subgraph page cap)' : ''}`
    );
    emit(
      `    (delivery-entity skips: missing sender/ts=${marketplaceOffChain.skippedMissingSenderOrTs}, ` +
        `empty requestIds=${marketplaceOffChain.skippedEmptyRequestIds}, ` +
        `after window end=${marketplaceOffChain.skippedAfterWindowEnd}, ` +
        `unparseable id=${marketplaceOffChain.skippedUnparseableId})`
    );
    emit(
      `  daily-stat rows: ${dailyStats.stats.length}` +
        `${dailyStats.truncated ? ' (TRUNCATED at subgraph page cap)' : ''}`
    );
    emit(
      `  scored rows in window (source=mech_onchain,ipfs_historical): ` +
        `${scoredRows.rows.length}` +
        `${scoredRows.truncated ? ' (TRUNCATED at page cap)' : ''}`
    );
    // Composition of the scored feed by predict-api ingest source
    // (mech-analytics PR #28). Live-poller rows are `mech_onchain`;
    // data-lake backfill is `ipfs_historical`. Rows with `source=null`
    // are pre-013 tail on the mech-analytics side (the source-backfill
    // hasn't caught up yet — see mech-analytics
    // `scripts/backfill_per_request_scores_source.py`). Operators watch
    // the null count trend to zero as the backfill completes.
    const sourceCounts = { mech_onchain: 0, ipfs_historical: 0, null: 0 };
    for (const row of scoredRows.rows) {
      const label = row.source ?? 'null';
      sourceCounts[label] = (sourceCounts[label] ?? 0) + 1;
    }
    emit(
      `    (by source: mech_onchain=${sourceCounts.mech_onchain}, ` +
        `ipfs_historical=${sourceCounts.ipfs_historical}, ` +
        `null=${sourceCounts.null})`
    );
    emit(
      `  unscored (shell) rows in window: ${unscoredRows.rows.length}` +
        `${unscoredRows.truncated ? ' (TRUNCATED at page cap)' : ''}`
    );

    const { counts, usable: usableAnalyticsRows } = classifyAnalyticsRows(scoredRows.rows);

    // Analytics-side feed for check 2 (row parity, "displayable rows"
    // definition) is scored-rows only. Scored rows have
    // `tool NOT NULL AND delivered_at NOT NULL` by construction, so
    // they are exactly the delivered + parseable population that the
    // predict page renders. Unscored rows are the analytics analogue
    // of subgraph rows without a parsed title — they drop symmetrically
    // on both sides via the subgraph WHERE clause and the scored-only
    // analytics feed here. See fetchUnscoredRows and
    // fetchMarketplaceRequests for the full rationale.
    //
    // request_id is normalised via normaliseRequestId so the id-based
    // match is format-agnostic. The analytics API mixes hex and decimal
    // strings for the same underlying uint256 (marketplace-era rows are
    // decimal, pre-marketplace backfill is hex); the subgraph is always
    // hex; both get collapsed to decimal.
    //
    // Dedup on the normalised (requester, request_id) key: verified 2026-08
    // that mech-analytics's `per_request_scores` stores some request_ids
    // as hex and some as decimal for the SAME on-chain uint256 (predict-
    // api-era backfill vs marketplace-era live writes, plus resolution
    // sweep re-serves the same row on every touch). Both encodings appear
    // in the same /v1/data/scored-rows page. Without a Map-based dedup,
    // `diffRowSets` (a multiset diff) counts hex and decimal as two
    // separate rows on the analytics side against one subgraph row →
    // `extraInAnalytics` inflates by the duplicate count.
    //
    // predict-api PR #178 canonicalises `request_id` at both writers
    // and ships migration 013 to collapse the ~2,714 existing decimal
    // duplicates on chain 100. Once that merges and the migration runs
    // (and mech-analytics's own canonicaliser script re-writes the
    // per_request_scores tail), the dedup below becomes structurally
    // redundant. Keeping it as a regression guard: if a future writer
    // path lands a row before predict-api canonicalises, the safety net
    // still fires here. Removing it needs coordination across the two
    // repos and a proof that the tail is clean.
    // Symmetric with the subgraph WHERE clause: analytics scored rows
    // without a non-empty question_title are NOT displayable (the
    // predict page can't render a prediction card without a title),
    // so they must be excluded here to match the subgraph filter.
    // Predict-api's regex title extraction can return None on prompts
    // it can't parse, which lands in scored-rows as question_title=null
    // when the tool otherwise ran successfully. Those rows would show
    // up as "extra in analytics" without this guard.
    const buildAnalyticsRowParityEntry = (row) => {
      if (!row.requester) return null;
      const title = row.question_title;
      if (typeof title !== 'string' || title.length === 0) return null;
      const normalisedId = normaliseRequestId(row.request_id);
      if (!normalisedId) return null;
      return {
        requester: row.requester.toLowerCase(),
        row: { ...row, request_id: normalisedId },
      };
    };
    const analyticsScoredForCheck2Raw = scoredRows.rows
      .map(buildAnalyticsRowParityEntry)
      .filter(Boolean);
    const analyticsScoredForCheck2Map = new Map();
    for (const entry of analyticsScoredForCheck2Raw) {
      const key = `${entry.requester}|${entry.row.request_id}`;
      if (!analyticsScoredForCheck2Map.has(key)) {
        analyticsScoredForCheck2Map.set(key, entry);
      }
    }
    const analyticsScoredForCheck2 = [...analyticsScoredForCheck2Map.values()];
    const analyticsScoredRawCount = analyticsScoredForCheck2Raw.length;
    const analyticsScoredUniqueCount = analyticsScoredForCheck2.length;
    const analyticsScoredDuplicatesCollapsed = analyticsScoredRawCount - analyticsScoredUniqueCount;
    // Observability counters — NOT fed into row_parity. See
    // fetchUnscoredRows / fetchMarketplaceOffChainRequestIds header
    // comments for why.
    const analyticsUnscoredCount = unscoredRows.rows.length;
    const subgraphOffChainCount = marketplaceOffChain.withRequestId.length;

    // ---- Check 1: open-market count parity --------------------------------
    section(`${key} — check 1: open-market count parity`);
    const subgraphOpen = computeSubgraphOpenCount(marketplace.rows, dailyStats.stats);
    // Analytics side runs the SAME QMR + dailyStats consumption pipeline
    // the consumer runs post-swap. Feeds raw scoredRows.rows (not the
    // usable subset) so computeAnalyticsOpenCount can apply the
    // consumer's filter order exactly: dedup → window/ts → invalid →
    // requester/title → ingest. See mech-analytics.ts:171-197.
    const analyticsOpen = computeAnalyticsOpenCount(
      scoredRows.rows,
      dailyStats.stats,
      windowStartSec
    );
    emit(
      `  subgraph feed: ${marketplace.rows.length} requests, ` +
        `${subgraphOpen.consumed} consumed by settlement matching → open=${subgraphOpen.open}`
    );
    emit(
      `  analytics feed: ${analyticsOpen.ingested} rows ingested ` +
        `(${analyticsOpen.skippedInvalid} invalid, ${analyticsOpen.skippedDuplicate} duplicate, ` +
        `${analyticsOpen.skippedOutOfWindow} out-of-window, ${analyticsOpen.skippedMissingKey} missing-key skipped), ` +
        `${analyticsOpen.consumed} consumed by settlement matching → open=${analyticsOpen.open}`
    );
    emit('  raw scored-rows breakdown (informational, pre-dedup, previously gated (a)):');
    emit(`    (a) raw pending + market_id: ${counts.raw_pending_with_market}`);
    emit(`    (b) raw invalid:             ${counts.raw_invalid}`);
    emit(`    (c) raw no market_id:        ${counts.raw_no_market_id}`);
    emit(`        raw resolved:            ${counts.raw_resolved}`);
    emit(`        raw missing key skipped: ${counts.raw_skipped_missing_key}`);

    const check1Truncated = marketplace.truncated || dailyStats.truncated || scoredRows.truncated;
    // Subgraph raw row count is the pre-filter count `fetchMarketplaceRequests`
    // observed BEFORE dropping missing-sender/title/ts rows and post-windowEnd
    // rows. Mirrors `analyticsRawRowCount = scoredRows.rows.length` (also
    // pre-filter, in that case pre the analytics-side ts/dedup/invalid gate
    // that runs inside `computeAnalyticsOpenCount`).
    const subgraphRawRowCount =
      marketplace.rows.length + marketplace.skippedMissingKey + marketplace.skippedAfterWindowEnd;
    const { status: check1Status, reason: check1Reason } = resolveCheck1Status({
      subgraphOpen: subgraphOpen.open,
      analyticsOpen: analyticsOpen.open,
      analyticsIngested: analyticsOpen.ingested,
      analyticsRawRowCount: scoredRows.rows.length,
      subgraphRowCount: marketplace.rows.length,
      subgraphRawRowCount,
      // Only the schema-regression signal (sender.id or blockTimestamp
      // missing) feeds the attrition guard; title-only drops are the
      // subgraph-side analogue of predict-api shell rows and are
      // handled via check 2's request-id parity path against
      // /v1/data/unscored-rows.
      subgraphSkippedMissingKey: marketplace.skippedMissingSenderOrTs,
      subgraphSkippedAfterWindowEnd: marketplace.skippedAfterWindowEnd,
      analyticsSkippedOutOfWindow: analyticsOpen.skippedOutOfWindow,
      analyticsSkippedMissingKey: analyticsOpen.skippedMissingKey,
      analyticsSkippedInvalid: analyticsOpen.skippedInvalid,
      truncated: check1Truncated,
    });
    if (check1Reason === 'no-rows-either-side') {
      emit('  VACUOUS: no rows on either side in the window.');
    } else if (check1Reason === 'analytics-ingested-zero') {
      emit(
        `  GAP: analytics ingested 0 rows from a raw feed of ${scoredRows.rows.length} ` +
          `(${analyticsOpen.skippedInvalid} invalid, ${analyticsOpen.skippedDuplicate} duplicate, ` +
          `${analyticsOpen.skippedOutOfWindow} out-of-window, ${analyticsOpen.skippedMissingKey} missing-key). ` +
          'Cannot gate an open count computed on zero ingested rows.'
      );
    } else if (check1Reason === 'analytics-attrition-majority') {
      const analyticsAttrition =
        analyticsOpen.skippedOutOfWindow +
        analyticsOpen.skippedMissingKey +
        analyticsOpen.skippedInvalid;
      emit(
        `  GAP: analytics dropped ${analyticsAttrition}/${scoredRows.rows.length} rows ` +
          `via out-of-window (${analyticsOpen.skippedOutOfWindow}), missing-key ` +
          `(${analyticsOpen.skippedMissingKey}), and invalid (${analyticsOpen.skippedInvalid}) ` +
          `buckets (> ${SKIP_RATIO_THRESHOLD_PCT}% of the raw feed). ` +
          'Suggests upstream contract drift (requested_at format, requester/title schema, ' +
          'or predict-api resolution classification), not a real match.'
      );
    } else if (check1Reason === 'subgraph-ingested-zero') {
      emit(
        `  GAP: subgraph ingested 0 rows from a raw feed of ${subgraphRawRowCount} ` +
          `(${marketplace.skippedMissingSenderOrTs} missing sender/ts, ` +
          `${marketplace.skippedMissingTitleOnly} missing title only, ` +
          `${marketplace.skippedAfterWindowEnd} past window end). ` +
          'Cannot gate an open count when the subgraph side dropped every row.'
      );
    } else if (check1Reason === 'subgraph-attrition-majority') {
      const subgraphAttrition =
        marketplace.skippedMissingSenderOrTs + marketplace.skippedAfterWindowEnd;
      emit(
        `  GAP: subgraph dropped ${subgraphAttrition}/${subgraphRawRowCount} rows ` +
          `via missing-sender/ts (${marketplace.skippedMissingSenderOrTs}) and past-window-end ` +
          `(${marketplace.skippedAfterWindowEnd}) buckets ` +
          `(> ${SKIP_RATIO_THRESHOLD_PCT}% of the raw feed). ` +
          'Suggests a subgraph schema regression (sender.id or blockTimestamp going missing ' +
          'on most entities), not a real match. Title-only drops ' +
          `(${marketplace.skippedMissingTitleOnly}) are excluded — those are shell-row equivalents.`
      );
    } else if (check1Reason === 'exact-match') {
      emit(`  PASS: open-market counts match exactly (${subgraphOpen.open}).`);
    } else if (check1Reason === 'match-but-truncated') {
      emit(
        `  MATCH on truncated data (${subgraphOpen.open}) — treating as a data gap, not a pass.`
      );
    } else if (check1Reason === 'mismatch-but-truncated') {
      emit(
        `  GAP: counts differ (subgraph=${subgraphOpen.open}, analytics=${analyticsOpen.open}) but a fetch was truncated.`
      );
    } else {
      emit(
        `  DIVERGENCE: subgraph open=${subgraphOpen.open} vs analytics open=${analyticsOpen.open}.`
      );
    }
    record({
      check: 'open_market_count',
      platform: key,
      status: check1Status,
      status_reason: check1Reason,
      subgraph_open: subgraphOpen.open,
      subgraph_consumed: subgraphOpen.consumed,
      analytics_open: analyticsOpen.open,
      analytics_consumed: analyticsOpen.consumed,
      analytics_ingested: analyticsOpen.ingested,
      analytics_invalid_skipped: analyticsOpen.skippedInvalid,
      analytics_duplicate_skipped: analyticsOpen.skippedDuplicate,
      analytics_out_of_window_skipped: analyticsOpen.skippedOutOfWindow,
      analytics_missing_key_skipped: analyticsOpen.skippedMissingKey,
      analytics_row_buckets: counts,
      truncated: check1Truncated,
    });

    // ---- Check 2: row parity ("displayable rows") ------------------------
    section(`${key} — check 2: row parity (displayable rows)`);
    // Population under comparison: rows a user would see rendered on
    // the predict page as a completed prediction. Symmetrically
    // filtered on both sides:
    //   * subgraph side: `isDelivered: true AND
    //     parsedRequest.questionTitle IS NOT NULL` (WHERE clause in
    //     fetchMarketplaceRequests). `marketplace.withRequestId` is
    //     exactly that set, additionally gated on a parseable
    //     `request_id`.
    //   * analytics side: `/v1/data/scored-rows` only. Scored rows
    //     have `tool NOT NULL AND delivered_at NOT NULL` by
    //     construction, so they are the delivered + parseable set.
    //
    // Off-chain requests and unscored/shell rows drop symmetrically
    // and DO NOT feed row_parity. Their counts are surfaced in the
    // artifact as `subgraph_off_chain_count` / `analytics_unscored_count`
    // for observability only. See header comments on
    // fetchMarketplaceOffChainRequestIds and fetchUnscoredRows.
    const subgraphDeliveredParseableRows = marketplace.withRequestId;
    const rowDiff = diffRowSets(subgraphDeliveredParseableRows, analyticsScoredForCheck2);
    emit(
      `  subgraph rows (delivered + parseable): ${subgraphDeliveredParseableRows.length}, ` +
        `analytics rows (scored, post-dedup): ${analyticsScoredUniqueCount} ` +
        `(raw ${analyticsScoredRawCount}, collapsed ${analyticsScoredDuplicatesCollapsed} duplicate id(s))`
    );
    emit(
      `  observability (NOT in row_parity): subgraph off-chain=${subgraphOffChainCount}, ` +
        `analytics unscored=${analyticsUnscoredCount}`
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

    // Off-chain / unscored fetches are observability-only for
    // row_parity — their truncation cannot affect the
    // displayable-rows comparison, so intentionally excluded from
    // check2Truncated.
    const check2Truncated = marketplace.truncated || scoredRows.truncated;
    const { status: check2Status, reason: check2Reason } = resolveCheck2Status({
      subgraphRowCount: subgraphDeliveredParseableRows.length,
      analyticsRowCount: analyticsScoredForCheck2.length,
      missingInAnalytics: rowDiff.missingInAnalytics,
      extraInAnalytics: rowDiff.extraInAnalytics,
      truncated: check2Truncated,
    });
    if (check2Reason === 'no-rows-either-side') {
      emit('  VACUOUS: no rows on either side in the window.');
    } else if (check2Reason === 'exact-match') {
      emit('  PASS: row sets match exactly.');
    } else if (check2Reason === 'match-but-truncated') {
      emit('  MATCH on truncated data — treating as a data gap, not a pass.');
    } else if (check2Reason === 'mismatch-but-truncated') {
      emit('  GAP: row sets differ but a fetch was truncated — rerun with a smaller window.');
    } else {
      emit('  DIVERGENCE: row sets differ.');
    }
    record({
      check: 'row_parity',
      platform: key,
      status: check2Status,
      status_reason: check2Reason,
      // "Displayable rows" definition: subgraph delivered + parseable
      // vs analytics scored (post-dedup). Off-chain and unscored
      // counts are exposed as observability but do NOT feed the diff.
      subgraph_delivered_parseable_count: subgraphDeliveredParseableRows.length,
      analytics_scored_raw_count: analyticsScoredRawCount,
      analytics_scored_unique_count: analyticsScoredUniqueCount,
      analytics_scored_duplicates_collapsed: analyticsScoredDuplicatesCollapsed,
      // Composition of the analytics scored feed by predict-api ingest
      // source (mech-analytics PR #28). `null` bucket tracks the pre-013
      // tail — should trend to zero after
      // `backfill_per_request_scores_source` completes.
      analytics_scored_by_source: sourceCounts,
      subgraph_off_chain_count: subgraphOffChainCount,
      analytics_unscored_count: analyticsUnscoredCount,
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
  const decision = decideVerdict(checkResults);
  emit(`  checks run:       ${checkResults.length}`);
  emit(`  passed:           ${decision.counts.pass}`);
  emit(`  diverged:         ${decision.counts.divergence}`);
  emit(`  data gaps:        ${decision.counts.gap}`);
  emit(`  vacuous:          ${decision.counts.vacuous}`);
  emit('');
  emit(decision.message);
  exitCode = decision.exitCode;
  verdict = decision.verdict;
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
