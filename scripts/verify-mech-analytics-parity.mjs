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
//   mech-analytics's last-4-days count of rows with
//   resolution_status='pending' AND market_id present (via
//   /v1/data/scored-rows) must equal the title-normalised open-market
//   count computed the way roi-distribution.ts computes it today:
//   requests from the marketplace subgraph's incremental feed, minus
//   the ones consumed by settlement (normalizeTitle matching against
//   dailyProfitStatistics.profitParticipants). The mech-analytics side
//   is broken out into (a) pending+market_id, (b) invalid, (c) no
//   market_id — the consumer counts only (a); (b) and (c) are reported
//   so a naive resolved=false count overshooting is visible.
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
//   subgraph's Sender.totalLegacyRequests + totalMarketplaceRequests
//   summed over the same registered Safes (from the /instances
//   endpoint). Compared with a small absolute tolerance — see
//   COUNT_TOLERANCE_DEFAULT below for why exact equality is not the
//   bar on this one check.
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
// Subgraph URLs embed API keys — they are secrets. This script never
// prints them (presence is logged as yes/no; HTTP errors carry status
// codes only, never the URL).

import { execSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';

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

const DAY_SECONDS = 86400;
const SUBGRAPH_PAGE = 1000;
// graph-node rejects skip > 5000; a full page at that offset means the
// fetch is truncated and the affected checks degrade to a data gap.
const SUBGRAPH_MAX_SKIP = 5000;
const SCORED_ROWS_PAGE = 1000;
const SCORED_ROWS_MAX_PAGES = 500;
const SENDER_ID_CHUNK = 100;
const SAMPLE_LIMIT = 10;

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
    'lag-buffer-minutes': { type: 'string' },
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
      '  1. open-market count parity: scored-rows pending+market_id count vs the\n' +
      '     normalizeTitle-based open count over the marketplace-subgraph feed\n' +
      '  2. scored-rows row parity: (requester, timestamp, title) row sets match\n' +
      '  3. senderTotal parity: agent_aggregates.n_mech_requests vs subgraph\n' +
      '     Sender.totalLegacyRequests + totalMarketplaceRequests per Safe\n' +
      'Flag-on/off openRequestCount comparison is the staging parallel-run\n' +
      'check done by ops on the deployed site — it is NOT run here.\n' +
      '\n' +
      'Options:\n' +
      '  --mech-analytics-url <url>   mech-analytics base URL (or MECH_ANALYTICS_URL env)\n' +
      `  --window-days <n>            checks 1+2 window (default ${WINDOW_DAYS_DEFAULT})\n` +
      `  --lag-buffer-minutes <n>     near-edge trim for scoring lag (default ${LAG_BUFFER_MINUTES_DEFAULT})\n` +
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

const parsePositiveInt = (raw, label, fallback) => {
  if (raw == null) return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value <= 0) {
    console.error(`--${label} must be a positive integer, got "${raw}"`);
    process.exit(1);
  }
  return value;
};

const parseNonNegativeInt = (raw, label, fallback) => {
  if (raw == null) return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < 0) {
    console.error(`--${label} must be a non-negative integer, got "${raw}"`);
    process.exit(1);
  }
  return value;
};

const outputDir = args['output-dir'] ? path.resolve(args['output-dir']) : null;
const windowDays = parsePositiveInt(args['window-days'], 'window-days', WINDOW_DAYS_DEFAULT);
const lagBufferMinutes = parseNonNegativeInt(
  args['lag-buffer-minutes'],
  'lag-buffer-minutes',
  LAG_BUFFER_MINUTES_DEFAULT
);
const countTolerance = parseNonNegativeInt(
  args['count-tolerance'],
  'count-tolerance',
  COUNT_TOLERANCE_DEFAULT
);
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

// Subgraph URLs embed API keys; never let one leak through an error
// message or stack trace into stdout or the artifacts.
const scrub = (text) =>
  String(text)
    .replace(/https?:\/\/\S+/g, '<redacted-url>')
    .replace(/[0-9a-fA-F]{16,}/g, '<redacted>');

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
  window_days: windowDays,
  lag_buffer_minutes: lagBufferMinutes,
  count_tolerance_abs: countTolerance,
};

emit('=== Run metadata ===');
emit(`  run_at (UTC):         ${metadata.run_at_utc}`);
emit(`  script git SHA:       ${metadata.script_git_sha}`);
emit(`  mech-analytics URL:   ${metadata.mech_analytics_url}`);
emit(`  window (days):        ${metadata.window_days}`);
emit(`  lag buffer (min):     ${metadata.lag_buffer_minutes}`);
emit(`  count tolerance (±):  ${metadata.count_tolerance_abs} (check 3 only)`);
for (const name of REQUIRED_ENV.slice(1)) {
  // Presence only — the URLs embed API keys.
  emit(`  ${name}: set`);
}

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

// Copied verbatim from common-util/api/predict/roi-distribution.ts:402
// (normalizeTitle). Node can't import the site's TypeScript, so the one
// pure helper the matching depends on is reimplemented here. DRIFT
// WARNING: if roi-distribution.ts changes normalizeTitle, this copy
// must change with it or check 1's matching diverges from the site's.
const normalizeTitle = (title) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 100);

const isoFromUnixSec = (sec) => new Date(sec * 1000).toISOString();

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
    usable.push({ requester, ts, title });
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
// only needs the registered Safes' counters.
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
          totalMarketplaceRequests
        }
      }`,
      label
    );
    for (const sender of data?.senders ?? []) {
      totals.set(
        sender.id.toLowerCase(),
        Number(sender.totalLegacyRequests) + Number(sender.totalMarketplaceRequests)
      );
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
// subgraph's strict blockTimestamp_gt boundary.
const fetchScoredRows = async (chainId, windowStartSec, windowEndSec, label) => {
  const rows = [];
  let truncated = false;
  const url = new URL(`${mechAnalyticsBase}/v1/data/scored-rows`);
  url.searchParams.set('chain_id', String(chainId));
  url.searchParams.set('since', isoFromUnixSec(windowStartSec + 1));
  url.searchParams.set('until', isoFromUnixSec(windowEndSec));
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
// Check 1 — open-market count parity
// ---------------------------------------------------------------------------

// Reproduces roi-distribution.ts's open-market classification over the
// window: build the QMR-shaped map title→agent→count from the
// marketplace feed, then consume settled entries via profitParticipants
// titles (exact key first, then normalizeTitle — mirrors
// roi-distribution.ts:581-591 including per-agent consumption).
const computeSubgraphOpenCount = (requests, dailyStats, participantTitleField) => {
  const qmr = new Map(); // title -> Map(agent -> count)
  const normalizedIndex = new Map(); // normalizeTitle(title) -> title
  for (const { requester, title } of requests) {
    if (!qmr.has(title)) {
      qmr.set(title, new Map());
      normalizedIndex.set(normalizeTitle(title), title);
    }
    const agents = qmr.get(title);
    agents.set(requester, (agents.get(requester) ?? 0) + 1);
  }

  let consumed = 0;
  for (const stat of dailyStats) {
    const agentId = stat.traderAgent?.id?.toLowerCase();
    if (!agentId) continue;
    for (const participant of stat.profitParticipants ?? []) {
      const title =
        participantTitleField === 'question' ? participant.question : participant.metadata?.title;
      if (!title) continue;
      const matchedKey = qmr.has(title)
        ? title
        : (normalizedIndex.get(normalizeTitle(title)) ?? null);
      if (!matchedKey) continue;
      const agents = qmr.get(matchedKey);
      const count = agents.get(agentId) ?? 0;
      if (count > 0) {
        consumed += count;
        agents.delete(agentId);
      }
    }
  }

  let open = 0;
  for (const agents of qmr.values()) {
    for (const count of agents.values()) open += count;
  }
  return { open, consumed };
};

// Breaks the mech-analytics window rows out the way §12 Q4 prescribes.
// Only (a) pending+market_id is what the consumer's flag-on path counts
// (mech-analytics.ts skips invalid rows and rows without requester or
// title before they reach QMR); (b) and (c) are reported so a naive
// resolved=false count overshooting is visible in the artifact.
const classifyAnalyticsRows = (rows) => {
  const counts = {
    pending_with_market: 0, // (a) — the gated number
    invalid: 0, // (b)
    no_market_id: 0, // (c) — non-invalid rows without a market
    resolved: 0,
    skipped_missing_key: 0,
  };
  const usable = [];
  for (const row of rows) {
    const requester = row.requester?.toLowerCase();
    const title = row.question_title;
    if (!requester || !title) {
      counts.skipped_missing_key += 1;
      continue;
    }
    usable.push({ requester, row });
    if (row.resolution_status === 'invalid') {
      counts.invalid += 1;
    } else if (row.market_id == null) {
      counts.no_market_id += 1;
    } else if (row.resolution_status === 'pending') {
      counts.pending_with_market += 1;
    } else {
      counts.resolved += 1;
    }
  }
  return { counts, usable };
};

// ---------------------------------------------------------------------------
// Check 2 — row parity
// ---------------------------------------------------------------------------

// Multiset diff on (requester, unix timestamp, normalizeTitle(title)).
// normalizeTitle on both sides matches the consumer's own matching
// discipline and absorbs title truncation differences between the
// subgraph's parsedRequest and the lake's question_title.
const diffRowSets = (subgraphRows, analyticsRows) => {
  const keyOf = (requester, ts, title) => `${requester}|${ts}|${normalizeTitle(title)}`;
  const tally = new Map();
  for (const { requester, ts, title } of subgraphRows) {
    const key = keyOf(requester, ts, title);
    const entry = tally.get(key) ?? { subgraph: 0, analytics: 0 };
    entry.subgraph += 1;
    tally.set(key, entry);
  }
  for (const { requester, row } of analyticsRows) {
    const ts = Math.floor(Date.parse(row.requested_at) / 1000);
    if (!Number.isFinite(ts)) continue;
    const key = keyOf(requester, ts, row.question_title);
    const entry = tally.get(key) ?? { subgraph: 0, analytics: 0 };
    entry.analytics += 1;
    tally.set(key, entry);
  }

  let missingInAnalytics = 0;
  let extraInAnalytics = 0;
  const missingSamples = [];
  const extraSamples = [];
  for (const [key, { subgraph, analytics }] of tally) {
    if (subgraph > analytics) {
      missingInAnalytics += subgraph - analytics;
      if (missingSamples.length < SAMPLE_LIMIT) missingSamples.push(key);
    } else if (analytics > subgraph) {
      extraInAnalytics += analytics - subgraph;
      if (extraSamples.length < SAMPLE_LIMIT) extraSamples.push(key);
    }
  }
  return { missingInAnalytics, extraInAnalytics, missingSamples, extraSamples };
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
  const nowSec = Math.floor(Date.now() / 1000);
  const windowEndSec = nowSec - lagBufferMinutes * 60;
  const windowStartSec = nowSec - windowDays * DAY_SECONDS;
  if (windowEndSec <= windowStartSec) {
    throw new Error('lag buffer consumes the whole window — lower --lag-buffer-minutes');
  }
  metadata.window_start_utc = isoFromUnixSec(windowStartSec);
  metadata.window_end_utc = isoFromUnixSec(windowEndSec);
  emit(`  window:               (${metadata.window_start_utc}, ${metadata.window_end_utc}]`);

  for (const platform of PLATFORMS) {
    const { key, chainId, agentId } = platform;
    const marketplaceUrl = process.env[platform.marketplaceUrlEnv];
    const dailyStatsUrl = process.env[platform.dailyStatsUrlEnv];

    section(`${key} (chain ${chainId}, agent ${agentId}) — data pulls`);
    const [marketplace, dailyStats, scoredRows, aggregate] = await Promise.all([
      fetchMarketplaceRequests(marketplaceUrl, windowStartSec, windowEndSec, `${key}:marketplace`),
      fetchDailyStats(
        dailyStatsUrl,
        Math.floor(windowStartSec / DAY_SECONDS) * DAY_SECONDS,
        nowSec,
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
    const { open, consumed } = computeSubgraphOpenCount(
      marketplace.rows,
      dailyStats.stats,
      platform.participantTitleField
    );
    emit(`  subgraph feed: ${marketplace.rows.length} requests, ${consumed} consumed by`);
    emit(`    settlement matching (normalizeTitle vs profitParticipants) → open=${open}`);
    emit('  mech-analytics breakdown (consumer counts only (a)):');
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
    } else if (open === counts.pending_with_market) {
      // Exact equality — counts get no tolerance (unlike check 3, both
      // sides here describe the same window of the same requests).
      check1Status = check1Truncated ? 'gap' : 'pass';
      emit(
        check1Truncated
          ? `  MATCH on truncated data (${open}) — treating as a data gap, not a pass.`
          : `  PASS: open-market counts match exactly (${open}).`
      );
    } else if (check1Truncated) {
      // A truncated fetch cannot prove a divergence — the missing rows
      // could account for the whole delta.
      check1Status = 'gap';
      emit(
        `  GAP: counts differ (subgraph=${open}, analytics=${counts.pending_with_market}) but a fetch was truncated.`
      );
    } else {
      check1Status = 'divergence';
      emit(
        `  DIVERGENCE: subgraph open=${open} vs analytics pending+market_id=${counts.pending_with_market}.`
      );
    }
    record({
      check: 'open_market_count',
      platform: key,
      status: check1Status,
      subgraph_open: open,
      subgraph_consumed: consumed,
      analytics: counts,
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
      emit(`  subgraph Σ(totalLegacy+totalMarketplace): ${subgraphTotal}`);
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
  process.exit(exitCode);
}
