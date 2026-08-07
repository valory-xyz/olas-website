// Copyright 2026 Valory AG
// SPDX-License-Identifier: Apache-2.0
//
// Pure helpers extracted from verify-mech-analytics-parity.mjs so they can be
// unit-tested without firing the script's top-level side effects (env-var
// validation, network I/O, process.exit). Imported by both the script and
// verify-mech-analytics-parity.test.mjs.
//
// No I/O, no exit, no global state — same input → same output.

/* eslint-disable no-undef -- standalone module: uses JS built-in globals */

// ---------------------------------------------------------------------------
// Title normalisation — copied verbatim from
// common-util/api/predict/roi-distribution.ts:402. Node can't import the
// site's TypeScript. If roi-distribution.ts changes normalizeTitle, this copy
// must change with it or check 1's matching diverges from the site's.
// ---------------------------------------------------------------------------

export const normalizeTitle = (title) =>
  String(title)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 100);

// ---------------------------------------------------------------------------
// Simple pure utilities
// ---------------------------------------------------------------------------

export const isoFromUnixSec = (sec) => new Date(sec * 1000).toISOString();

// Subgraph URLs embed API keys; never let one leak through an error
// message or stack trace into stdout or the artifacts.
export const scrub = (text) =>
  String(text)
    .replace(/https?:\/\/\S+/g, '<redacted-url>')
    .replace(/[0-9a-fA-F]{16,}/g, '<redacted>');

// Origin only: the artifact gets posted on the cutover PR, and a signed
// URL or ?token= query must never travel with it.
export const safeOrigin = (url) => {
  try {
    return new URL(url).origin;
  } catch {
    return '<invalid-url>';
  }
};

// ---------------------------------------------------------------------------
// Argument parsing
// ---------------------------------------------------------------------------

export const parsePositiveInt = (raw, label, fallback) => {
  if (raw == null) return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`--${label} must be a positive integer, got "${raw}"`);
  }
  return value;
};

export const parseNonNegativeInt = (raw, label, fallback) => {
  if (raw == null) return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`--${label} must be a non-negative integer, got "${raw}"`);
  }
  return value;
};

// Accepts ISO 8601 with a timezone offset ("Z" or "+HH:MM"). Rejects naive
// datetimes so the script never depends on the local timezone of whichever
// runner it fires on. Mirrors verify_migration_swap.py's _parse_args
// (mech-predict/scripts/verify_migration_swap.py:1199) so operators run
// both scripts the same way.
export const parseAwareIso = (raw, label) => {
  if (raw == null) return null;
  const normalized = String(raw).replace(/Z$/, '+00:00');
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`--${label} is not a valid ISO 8601 datetime: "${raw}"`);
  }
  // Naive datetimes ("2026-08-01T00:00:00") lack an offset and are
  // interpreted in the local zone. Reject them the same way
  // verify_migration_swap.py does (`--since / --until must include timezone`).
  if (!/[Zz]$|[+-]\d{2}:?\d{2}$/.test(String(raw).trim())) {
    throw new Error(`--${label} must include a timezone (Z or ±HH:MM), got "${raw}"`);
  }
  return date;
};

// ---------------------------------------------------------------------------
// Window computation
// ---------------------------------------------------------------------------

const DAY_SECONDS = 86400;

// Returns { windowStartSec, windowEndSec, source } where `source` is either
// 'explicit' (--since/--until provided) or 'trailing' (default trailing
// window). Rules mirror verify_migration_swap.py's _compute_window:
//   * --since and --until are all-or-nothing (both or neither)
//   * both must be timezone-aware (parseAwareIso enforces)
//   * --until must be strictly greater than --since
//   * when --since/--until are given, --window-days and --lag-buffer-minutes
//     no longer apply (the operator chose the window explicitly)
export const computeWindow = ({
  since,
  until,
  nowSec,
  windowDays,
  lagBufferMinutes,
}) => {
  const hasSince = since != null;
  const hasUntil = until != null;
  if (hasSince !== hasUntil) {
    throw new Error('--since and --until must be provided together');
  }
  if (hasSince && hasUntil) {
    const windowStartSec = Math.floor(since.getTime() / 1000);
    const windowEndSec = Math.floor(until.getTime() / 1000);
    if (windowEndSec <= windowStartSec) {
      throw new Error('--until must be strictly after --since');
    }
    return { windowStartSec, windowEndSec, source: 'explicit' };
  }
  const windowEndSec = nowSec - lagBufferMinutes * 60;
  const windowStartSec = nowSec - windowDays * DAY_SECONDS;
  if (windowEndSec <= windowStartSec) {
    throw new Error('lag buffer consumes the whole window — lower --lag-buffer-minutes');
  }
  return { windowStartSec, windowEndSec, source: 'trailing' };
};

// ---------------------------------------------------------------------------
// Check 1 — subgraph-side open-market count via QMR + dailyStats consumption
// ---------------------------------------------------------------------------

// Reproduces roi-distribution.ts's open-market classification over the
// window: build the QMR-shaped map title→agent→count from the marketplace
// feed, then consume settled entries via profitParticipants titles (exact
// key first, then normalizeTitle — mirrors roi-distribution.ts:581-591
// including per-agent consumption).
export const computeSubgraphOpenCount = (requests, dailyStats, participantTitleField) => {
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

// ---------------------------------------------------------------------------
// Check 1 — analytics-side classification and open-market computation
// ---------------------------------------------------------------------------

// Bucket the mech-analytics rows the way the artifact reports them. The
// counts are informational (they surface the shape of the raw data); the
// gated number is `open` from computeAnalyticsOpenCount below, not
// `pending_with_market` from here.
//
// The consumer's flag-on path (mech-analytics.ts::fetchMechRequestsFromAnalytics)
// does NOT filter on market_id — it filters only on invalid rows and
// missing requester/title. The old check 1 gated on `pending_with_market`
// (i.e. rows with market_id IS NOT NULL) which dropped ~99% of legitimate
// rows for chain-100 where the market_id column is populated for a small
// recent tail of the data only. That produced a fake divergence in prod
// (0 vs 1326) even though the consumer would have counted every row.
export const classifyAnalyticsRows = (rows) => {
  const counts = {
    pending_with_market: 0, // (a) — historical bucket, informational only
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

// Reproduces the consumer's post-swap open-market count for the analytics
// side. Mirrors mech-analytics.ts::fetchMechRequestsFromAnalytics filtering
// (invalid rows skipped, rows without requester/title skipped, everything
// else feeds the QMR by title) followed by roi-distribution.ts's settlement
// consumption via normalizeTitle-matched profitParticipants. The result is
// what the site would count as "still open" after processing the same
// scored-rows page it will use post-cutover.
//
// `usableRows` are the {requester, row} entries from classifyAnalyticsRows
// (already de-noised: no missing keys). Invalid rows are still present and
// are filtered here so classifyAnalyticsRows can also count them for the
// (b) bucket without double-work.
export const computeAnalyticsOpenCount = (usableRows, dailyStats, participantTitleField) => {
  const qmr = new Map(); // title -> Map(agent -> count)
  const normalizedIndex = new Map(); // normalizeTitle(title) -> title
  let ingested = 0;
  let skippedInvalid = 0;
  for (const { requester, row } of usableRows) {
    if (row.resolution_status === 'invalid') {
      skippedInvalid += 1;
      continue;
    }
    const title = row.question_title;
    if (!qmr.has(title)) {
      qmr.set(title, new Map());
      normalizedIndex.set(normalizeTitle(title), title);
    }
    const agents = qmr.get(title);
    agents.set(requester, (agents.get(requester) ?? 0) + 1);
    ingested += 1;
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
  return { open, consumed, ingested, skippedInvalid };
};

// ---------------------------------------------------------------------------
// Check 2 — row parity multiset diff
// ---------------------------------------------------------------------------

const SAMPLE_LIMIT = 10;

// Multiset diff. Preferred key is (requester, request_id) — the marketplace
// subgraph's Request.id is the same identifier the lake writes back as
// `request_id`, and the consumer's fetcher dedupes on it (common-util/api/
// predict/mech-analytics.ts). Fallback is (requester, unix ts,
// normalizeTitle(title)) for rows missing an id on either side; this
// fallback is only sound while ts equality holds — once live-writer rows
// land, requested_at (authorization time) can drift seconds-to-minutes from
// blockTimestamp, so any row that falls back and diverges is called out
// with a mode label so the operator can tell "real regression" from
// "expected drift".
export const diffRowSets = (subgraphRows, analyticsRows) => {
  const idKey = (requester, id) => `id|${requester}|${id}`;
  const tsKey = (requester, ts, title) => `ts|${requester}|${ts}|${normalizeTitle(title)}`;
  const tally = new Map();
  const modeById = new Map();

  const bump = (key, side, mode) => {
    const entry = tally.get(key) ?? { subgraph: 0, analytics: 0 };
    entry[side] += 1;
    tally.set(key, entry);
    modeById.set(key, mode);
  };

  for (const { requester, ts, title, requestId } of subgraphRows) {
    bump(
      requestId ? idKey(requester, requestId) : tsKey(requester, ts, title),
      'subgraph',
      requestId ? 'id' : 'ts'
    );
  }
  for (const { requester, row } of analyticsRows) {
    const rowId = typeof row.request_id === 'string' ? row.request_id.toLowerCase() : null;
    if (rowId) {
      bump(idKey(requester, rowId), 'analytics', 'id');
      continue;
    }
    const ts = Math.floor(Date.parse(row.requested_at) / 1000);
    if (!Number.isFinite(ts)) continue;
    bump(tsKey(requester, ts, row.question_title), 'analytics', 'ts');
  }

  let missingInAnalytics = 0;
  let extraInAnalytics = 0;
  let tsFallbackKeys = 0;
  const missingSamples = [];
  const extraSamples = [];
  for (const [key, { subgraph, analytics }] of tally) {
    if (modeById.get(key) === 'ts') tsFallbackKeys += 1;
    if (subgraph > analytics) {
      missingInAnalytics += subgraph - analytics;
      if (missingSamples.length < SAMPLE_LIMIT) missingSamples.push(key);
    } else if (analytics > subgraph) {
      extraInAnalytics += analytics - subgraph;
      if (extraSamples.length < SAMPLE_LIMIT) extraSamples.push(key);
    }
  }
  return { missingInAnalytics, extraInAnalytics, missingSamples, extraSamples, tsFallbackKeys };
};

// ---------------------------------------------------------------------------
// Check 3 — Sender counter selection
// ---------------------------------------------------------------------------

// Which subgraph Sender counter matches agent_aggregates.n_mech_requests.
//
// The marketplace subgraph increments the Sender counters like this
// (verified in autonolas-subgraph/subgraphs/marketplace/src/marketplace/
// mech-marketplace.ts):
//
//   handleMarketplaceRequest (on-chain path):
//     sender.totalMarketplaceRequests += 1
//     sender.totalLegacyRequests      += numRequests      ← ALSO bumped
//
//   handleMarketplaceDeliveryWithSignatures (off-chain path):
//     sender.totalOffChainRequests    += numDeliveries
//     sender.totalLegacyRequests      += numDeliveries    ← ALSO bumped
//
// So `totalLegacyRequests` is misnamed — it's the grand total of ALL
// requests (on-chain + off-chain), not just the legacy tail. The previous
// check summed `totalLegacyRequests + totalMarketplaceRequests`, which
// counts the on-chain path twice: once via the grand-total field and once
// via the marketplace-only field. That produced a chronic 2× divergence
// in prod (Gnosis 604,930 vs 302,465; Polygon 129,044 vs 64,519).
//
// The one field that matches `agent_aggregates.n_mech_requests` semantics
// (total requests seen for this Safe) is `totalLegacyRequests` alone.
// An equivalent non-overlapping split is `totalOffChainRequests +
// totalMarketplaceRequests`, but that's two subtractions from a fragile
// name and this comment would need to explain both — using the grand-total
// field directly keeps the mapping one-to-one.
export const pickSubgraphSenderTotal = (sender) => {
  if (!sender || sender.totalLegacyRequests == null) return null;
  return Number(sender.totalLegacyRequests);
};
