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
  // Anchor start to end (until = now - lag; since = until - days) so the
  // span is exactly `days`, matching verify_migration_swap.py:_compute_window
  // (mech-predict/scripts/verify_migration_swap.py:1286-1287). Anchoring
  // start to `now` and end to `now - lag` shortens the window by the lag.
  const windowEndSec = nowSec - lagBufferMinutes * 60;
  const windowStartSec = windowEndSec - windowDays * DAY_SECONDS;
  if (windowEndSec <= 0) {
    // lagBufferMinutes larger than nowSec — nonsensical clock, refuse
    // to compute a window rather than producing a negative windowEnd.
    throw new Error('lag buffer pushes window end to or before epoch — check --lag-buffer-minutes');
  }
  return { windowStartSec, windowEndSec, source: 'trailing' };
};

// ---------------------------------------------------------------------------
// Check 1 — shared QMR pipeline (single-source correctness)
// ---------------------------------------------------------------------------

// The QMR is keyed on normalizeTitle(title) directly rather than on the
// raw title with a secondary normalized-index lookup. Rationale:
// order-independence between the two verifier feeds. The subgraph feed
// arrives by blockTimestamp; the scored-rows feed by requested_at + cursor.
// If we kept a raw-title QMR with a normalizedIndex fallback (as this
// file did previously), a collision past the 100-char slice would
// resolve to a different raw key on each side — same logical data,
// different open count, false divergence. Keying on normalizeTitle(title)
// collapses the bucket before insertion so the tie-break is a no-op.
//
// Note this is a deliberate deviation from the consumer, not a mirror of
// it. roi-distribution.ts keeps separate raw-title buckets in `qmr` and
// only builds `normalizedQmrMap` for settlement lookup, so on a
// post-100-char collision the consumer keeps two buckets and drains one
// per matching settlement title. Merging into a single normalized bucket
// means the verifier consumes more on collision than the consumer would.
// That is the correct choice for a two-sided verifier (both sides collapse
// the same way, so the comparison is order-invariant), but it is not a
// literal reproduction of the consumer's QMR shape.
//
// Entries are `{ requester, title }`. Callers pre-filter (invalid,
// missing key, out-of-window, deduplicated) so the shared body never
// re-implements per-feed shape logic.
export const runQmrOpenCount = (entries, dailyStats) => {
  const qmr = new Map(); // normalizeTitle(title) -> Map(agent -> count)
  for (const { requester, title } of entries) {
    const key = normalizeTitle(title);
    if (!qmr.has(key)) qmr.set(key, new Map());
    const agents = qmr.get(key);
    agents.set(requester, (agents.get(requester) ?? 0) + 1);
  }

  let consumed = 0;
  for (const stat of dailyStats) {
    const agentId = stat.traderAgent?.id?.toLowerCase();
    if (!agentId) continue;
    for (const participant of stat.profitParticipants ?? []) {
      // Union with fallback matches roi-distribution.ts:573
      // (`p.question ?? p.metadata?.title`). The two subgraphs surface the
      // title in different fields (Omen: `question`, Polymarket:
      // `metadata.title`) and a market whose title lands in the other
      // field would otherwise fail to consume its QMR entry, overstating
      // `open` asymmetrically per platform.
      const title = participant.question ?? participant.metadata?.title;
      if (!title) continue;
      const key = normalizeTitle(title);
      const agents = qmr.get(key);
      if (!agents) continue;
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

// Subgraph-side adapter: build entries from marketplace-subgraph requests
// (already usable — `requester`/`title`/`ts` guards fire in the fetcher)
// and delegate to the shared pipeline. The consumer's `??` union
// (question ?? metadata.title) fires inside runQmrOpenCount, so no
// per-platform participant-title-field flag is needed here.
export const computeSubgraphOpenCount = (requests, dailyStats) => {
  const entries = requests.map(({ requester, title }) => ({ requester, title }));
  return runQmrOpenCount(entries, dailyStats);
};

// Shared usability extraction. Both computeAnalyticsOpenCount and
// classifyAnalyticsRows care whether a row has a lowercased requester
// and a non-empty question_title — those are the only fields the
// consumer requires. Returning `{ requester, title }` (nullable) rather
// than a boolean lets callers reuse the coerced values without a
// second normalisation step, and prevents the two functions from
// drifting on what "usable" means. Before this helper existed, both
// carried inline copies of the same filter and a schema tweak (a new
// falsy sentinel, say) would only reach whichever site the reviewer
// remembered to update.
export const extractRowUsability = (row) => {
  const requester = row.requester?.toLowerCase() ?? null;
  const title = row.question_title ?? null;
  const usable = Boolean(requester) && Boolean(title);
  return { requester, title, usable };
};

// Analytics-side adapter: mirrors the consumer's flag-on filtering in
// common-util/api/predict/mech-analytics.ts:171-197 exactly:
//
//   1. dedup on request_id (the API sends the same row again every time
//      its resolution updates — without dedup every update re-inflates
//      the analytics open count vs the subgraph, which counts each
//      request once)
//   2. window/ts validity gate (ts <= 0 || ts < windowStartSec) — done
//      BEFORE the invalid check so out-of-window invalid rows don't get
//      recorded as "ingested-invalid"
//   3. invalid rows are recorded (their id enters the ingested set so
//      later duplicates stay skipped) then skipped
//   4. missing requester/title are skipped
//   5. survivors enter QMR; their id is recorded to skip later duplicates
//
// Returns the shared `{ open, consumed }` plus analytics-side diagnostics
// (`ingested`, `skippedInvalid`, `skippedDuplicate`, `skippedOutOfWindow`,
// `skippedMissingKey`).
export const computeAnalyticsOpenCount = (rows, dailyStats, windowStartSec) => {
  const seenIds = new Set();
  const entries = [];
  let skippedDuplicate = 0;
  let skippedOutOfWindow = 0;
  let skippedInvalid = 0;
  let skippedMissingKey = 0;

  for (const row of rows) {
    const requestId = row.request_id ?? null;
    if (requestId != null && seenIds.has(requestId)) {
      skippedDuplicate += 1;
      continue;
    }
    const ts = Math.floor(Date.parse(row.requested_at) / 1000);
    if (!Number.isFinite(ts) || ts <= 0 || ts < windowStartSec) {
      skippedOutOfWindow += 1;
      continue;
    }
    if (row.resolution_status === 'invalid') {
      if (requestId != null) seenIds.add(requestId);
      skippedInvalid += 1;
      continue;
    }
    const { requester, title, usable } = extractRowUsability(row);
    if (!usable) {
      skippedMissingKey += 1;
      continue;
    }
    entries.push({ requester, title });
    if (requestId != null) seenIds.add(requestId);
  }

  const { open, consumed } = runQmrOpenCount(entries, dailyStats);
  return {
    open,
    consumed,
    ingested: entries.length,
    skippedInvalid,
    skippedDuplicate,
    skippedOutOfWindow,
    skippedMissingKey,
  };
};

// ---------------------------------------------------------------------------
// classifyAnalyticsRows — informational bucket breakdown for the artifact
// ---------------------------------------------------------------------------

// The counts are informational only. The gated number is `open` from
// computeAnalyticsOpenCount above. Retained so the artifact keeps
// reporting the (a)/(b)/(c) breakdown that documents which shape of raw
// data lives in per_request_scores.
//
// IMPORTANT — these counts are computed over RAW rows (no request_id
// dedup, no window/ts gate). computeAnalyticsOpenCount's
// `skippedInvalid`/`skippedDuplicate` counters count POST-dedup, which
// means the two `invalid` numbers can diverge on any window with
// resolution-sweep activity (per docs/mech-analytics-migration.md:79-84
// the API re-serves a row on every sweep touch, so a resolved-then-
// invalidated row lands in `skippedDuplicate` here and in
// `bucket_raw_invalid` in the artifact). The bucket keys are prefixed
// `raw_` in the returned object so the artifact reader sees the two
// populations aren't the same thing side-by-side.
//
// Check 1 and check 2 audit different row populations by design.
// `computeAnalyticsOpenCount` (check 1) dedups on `request_id` and
// drops invalid + out-of-window rows before building its QMR;
// `classifyAnalyticsRows.usable` (check 2's feed via `diffRowSets`)
// applies only the requester/title presence test — no dedup, no window
// gate, no invalid drop. Consequence: check 2 is a row-set diff, not a
// backstop for check 1's ingestion guards. A check-1 false pass caused
// by an attrition-guard miss will NOT be caught by check 2 (e.g. a
// missing-key storm shrinks `usable` on both sides symmetrically and
// check 2 still reports exact-match). This is why the attrition guards
// in `resolveCheck1Status` cover every non-duplicate bucket.
export const classifyAnalyticsRows = (rows) => {
  const counts = {
    raw_pending_with_market: 0, // (a) — historical bucket, informational only
    raw_invalid: 0, // (b), counted pre-dedup
    raw_no_market_id: 0, // (c) — non-invalid rows without a market
    raw_resolved: 0,
    raw_skipped_missing_key: 0,
  };
  // `usable` = rows with both requester and title. Used by check 2's
  // multiset diff (diffRowSets), which matches on (requester, request_id)
  // with a (requester, ts, title) fallback. Check 1's stricter filtering
  // (dedup + window + invalid) lives inside computeAnalyticsOpenCount.
  const usable = [];
  for (const row of rows) {
    const { requester, usable: rowUsable } = extractRowUsability(row);
    if (!rowUsable) {
      counts.raw_skipped_missing_key += 1;
      continue;
    }
    usable.push({ requester, row });
    if (row.resolution_status === 'invalid') {
      counts.raw_invalid += 1;
    } else if (row.market_id == null) {
      counts.raw_no_market_id += 1;
    } else if (row.resolution_status === 'pending') {
      counts.raw_pending_with_market += 1;
    } else {
      counts.raw_resolved += 1;
    }
  }
  return { counts, usable };
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
// The marketplace subgraph increments the Sender counters in three
// places (autonolas-subgraph @ 30d9043e49059598fc228ad4790ecd20b1bb1c74):
//
//   subgraphs/marketplace/src/marketplace/mech-marketplace.ts
//     handleMarketplaceRequest (on-chain path):
//       sender.totalMarketplaceRequests += 1
//       sender.totalLegacyRequests      += numRequests      ← ALSO bumped
//
//     handleMarketplaceDeliveryWithSignatures (off-chain path):
//       sender.totalOffChainRequests    += numDeliveries
//       sender.totalLegacyRequests      += numDeliveries    ← ALSO bumped
//
//   subgraphs/marketplace/src/agent-mech.ts:265-273
//     handleRequest (legacy AgentMech Request event, wired via
//     subgraph.gnosis.yaml:389 and the sister chain manifests):
//       sender.totalLegacyRequests      += 1
//       sender.totalMarketplaceRequests += 1                ← ALSO bumped
//
// So the correct identity is:
//
//   totalLegacyRequests      = SUM_agentMech(1) + SUM_mkt(numRequests) + SUM_offchain(n)
//   totalMarketplaceRequests = SUM_agentMech(1) + SUM_mkt(1)
//
// `totalLegacyRequests` is the grand total across all three entry points
// (misnamed — it's not a "legacy tail", it's the superset). It carries
// pre-marketplace AgentMech requests as well, so anyone re-verifying this
// against mech-analytics needs to confirm both sides read the same
// superset. They do: mech-analytics's `agent_aggregates.n_mech_requests`
// is populated by reading `totalLegacyRequests` directly
// (mech-analytics/etl/readers/marketplace_subgraph.py:298 →
// mech-analytics/etl/aggregates/rollup_agent.py::fetch_sender_request_counts).
// The AgentMech-era question does not re-open: both sides carry it.
//
// The previous check summed `totalLegacyRequests + totalMarketplaceRequests`,
// which counts every on-chain marketplace path twice (once via the grand
// total, once via the marketplace-only counter). That produced the
// chronic 2× divergence in prod. Use `totalLegacyRequests` alone.
//
// Coercion contract: null preserved, never coerced to 0 (verify-mech-
// analytics-parity.mjs script header states this invariant). An empty
// string or garbage value also returns null — those are data-gap
// signals, not real zeros. NaN propagating into the sum would flip a
// divergence verdict via `NaN <= tolerance` being false, so we must
// stop it here before it reaches the caller.
export const pickSubgraphSenderTotal = (sender) => {
  if (!sender || sender.totalLegacyRequests == null) return null;
  const raw = sender.totalLegacyRequests;
  // Empty / whitespace-only strings coerce to 0 via Number(''), which
  // would silently understate subgraphTotal. Treat them as data-gap
  // signals (null), matching the null-preserved invariant.
  if (typeof raw === 'string' && raw.trim() === '') return null;
  const total = Number(raw);
  return Number.isFinite(total) ? total : null;
};

// ---------------------------------------------------------------------------
// Check 1 status resolution — pure helper over the two open-count numbers
// ---------------------------------------------------------------------------

// Resolves the check-1 status (`vacuous | pass | gap | divergence`) from
// the two sides' counts, feed sizes, ingestion outcome, and truncation
// flag. Extracted so the truncation downgrade (`truncated ? 'gap' :
// 'pass'`) and the zero-ingest degradation guard are testable in
// isolation. The main script threads the returned status straight into
// the record().
//
// Precedence (top wins):
//   1. Both feeds empty                             → vacuous
//   2. Analytics side ingested zero rows but its
//      raw feed was non-empty (ts gate / dedup /
//      invalid drained everything)                  → gap
//   3. Analytics side dropped >SKIP_RATIO_THRESHOLD
//      of its raw rows via ts/window + missing-key
//      + invalid (post-dedup, non-duplicate) skips  → gap
//   4. Subgraph side ingested zero rows but its
//      raw feed was non-empty                       → gap
//   5. Subgraph side dropped >SKIP_RATIO_THRESHOLD
//      of its raw rows via missing-key + past-end   → gap
//   6. subgraphOpen === analyticsOpen               → truncated ? gap : pass
//   7. Truncated                                    → gap
//   8. Anything else                                → divergence
//
// The zero-ingest branches (2, 4) cover total ingestion failure: 500
// rows all-unparseable requested_at → `ingested: 0`, `open: 0` would
// otherwise report `PASS: open-market counts match exactly (0)` on a
// quiet-subgraph window, having verified nothing. The ratio branches
// (3, 5) cover partial degradation short of total failure — a plausible
// mid-roll-out contract drift where the ETL / subgraph starts mangling
// most but not all rows.
//
// Round 2 added a `consumed !== analyticsConsumed → divergence` tie-
// breaker after the open-equal branch. Round 3 reverted it: `consumed`
// is not comparable across the two sides on healthy data because
// `computeAnalyticsOpenCount` drops `resolution_status === 'invalid'`
// rows (mirroring the post-swap consumer's filter) while the subgraph
// feed has no invalid concept, so any window that contains an invalid
// row will see the two `consumed` counts differ by the invalid count.
// Reviewer self-corrected in round 3. The correct longer-term fix
// (drop invalid `request_id`s from the subgraph feed too so both sides
// model the post-swap consumer) touches how the subgraph feed is built
// and how check 2 works — deferred to a follow-up PR. `subgraphConsumed`
// and `analyticsConsumed` remain in the artifact for informational use.
export const SKIP_RATIO_THRESHOLD = 0.5;

export const resolveCheck1Status = ({
  subgraphOpen,
  analyticsOpen,
  analyticsIngested,
  analyticsRawRowCount,
  subgraphRowCount,
  subgraphRawRowCount,
  subgraphSkippedMissingKey,
  subgraphSkippedAfterWindowEnd,
  analyticsSkippedOutOfWindow,
  analyticsSkippedMissingKey,
  analyticsSkippedInvalid,
  truncated,
}) => {
  if (subgraphRowCount === 0 && analyticsRawRowCount === 0) {
    return { status: 'vacuous', reason: 'no-rows-either-side' };
  }
  // Zero-ingest guard (analytics): raw feed was non-empty but the
  // ts/dedup/invalid/missing-key filters drained every row. Downstream
  // open=0 vs subgraph=0 would silently PASS otherwise.
  if (analyticsIngested === 0 && analyticsRawRowCount > 0) {
    return { status: 'gap', reason: 'analytics-ingested-zero' };
  }
  // Partial-degradation guard (analytics): raw feed non-empty and
  // majority of rows fell out via the out-of-window / missing-key /
  // invalid buckets. `skippedDuplicate` is deliberately EXCLUDED from
  // the numerator — per docs/mech-analytics-migration.md:79-84 the API
  // re-serves the same row on every sweep touch, so duplicates are
  // normal healthy traffic and including them would fire the guard
  // during any resolution sweep. The other three buckets each represent
  // a plausible upstream regression: `skippedOutOfWindow` covers
  // requested_at parse / format drift; `skippedMissingKey` covers a
  // `requester` / `question_title` rename or nulling; `skippedInvalid`
  // covers predict-api resolution_status classification regressions.
  const analyticsAttrition =
    analyticsSkippedOutOfWindow + analyticsSkippedMissingKey + analyticsSkippedInvalid;
  if (
    analyticsRawRowCount > 0 &&
    analyticsAttrition / analyticsRawRowCount > SKIP_RATIO_THRESHOLD
  ) {
    return { status: 'gap', reason: 'analytics-attrition-majority' };
  }
  // Zero-ingest guard (subgraph): mirror of the analytics-side guard.
  // `fetchMarketplaceRequests` filters rows without `sender`, `title`,
  // or a positive `ts`, and rows past `windowEndSec`. A schema change
  // (`sender.id` going missing on most `Request` entities) presents as
  // a smaller `subgraphRowCount` — the `vacuous` branch only fires when
  // BOTH sides are empty, so without this guard a genuine subgraph
  // regression looks like a quiet window.
  if (subgraphRawRowCount != null && subgraphRowCount === 0 && subgraphRawRowCount > 0) {
    return { status: 'gap', reason: 'subgraph-ingested-zero' };
  }
  // Partial-degradation guard (subgraph). ``subgraphSkippedMissingKey``
  // here means "rows dropped for reasons that indicate a subgraph
  // schema regression" (sender.id or blockTimestamp missing) — NOT
  // rows dropped only because ``parsedRequest.questionTitle`` was
  // null. Predict-api emits shell rows precisely for requests whose
  // IPFS payload it could not parse, and those requests also lack a
  // parsed title on the subgraph side; that's the steady state, not
  // a regression. Chains routinely running at high title-less rates
  // (Gnosis omenstrat at ~90% title-less inside a parity window)
  // would otherwise chronically read as attrition-majority. Caller is
  // expected to pass only sender/ts drops here and route title-only
  // drops to check 2 via the request-id parity path.
  if (subgraphRawRowCount != null && subgraphRawRowCount > 0) {
    const subgraphAttrition =
      (subgraphSkippedMissingKey ?? 0) + (subgraphSkippedAfterWindowEnd ?? 0);
    if (subgraphAttrition / subgraphRawRowCount > SKIP_RATIO_THRESHOLD) {
      return { status: 'gap', reason: 'subgraph-attrition-majority' };
    }
  }
  if (subgraphOpen === analyticsOpen) {
    return {
      status: truncated ? 'gap' : 'pass',
      reason: truncated ? 'match-but-truncated' : 'exact-match',
    };
  }
  if (truncated) {
    return { status: 'gap', reason: 'mismatch-but-truncated' };
  }
  return { status: 'divergence', reason: 'open-mismatch' };
};

// Resolves the check-2 (row parity) status from the multiset diff
// outputs, feed sizes, and truncation flag. Same-shape helper as
// resolveCheck1Status so the truncation-downgrade rule
// (`truncated ? 'gap' : 'pass'` when diffs are zero;
//  `truncated ? 'gap' : 'divergence'` when non-zero) is tested in
// isolation from the script's env-var/network side effects.
export const resolveCheck2Status = ({
  subgraphRowCount,
  analyticsRowCount,
  missingInAnalytics,
  extraInAnalytics,
  truncated,
}) => {
  if (subgraphRowCount === 0 && analyticsRowCount === 0) {
    return { status: 'vacuous', reason: 'no-rows-either-side' };
  }
  if (missingInAnalytics === 0 && extraInAnalytics === 0) {
    return {
      status: truncated ? 'gap' : 'pass',
      reason: truncated ? 'match-but-truncated' : 'exact-match',
    };
  }
  if (truncated) {
    return { status: 'gap', reason: 'mismatch-but-truncated' };
  }
  return { status: 'divergence', reason: 'row-set-mismatch' };
};

// ---------------------------------------------------------------------------
// Verdict decision — pure function over the collected checkResults
// ---------------------------------------------------------------------------

// Extracted so the exit-code precedence and vacuous-dilution guard are
// unit-testable without spinning the full script. Returns
// `{ exitCode, verdict, message, counts }` where:
//
//   exitCode: 0 pass | 1 error | 2 vacuous | 3 divergence | 4 data gap
//   verdict:  'PASS' | 'FAIL' | 'VACUOUS'
//   message:  the one-line summary the run's `Verdict` section prints
//   counts:   { pass, divergence, gap, vacuous } for the artifact header
//
// Precedence: divergence (3) outranks gap (4) — a data gap on one check
// must not mask a real regression on another. Full-vacuous (all results
// vacuous) escalates to exit 2 so a run where nothing was comparable
// doesn't silently read as PASS. Partial-vacuous is also escalated: if
// any distinct check KIND has no non-vacuous result on any platform,
// that check verified nothing on this run and the verdict downgrades to
// vacuous — otherwise a run reporting `passed: 4, vacuous: 2, diverged: 0`
// would exit 0 despite two checks doing no verification (the reviewer's
// scenario: check 3 vacuous on both platforms after an API contract
// change).
//
// Invariant: an empty checkResults MUST return exit 2 VACUOUS, never
// exit 0 PASS. The script's own flow always records at least one result
// per platform per check, so this is unreachable through the current
// entry point — but decideVerdict is exported and independently
// unit-tested, and any future caller (filtered subset, early return,
// feature-flagged PLATFORMS) inherits this default. "Nothing checked"
// must never read as "everything passed". Do not remove the empty
// branch below without also revisiting every caller.
export const decideVerdict = (checkResults) => {
  const byStatus = (status) => checkResults.filter((r) => r.status === status);
  const passes = byStatus('pass');
  const divergences = byStatus('divergence');
  const gaps = byStatus('gap');
  const vacuous = byStatus('vacuous');
  const counts = {
    pass: passes.length,
    divergence: divergences.length,
    gap: gaps.length,
    vacuous: vacuous.length,
  };

  if (checkResults.length === 0) {
    return {
      exitCode: 2,
      verdict: 'VACUOUS',
      message: 'VACUOUS: no checks were recorded — nothing to gate, not a pass.',
      counts,
    };
  }
  if (divergences.length > 0) {
    return {
      exitCode: 3,
      verdict: 'FAIL',
      message: `FAIL (divergence): ${divergences.map((r) => `${r.platform}/${r.check}`).join(', ')}`,
      counts,
    };
  }
  if (gaps.length > 0) {
    return {
      exitCode: 4,
      verdict: 'FAIL',
      message: `FAIL (data gap): ${gaps.map((r) => `${r.platform}/${r.check}`).join(', ')}`,
      counts,
    };
  }
  if (vacuous.length === checkResults.length) {
    return {
      exitCode: 2,
      verdict: 'VACUOUS',
      message: 'VACUOUS: every check had nothing to compare on either side — not a pass.',
      counts,
    };
  }
  // Partial-vacuous guard: if any check kind was vacuous on every
  // platform it ran on, that kind proved nothing this run.
  const kinds = new Map(); // kind -> { total, vacuous }
  for (const r of checkResults) {
    const bucket = kinds.get(r.check) ?? { total: 0, vacuous: 0 };
    bucket.total += 1;
    if (r.status === 'vacuous') bucket.vacuous += 1;
    kinds.set(r.check, bucket);
  }
  const unverifiedKinds = [...kinds.entries()]
    .filter(([, b]) => b.total > 0 && b.total === b.vacuous)
    .map(([kind]) => kind);
  if (unverifiedKinds.length > 0) {
    return {
      exitCode: 2,
      verdict: 'VACUOUS',
      message: `VACUOUS: check kind(s) with no non-vacuous result: ${unverifiedKinds.join(', ')} — not a pass.`,
      counts,
    };
  }
  return {
    exitCode: 0,
    verdict: 'PASS',
    message: 'PASS: every non-vacuous check matched.',
    counts,
  };
};
