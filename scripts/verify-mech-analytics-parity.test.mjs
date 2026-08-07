#!/usr/bin/env node
/**
 * Unit tests for the pure helpers exported by
 * verify-mech-analytics-parity-lib.mjs, plus a handful of subprocess
 * checks over the entry script itself to nail down the sentinel exit-code
 * discipline (0 for --help, 1 for bad CLI, no accidental 0 on error).
 *
 * Uses Node's built-in test runner (node:test, ≥18) — no new
 * devDependencies. Run with
 *   node --test scripts/verify-mech-analytics-parity.test.mjs
 *
 * Live subgraph / mech-analytics pulls, docker/K8s wiring, and artifact
 * writing are out of scope here — they are exercised by the Docker
 * smoke-build (publish-verify-image.yaml build-only job) and by the
 * infra-run K8s Job. These tests target the three behaviours a change
 * to the script is most likely to break:
 *   * check 1 gate: title-based QMR consumption (not the market_id
 *     bucket) is the analytics-side open count
 *   * check 3 counter: totalLegacyRequests alone, never summed with
 *     totalMarketplaceRequests
 *   * --since/--until parsing: aware-only, mutually-required, exclusive
 *     with --window-days / --lag-buffer-minutes
 */

/* eslint-disable no-undef -- standalone test module: uses JS built-in globals */

import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  normalizeTitle,
  isoFromUnixSec,
  scrub,
  safeOrigin,
  parsePositiveInt,
  parseNonNegativeInt,
  parseAwareIso,
  computeWindow,
  runQmrOpenCount,
  computeSubgraphOpenCount,
  computeAnalyticsOpenCount,
  classifyAnalyticsRows,
  extractRowUsability,
  diffRowSets,
  pickSubgraphSenderTotal,
  decideVerdict,
  resolveCheck1Status,
  resolveCheck2Status,
  SKIP_RATIO_THRESHOLD,
} from './verify-mech-analytics-parity-lib.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCRIPT_PATH = path.join(__dirname, 'verify-mech-analytics-parity.mjs');

// ---------------------------------------------------------------------------
// normalizeTitle — must match roi-distribution.ts:402 character-for-character
// ---------------------------------------------------------------------------

test('normalizeTitle: lower-cases, strips non-alphanumerics, keeps first 100 chars', () => {
  assert.equal(normalizeTitle('Will BTC hit $100k by 2026?'), 'willbtchit100kby2026');
  assert.equal(normalizeTitle('  Padded  Whitespace  '), 'paddedwhitespace');
  assert.equal(normalizeTitle(''), '');
});

test('normalizeTitle: 100-char slice creates predictable collisions on long prefixes', () => {
  const base = 'a'.repeat(100);
  assert.equal(normalizeTitle(`${base} tail-one`), base);
  assert.equal(normalizeTitle(`${base} tail-two`), base);
  // Two titles that differ only in a suffix past char 100 hash to the
  // same key — check 1's matching depends on this happening consistently
  // on both sides, so a regression that changes the slice would surface
  // as a divergence on the parity run.
  assert.equal(normalizeTitle(`${base} X`), normalizeTitle(`${base} Y`));
});

test('normalizeTitle: emoji and unicode punctuation are stripped', () => {
  assert.equal(normalizeTitle('will "AI" win 🚀?'), 'willaiwin');
  assert.equal(normalizeTitle('U.S. election — 2026'), 'uselection2026');
});

test('normalizeTitle: does not throw on non-string values', () => {
  // Defensive: the site does not pass non-strings, but the -lib should
  // never crash if a subgraph response drifts to a null/number.
  assert.equal(normalizeTitle(123), '123');
  assert.equal(normalizeTitle(null), 'null');
  assert.equal(normalizeTitle(undefined), 'undefined');
});

// ---------------------------------------------------------------------------
// scrub / safeOrigin / isoFromUnixSec
// ---------------------------------------------------------------------------

test('scrub: redacts urls and hex-looking blobs (API keys leak protection)', () => {
  const msg = 'GET https://api.thegraph.com/subgraphs/id/abcdef1234567890abcdef1234567890 failed';
  const scrubbed = scrub(msg);
  assert.equal(scrubbed.includes('api.thegraph.com'), false);
  assert.equal(scrubbed.includes('abcdef1234567890'), false);
  assert.match(scrubbed, /<redacted-url>/);
});

test('safeOrigin: returns origin without query/path', () => {
  assert.equal(safeOrigin('https://analytics.example.com/v1/data/scored-rows?x=1'), 'https://analytics.example.com');
  assert.equal(safeOrigin('http://localhost:8000/x'), 'http://localhost:8000');
});

test('safeOrigin: returns sentinel on unparseable input (never throws)', () => {
  assert.equal(safeOrigin('not-a-url'), '<invalid-url>');
  assert.equal(safeOrigin(''), '<invalid-url>');
});

test('isoFromUnixSec: emits UTC ISO 8601', () => {
  assert.equal(isoFromUnixSec(0), '1970-01-01T00:00:00.000Z');
  assert.equal(isoFromUnixSec(1_700_000_000), new Date(1_700_000_000_000).toISOString());
});

// ---------------------------------------------------------------------------
// parsePositiveInt / parseNonNegativeInt
// ---------------------------------------------------------------------------

test('parsePositiveInt: uses fallback when raw is null', () => {
  assert.equal(parsePositiveInt(null, 'days', 7), 7);
  assert.equal(parsePositiveInt(undefined, 'days', 7), 7);
});

test('parsePositiveInt: accepts positive int strings', () => {
  assert.equal(parsePositiveInt('4', 'days', 7), 4);
  assert.equal(parsePositiveInt('100', 'days', 7), 100);
});

test('parsePositiveInt: rejects zero, negatives, fractions, non-numeric', () => {
  for (const bad of ['0', '-1', '1.5', 'abc', '4x', '']) {
    assert.throws(() => parsePositiveInt(bad, 'days'), /must be a positive integer/);
  }
});

test('parseNonNegativeInt: accepts zero (unlike parsePositiveInt)', () => {
  assert.equal(parseNonNegativeInt('0', 'lag', 30), 0);
  assert.equal(parseNonNegativeInt('30', 'lag', 30), 30);
});

test('parseNonNegativeInt: rejects negatives and fractions', () => {
  for (const bad of ['-1', '1.5', 'abc']) {
    assert.throws(() => parseNonNegativeInt(bad, 'lag'), /must be a non-negative integer/);
  }
});

// ---------------------------------------------------------------------------
// parseAwareIso — reject naive datetimes, accept Z / offset forms
// ---------------------------------------------------------------------------

test('parseAwareIso: returns null when raw is null (optional arg)', () => {
  assert.equal(parseAwareIso(null, 'since'), null);
  assert.equal(parseAwareIso(undefined, 'since'), null);
});

test('parseAwareIso: accepts "Z" suffix (UTC)', () => {
  const d = parseAwareIso('2026-07-01T00:00:00Z', 'since');
  assert.equal(d instanceof Date, true);
  assert.equal(d.toISOString(), '2026-07-01T00:00:00.000Z');
});

test('parseAwareIso: accepts explicit +HH:MM offset', () => {
  const d = parseAwareIso('2026-07-01T02:00:00+02:00', 'since');
  assert.equal(d.toISOString(), '2026-07-01T00:00:00.000Z');
});

test('parseAwareIso: accepts explicit -HH:MM offset', () => {
  const d = parseAwareIso('2026-06-30T20:00:00-04:00', 'since');
  assert.equal(d.toISOString(), '2026-07-01T00:00:00.000Z');
});

test('parseAwareIso: rejects naive datetime (no offset — local zone risk)', () => {
  assert.throws(
    () => parseAwareIso('2026-07-01T00:00:00', 'since'),
    /must include a timezone/
  );
  assert.throws(
    () => parseAwareIso('2026-07-01', 'since'),
    /must include a timezone/
  );
});

test('parseAwareIso: rejects garbage input', () => {
  assert.throws(() => parseAwareIso('not-a-date', 'since'), /valid ISO 8601 datetime/);
  assert.throws(() => parseAwareIso('2026-13-01T00:00:00Z', 'since'), /valid ISO 8601 datetime/);
});

// ---------------------------------------------------------------------------
// computeWindow — trailing default, explicit override, mutual requirement
// ---------------------------------------------------------------------------

test('computeWindow: trailing default anchors start to end so the span is exactly windowDays', () => {
  // Regression guard for the anchoring bug: previously windowStart was
  // anchored to `nowSec` and windowEnd to `nowSec - lag`, so the span
  // was `windowDays - lag` (3d 23h 30m instead of 4d on defaults).
  // verify_migration_swap.py:_compute_window anchors start to end
  // (`until = now - lag; since = until - days`) so the span is exactly
  // `days`. Mirror that here.
  const nowSec = 1_800_000_000;
  const w = computeWindow({
    since: null,
    until: null,
    nowSec,
    windowDays: 4,
    lagBufferMinutes: 30,
  });
  assert.equal(w.source, 'trailing');
  assert.equal(w.windowEndSec, nowSec - 30 * 60);
  // span = end - start = windowDays * 86400, exactly (not windowDays*86400 - lag).
  assert.equal(w.windowEndSec - w.windowStartSec, 4 * 86400);
  assert.equal(w.windowStartSec, nowSec - 30 * 60 - 4 * 86400);
});

test('computeWindow: --since without --until throws (and vice versa)', () => {
  const nowSec = 1_800_000_000;
  const args = { nowSec, windowDays: 4, lagBufferMinutes: 30 };
  assert.throws(
    () => computeWindow({ ...args, since: new Date('2026-07-01T00:00:00Z'), until: null }),
    /--since and --until must be provided together/
  );
  assert.throws(
    () => computeWindow({ ...args, since: null, until: new Date('2026-07-08T00:00:00Z') }),
    /--since and --until must be provided together/
  );
});

test('computeWindow: explicit window overrides trailing knobs', () => {
  const w = computeWindow({
    since: new Date('2026-07-01T00:00:00Z'),
    until: new Date('2026-07-08T00:00:00Z'),
    nowSec: 1_800_000_000,
    windowDays: 4,
    lagBufferMinutes: 30,
  });
  assert.equal(w.source, 'explicit');
  assert.equal(w.windowStartSec, Math.floor(Date.parse('2026-07-01T00:00:00Z') / 1000));
  assert.equal(w.windowEndSec, Math.floor(Date.parse('2026-07-08T00:00:00Z') / 1000));
});

test('computeWindow: rejects --until <= --since', () => {
  const args = { nowSec: 1_800_000_000, windowDays: 4, lagBufferMinutes: 30 };
  assert.throws(
    () =>
      computeWindow({
        ...args,
        since: new Date('2026-07-08T00:00:00Z'),
        until: new Date('2026-07-01T00:00:00Z'),
      }),
    /--until must be strictly after --since/
  );
  assert.throws(
    () =>
      computeWindow({
        ...args,
        since: new Date('2026-07-01T00:00:00Z'),
        until: new Date('2026-07-01T00:00:00Z'),
      }),
    /--until must be strictly after --since/
  );
});

test('computeWindow: trailing window rejects a lag that pushes end past the epoch', () => {
  // With the new anchoring (windowStart = windowEnd - windowDays * 86400),
  // the span is always exactly `windowDays`, so "lag consumes the whole
  // window" is no longer reachable — only a nonsensical clock (lag
  // larger than nowSec) can produce a non-positive windowEnd, and we
  // refuse rather than compute negative timestamps.
  assert.throws(
    () =>
      computeWindow({
        since: null,
        until: null,
        nowSec: 100, // absurdly small "now"
        windowDays: 1,
        lagBufferMinutes: 60, // 3600s > nowSec
      }),
    /lag buffer pushes window end/
  );
});

// ---------------------------------------------------------------------------
// pickSubgraphSenderTotal — check 3 counter bug regression guard
// ---------------------------------------------------------------------------

test('pickSubgraphSenderTotal: returns totalLegacyRequests when present', () => {
  const sender = {
    id: '0xabc',
    totalLegacyRequests: '100',
    totalMarketplaceRequests: '40',
    totalOffChainRequests: '60',
  };
  // The regression this guards: the previous version returned
  // totalLegacy + totalMarketplace = 140, double-counting the on-chain path.
  // Correct answer is 100 — totalLegacy alone (which is really the grand
  // total, misnamed in the subgraph schema).
  assert.equal(pickSubgraphSenderTotal(sender), 100);
});

test('pickSubgraphSenderTotal: does NOT sum with totalMarketplaceRequests (regression guard)', () => {
  const sender = { id: '0xabc', totalLegacyRequests: '100', totalMarketplaceRequests: '40' };
  const total = pickSubgraphSenderTotal(sender);
  // Explicit anti-assertions — if a future refactor re-introduces the
  // sum, this test fails loudly.
  assert.notEqual(total, 140);
  assert.notEqual(total, Number('100') + Number('40'));
});

test('pickSubgraphSenderTotal: returns null when the counter is missing', () => {
  assert.equal(pickSubgraphSenderTotal({ id: '0xabc' }), null);
  assert.equal(pickSubgraphSenderTotal({ id: '0xabc', totalLegacyRequests: null }), null);
  assert.equal(pickSubgraphSenderTotal(null), null);
  assert.equal(pickSubgraphSenderTotal(undefined), null);
});

test('pickSubgraphSenderTotal: coerces string counter to number (subgraph BigInt shape)', () => {
  // Graph-node returns BigInt fields as JSON strings — the aggregation
  // downstream sums with `+`, so a passed-through string would produce
  // "100" + "50" = "10050". Force numeric conversion here.
  const total = pickSubgraphSenderTotal({ id: '0xabc', totalLegacyRequests: '100' });
  assert.equal(typeof total, 'number');
  assert.equal(total, 100);
});

// ---------------------------------------------------------------------------
// classifyAnalyticsRows — bucket accounting stays intact
// ---------------------------------------------------------------------------

test('classifyAnalyticsRows: buckets rows by resolution_status and market_id presence', () => {
  const rows = [
    { requester: '0xa', question_title: 'q1', resolution_status: 'pending', market_id: '0xM1' },
    { requester: '0xa', question_title: 'q2', resolution_status: 'pending', market_id: null },
    { requester: '0xb', question_title: 'q3', resolution_status: 'invalid', market_id: null },
    { requester: '0xb', question_title: 'q4', resolution_status: 'resolved', market_id: '0xM2' },
    { requester: null, question_title: 'q5', resolution_status: 'pending', market_id: '0xM3' },
    { requester: '0xc', question_title: null, resolution_status: 'pending', market_id: '0xM4' },
  ];
  const { counts, usable } = classifyAnalyticsRows(rows);
  // Bucket keys are `raw_*` prefixed so the artifact reader can tell
  // these are pre-dedup / pre-window counts, not the same population as
  // computeAnalyticsOpenCount's post-dedup skippedInvalid/etc.
  assert.equal(counts.raw_pending_with_market, 1);
  assert.equal(counts.raw_no_market_id, 1);
  assert.equal(counts.raw_invalid, 1);
  assert.equal(counts.raw_resolved, 1);
  assert.equal(counts.raw_skipped_missing_key, 2);
  assert.equal(usable.length, 4); // rows with requester+title survive the key check
});

test('classifyAnalyticsRows: duplicate request_ids all counted (pre-dedup semantics)', () => {
  // Deliberate divergence from computeAnalyticsOpenCount. The API re-serves
  // a row every time the resolution sweep touches it
  // (docs/mech-analytics-migration.md:79-84); this bucket count reports
  // that raw shape so the artifact reader can see the physical row
  // volume, and computeAnalyticsOpenCount dedups so the check-1 gate
  // uses each request once. Regression guard so a future edit that
  // deduplicates here doesn't silently change the artifact's meaning.
  const rows = [
    { request_id: 'r1', requester: '0xa', question_title: 'q1', resolution_status: 'invalid', market_id: '0xM' },
    { request_id: 'r1', requester: '0xa', question_title: 'q1', resolution_status: 'invalid', market_id: '0xM' },
    { request_id: 'r1', requester: '0xa', question_title: 'q1', resolution_status: 'invalid', market_id: '0xM' },
  ];
  const { counts, usable } = classifyAnalyticsRows(rows);
  assert.equal(counts.raw_invalid, 3);
  assert.equal(usable.length, 3);
});

// ---------------------------------------------------------------------------
// computeAnalyticsOpenCount / computeSubgraphOpenCount — the check 1 fix
// ---------------------------------------------------------------------------
// Signature reminder: computeAnalyticsOpenCount now takes RAW scored rows
// plus windowStartSec (not a pre-filtered usable list). It reproduces the
// consumer's filter order from mech-analytics.ts:171-197 exactly:
// dedup(request_id) → window/ts → invalid+remember-id → requester/title
// → ingest+remember-id.

// Any windowStartSec that predates the test timestamps disables the
// window gate — helper so tests can focus on the property they care about.
const NO_WINDOW = 0;

test('computeAnalyticsOpenCount: does NOT filter on market_id (check 1 gate bug regression)', () => {
  // The pre-fix version gated on rows with market_id IS NOT NULL, which
  // dropped ~99% of legitimate chain-100 rows because market_id is a
  // recently-added column. The consumer (mech-analytics.ts) doesn't
  // filter on market_id at all — it filters only on invalid and
  // missing requester/title. Force the shape of that bug into the input
  // and confirm the rows without market_id still enter QMR.
  const rows = [
    { request_id: 'r1', requester: '0xa', question_title: 'q1', resolution_status: 'pending', requested_at: '2026-07-01T00:00:00Z', market_id: null },
    { request_id: 'r2', requester: '0xa', question_title: 'q2', resolution_status: 'pending', requested_at: '2026-07-01T00:00:00Z', market_id: null },
    { request_id: 'r3', requester: '0xb', question_title: 'q3', resolution_status: 'invalid', requested_at: '2026-07-01T00:00:00Z', market_id: null },
  ];
  const result = computeAnalyticsOpenCount(rows, [], NO_WINDOW);
  // Two pending rows without market_id: both count as open. One invalid: skipped.
  assert.equal(result.ingested, 2);
  assert.equal(result.skippedInvalid, 1);
  assert.equal(result.consumed, 0);
  assert.equal(result.open, 2);
});

test('computeAnalyticsOpenCount: settlement consumes matching (title, agent) via normalizeTitle', () => {
  const rows = [
    { request_id: 'r1', requester: '0xagent1', question_title: 'Will BTC hit $100k by 2026?', resolution_status: 'pending', requested_at: '2026-07-01T00:00:00Z', market_id: null },
    { request_id: 'r2', requester: '0xagent1', question_title: 'Will BTC hit $100k by 2026?', resolution_status: 'pending', requested_at: '2026-07-01T00:00:00Z', market_id: null },
    { request_id: 'r3', requester: '0xagent2', question_title: 'Will ETH hit 10k?', resolution_status: 'pending', requested_at: '2026-07-01T00:00:00Z', market_id: null },
  ];
  const dailyStats = [
    {
      // agent1 settled a market whose title differs by punctuation only —
      // normalizeTitle collapses to the same key, so both agent1's rows
      // are consumed.
      traderAgent: { id: '0xAGENT1' },
      profitParticipants: [{ question: 'will btc hit 100k by 2026' }],
    },
  ];
  const result = computeAnalyticsOpenCount(rows, dailyStats, NO_WINDOW);
  assert.equal(result.ingested, 3);
  assert.equal(result.consumed, 2); // agent1's two rows drained
  assert.equal(result.open, 1); // agent2's row survives (no settlement)
});

test('computeAnalyticsOpenCount and computeSubgraphOpenCount converge on equivalent inputs', () => {
  // If the analytics and subgraph feeds carry the same (requester, title)
  // shape for the window, the two open counts must match — this is the
  // property check 1 gates on. Sanity: a hand-built matching pair.
  const requests = [
    { requester: '0xagent1', title: 'Market A' },
    { requester: '0xagent1', title: 'Market A' },
    { requester: '0xagent2', title: 'Market B' },
  ];
  const rows = requests.map(({ requester, title }, i) => ({
    request_id: `r${i}`,
    requester,
    question_title: title,
    resolution_status: 'pending',
    requested_at: '2026-07-01T00:00:00Z',
    market_id: null,
  }));
  const dailyStats = [
    { traderAgent: { id: '0xagent2' }, profitParticipants: [{ question: 'market b' }] },
  ];
  const sub = computeSubgraphOpenCount(requests, dailyStats, 'question');
  const ana = computeAnalyticsOpenCount(rows, dailyStats, NO_WINDOW);
  assert.equal(sub.open, ana.open);
  assert.equal(sub.consumed, ana.consumed);
});

test('computeAnalyticsOpenCount: handles polymarket metadata.title participant field via union', () => {
  // Consumer uses `p.question ?? p.metadata?.title` unconditionally
  // (roi-distribution.ts:573). No per-platform flag: both fields are
  // tried for every stat, so a title landing in either field consumes.
  const rows = [
    { request_id: 'r1', requester: '0xagent1', question_title: 'Market X', resolution_status: 'pending', requested_at: '2026-07-01T00:00:00Z', market_id: null },
  ];
  const dailyStats = [
    { traderAgent: { id: '0xagent1' }, profitParticipants: [{ metadata: { title: 'market x' } }] },
  ];
  const result = computeAnalyticsOpenCount(rows, dailyStats, NO_WINDOW);
  assert.equal(result.consumed, 1);
  assert.equal(result.open, 0);
});

test('computeAnalyticsOpenCount: does not consume across agents (per-agent QMR)', () => {
  // A dailyStat from agent2 must not consume agent1's open rows even
  // if the titles match — this mirrors roi-distribution.ts's per-agent
  // consumption (each agent's stats consume only their own entries).
  const rows = [
    { request_id: 'r1', requester: '0xagent1', question_title: 'Market Z', resolution_status: 'pending', requested_at: '2026-07-01T00:00:00Z', market_id: null },
  ];
  const dailyStats = [
    { traderAgent: { id: '0xagent2' }, profitParticipants: [{ question: 'market z' }] },
  ];
  const result = computeAnalyticsOpenCount(rows, dailyStats, NO_WINDOW);
  assert.equal(result.consumed, 0);
  assert.equal(result.open, 1);
});

// ---------------------------------------------------------------------------
// Consumer-parity tests: dedup, window/ts gate, order-independent collisions
// ---------------------------------------------------------------------------

test('computeAnalyticsOpenCount: deduplicates repeat request_id (resolution updates)', () => {
  // The consumer skips already-ingested request_ids because the API
  // sends the same row again every time its resolution updates
  // (mech-analytics.ts:171-174). Without this, every update re-inflates
  // the analytics open count vs the subgraph, which counts each request
  // exactly once — a chronic false divergence.
  const rows = [
    { request_id: 'r1', requester: '0xa', question_title: 'q1', resolution_status: 'pending', requested_at: '2026-07-01T00:00:00Z', market_id: null },
    { request_id: 'r1', requester: '0xa', question_title: 'q1', resolution_status: 'pending', requested_at: '2026-07-01T00:00:00Z', market_id: null },
    { request_id: 'r1', requester: '0xa', question_title: 'q1', resolution_status: 'pending', requested_at: '2026-07-01T00:00:00Z', market_id: null },
  ];
  const result = computeAnalyticsOpenCount(rows, [], NO_WINDOW);
  assert.equal(result.ingested, 1);
  assert.equal(result.skippedDuplicate, 2);
  assert.equal(result.open, 1);
});

test('computeAnalyticsOpenCount: invalid row records id, later duplicates stay skipped', () => {
  // mech-analytics.ts:181-185 remembers invalid row ids so subsequent
  // updates carrying the same id (an invalid row that later resolves,
  // or vice versa) don't re-enter as ingested.
  const rows = [
    { request_id: 'r1', requester: '0xa', question_title: 'q1', resolution_status: 'invalid', requested_at: '2026-07-01T00:00:00Z', market_id: null },
    { request_id: 'r1', requester: '0xa', question_title: 'q1', resolution_status: 'pending', requested_at: '2026-07-01T00:00:00Z', market_id: null },
  ];
  const result = computeAnalyticsOpenCount(rows, [], NO_WINDOW);
  assert.equal(result.skippedInvalid, 1);
  assert.equal(result.skippedDuplicate, 1);
  assert.equal(result.ingested, 0);
  assert.equal(result.open, 0);
});

test('computeAnalyticsOpenCount: window/ts gate runs BEFORE the invalid check', () => {
  // Consumer ordering (mech-analytics.ts:175-185): out-of-window rows
  // are skipped without recording their id, so an invalid row that
  // falls outside the window does NOT enter seenIds. If the ordering
  // were flipped, an in-window duplicate would then be wrongly skipped.
  const windowStartSec = Math.floor(Date.parse('2026-07-01T00:00:00Z') / 1000);
  const rows = [
    // Out of window, invalid — must be skipped as out-of-window, id NOT recorded
    { request_id: 'r1', requester: '0xa', question_title: 'q1', resolution_status: 'invalid', requested_at: '2026-06-01T00:00:00Z', market_id: null },
    // In-window duplicate id, pending — id was not recorded above, so this must ingest
    { request_id: 'r1', requester: '0xa', question_title: 'q1', resolution_status: 'pending', requested_at: '2026-07-02T00:00:00Z', market_id: null },
  ];
  const result = computeAnalyticsOpenCount(rows, [], windowStartSec);
  assert.equal(result.skippedOutOfWindow, 1);
  assert.equal(result.skippedInvalid, 0);
  assert.equal(result.skippedDuplicate, 0);
  assert.equal(result.ingested, 1);
  assert.equal(result.open, 1);
});

test('computeAnalyticsOpenCount: rejects ts <= 0 (Date.parse failure or epoch zero)', () => {
  const windowStartSec = Math.floor(Date.parse('2026-07-01T00:00:00Z') / 1000);
  const rows = [
    { request_id: 'r1', requester: '0xa', question_title: 'q1', resolution_status: 'pending', requested_at: 'not-a-date', market_id: null },
    { request_id: 'r2', requester: '0xa', question_title: 'q2', resolution_status: 'pending', requested_at: '1970-01-01T00:00:00Z', market_id: null },
  ];
  const result = computeAnalyticsOpenCount(rows, [], windowStartSec);
  assert.equal(result.skippedOutOfWindow, 2);
  assert.equal(result.ingested, 0);
});

// This is the invariant check 1 actually depends on: two feeds with the
// same logical rows in DIFFERENT ORDERS where two titles collide past
// char 100 with different per-agent counts must produce the same `open`
// on both sides. The pre-fix version kept a raw-title QMR with a
// normalized-index fallback, so the two feeds picked different collision
// winners and drained different buckets — same data, different answer.
test('subgraph vs analytics open counts are order-invariant on normalizeTitle collisions', () => {
  // Two long titles that differ only in the last char — collide under
  // the 100-char normalizeTitle slice. Different per-agent counts:
  // agent1 has 3 on titleA + 1 on titleB (bucket total 4).
  // One settlement whose title also normalizes into the same bucket
  // consumes all of agent1's entries (per-agent bucket drain).
  const base = 'a'.repeat(100);
  const titleA = `${base} X`;
  const titleB = `${base} Y`;

  // SUBGRAPH FEED: interleaved order (blockTimestamp interleaves rows)
  const subgraphRequests = [
    { requester: '0xagent1', title: titleA },
    { requester: '0xagent1', title: titleB },
    { requester: '0xagent1', title: titleA },
    { requester: '0xagent1', title: titleA },
  ];
  // ANALYTICS FEED: same logical set, DIFFERENT order (grouped)
  const analyticsRows = [
    { request_id: 'r-b1', requester: '0xagent1', question_title: titleB, resolution_status: 'pending', requested_at: '2026-07-01T00:00:00Z', market_id: null },
    { request_id: 'r-a1', requester: '0xagent1', question_title: titleA, resolution_status: 'pending', requested_at: '2026-07-01T00:00:01Z', market_id: null },
    { request_id: 'r-a2', requester: '0xagent1', question_title: titleA, resolution_status: 'pending', requested_at: '2026-07-01T00:00:02Z', market_id: null },
    { request_id: 'r-a3', requester: '0xagent1', question_title: titleA, resolution_status: 'pending', requested_at: '2026-07-01T00:00:03Z', market_id: null },
  ];
  const dailyStats = [
    { traderAgent: { id: '0xagent1' }, profitParticipants: [{ question: base }] },
  ];

  const sub = computeSubgraphOpenCount(subgraphRequests, dailyStats, 'question');
  const ana = computeAnalyticsOpenCount(analyticsRows, dailyStats, NO_WINDOW);

  // The property that must hold: same logical data → same open count.
  assert.equal(sub.open, ana.open);
  assert.equal(sub.consumed, ana.consumed);
  // And structurally: settlement consumed all 4 (whole bucket drained).
  assert.equal(sub.open, 0);
  assert.equal(sub.consumed, 4);
});

// ---------------------------------------------------------------------------
// runQmrOpenCount — direct tests of the shared helper
// ---------------------------------------------------------------------------

test('runQmrOpenCount: consumes via metadata.title AND question via the ?? union', () => {
  // Consumer fallback (roi-distribution.ts:573) is `p.question ??
  // p.metadata?.title` unconditionally. Prove both fields are tried by
  // driving one consumption via each.
  const entries = [
    { requester: '0xagent1', title: 'Market A' },
    { requester: '0xagent1', title: 'Market B' },
  ];
  const dailyStats = [
    { traderAgent: { id: '0xagent1' }, profitParticipants: [{ question: 'market a' }] },
    { traderAgent: { id: '0xagent1' }, profitParticipants: [{ metadata: { title: 'market b' } }] },
  ];
  const result = runQmrOpenCount(entries, dailyStats);
  assert.equal(result.consumed, 2);
  assert.equal(result.open, 0);
});

// ---------------------------------------------------------------------------
// pickSubgraphSenderTotal — data-gap coercion contract (item 5 fix)
// ---------------------------------------------------------------------------

test('pickSubgraphSenderTotal: empty string returns null (not 0), malformed returns null (not NaN)', () => {
  // Regression guard: the header docstring states "null preserved,
  // never coerced to 0". Before the fix, `''` coerced to `0`
  // (contributing a real zero to subgraphTotal, understating it) and
  // `'oops'` propagated NaN into `delta`, tripping the `else` branch
  // and reporting DIVERGENCE (exit 3) when it should have been GAP
  // (exit 4). Both must now round-trip to null.
  assert.equal(pickSubgraphSenderTotal({ totalLegacyRequests: '' }), null);
  assert.equal(pickSubgraphSenderTotal({ totalLegacyRequests: 'oops' }), null);
  assert.equal(pickSubgraphSenderTotal({ totalLegacyRequests: 'NaN' }), null);
  // Genuine 0 (a Safe with zero recorded requests) still returns 0.
  assert.equal(pickSubgraphSenderTotal({ totalLegacyRequests: '0' }), 0);
  assert.equal(pickSubgraphSenderTotal({ totalLegacyRequests: 0 }), 0);
});

// ---------------------------------------------------------------------------
// diffRowSets — smoke tests for the row-parity multiset diff
// ---------------------------------------------------------------------------

test('diffRowSets: matching (requester, request_id) pairs balance out', () => {
  const subgraph = [
    { requester: '0xa', ts: 1000, title: 'x', requestId: '0xr1' },
    { requester: '0xa', ts: 2000, title: 'y', requestId: '0xr2' },
  ];
  const analytics = [
    { requester: '0xa', row: { request_id: '0xr1', requested_at: '1970-01-01T00:16:40Z', question_title: 'x' } },
    { requester: '0xa', row: { request_id: '0xr2', requested_at: '1970-01-01T00:33:20Z', question_title: 'y' } },
  ];
  const result = diffRowSets(subgraph, analytics);
  assert.equal(result.missingInAnalytics, 0);
  assert.equal(result.extraInAnalytics, 0);
});

test('diffRowSets: rows missing on analytics side are counted, samples captured', () => {
  const subgraph = [
    { requester: '0xa', ts: 1000, title: 'x', requestId: '0xr1' },
    { requester: '0xa', ts: 2000, title: 'y', requestId: '0xr2' },
  ];
  const analytics = [
    { requester: '0xa', row: { request_id: '0xr1', requested_at: '1970-01-01T00:16:40Z', question_title: 'x' } },
  ];
  const result = diffRowSets(subgraph, analytics);
  assert.equal(result.missingInAnalytics, 1);
  assert.equal(result.extraInAnalytics, 0);
  assert.equal(result.missingSamples.length, 1);
});

test('diffRowSets: rows extra on analytics side are counted, samples captured', () => {
  const subgraph = [
    { requester: '0xa', ts: 1000, title: 'x', requestId: '0xr1' },
  ];
  const analytics = [
    { requester: '0xa', row: { request_id: '0xr1', requested_at: '1970-01-01T00:16:40Z', question_title: 'x' } },
    { requester: '0xa', row: { request_id: '0xr9', requested_at: '1970-01-01T00:33:20Z', question_title: 'z' } },
  ];
  const result = diffRowSets(subgraph, analytics);
  assert.equal(result.missingInAnalytics, 0);
  assert.equal(result.extraInAnalytics, 1);
  assert.equal(result.extraSamples.length, 1);
});

test('diffRowSets: ts fallback engages when one side has no request_id, flagged in tsFallbackKeys', () => {
  const subgraph = [{ requester: '0xa', ts: 1000, title: 'x', requestId: null }];
  const analytics = [
    { requester: '0xa', row: { request_id: null, requested_at: '1970-01-01T00:16:40Z', question_title: 'x' } },
  ];
  const result = diffRowSets(subgraph, analytics);
  assert.equal(result.missingInAnalytics, 0);
  assert.equal(result.extraInAnalytics, 0);
  assert.equal(result.tsFallbackKeys, 1);
});

// ---------------------------------------------------------------------------
// CLI subprocess tests — sentinel exit-code discipline
// ---------------------------------------------------------------------------
//
// These exercise the script itself, not the -lib module: the sentinel
// contract (exit 0 only when --help, exit 1 on config errors, exit 3/4
// preserved for divergence/gap) is a script-level property. Runs are
// hermetic (no network, no env vars set beyond what we pass) — every
// invocation with real config would need subgraph URLs, which we do NOT
// provide, so any test that would reach the network path fails at env
// validation instead.

const runScript = (argv, env = {}) => {
  try {
    const stdout = execFileSync('node', [SCRIPT_PATH, ...argv], {
      encoding: 'utf8',
      // Wipe inherited env so a developer running the tests with real
      // MECH_ANALYTICS_URL set doesn't turn "missing env" tests into
      // accidental live runs. Only PATH + explicit overrides survive.
      env: { PATH: process.env.PATH ?? '', ...env },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    return { code: 0, stdout, stderr: '' };
  } catch (err) {
    return {
      code: err.status ?? 1,
      stdout: err.stdout?.toString?.() ?? '',
      stderr: err.stderr?.toString?.() ?? '',
    };
  }
};

test('--help exits 0 with no env required (docker smoke-test path)', () => {
  const { code, stdout } = runScript(['--help']);
  assert.equal(code, 0);
  assert.match(stdout, /Usage:/);
  assert.match(stdout, /--since <iso>/);
  assert.match(stdout, /--until <iso>/);
  assert.match(stdout, /Exit codes: 0 pass, 1 error, 2 vacuous, 3 divergence, 4 data gap\./);
});

test('missing MECH_ANALYTICS_URL exits 1 (never 0)', () => {
  const { code, stderr } = runScript([]);
  assert.equal(code, 1);
  assert.match(stderr, /missing required configuration/);
});

test('--since without --until exits 1 (mutual-requirement)', () => {
  // Supply all env so validation reaches the window-parse step.
  const { code, stderr } = runScript(
    ['--since', '2026-07-01T00:00:00Z'],
    {
      MECH_ANALYTICS_URL: 'https://ma.example',
      NEXT_PUBLIC_GNOSIS_MARKETPLACE_SUBGRAPH_URL: 'https://sg1.example',
      NEXT_PUBLIC_POLYGON_MARKETPLACE_SUBGRAPH_URL: 'https://sg2.example',
      NEXT_PUBLIC_OLAS_PREDICT_AGENTS_SUBGRAPH_URL: 'https://sg3.example',
      NEXT_PUBLIC_OLAS_POLYMARKET_AGENTS_SUBGRAPH_URL: 'https://sg4.example',
    }
  );
  assert.equal(code, 1);
  assert.match(stderr, /--since and --until must be provided together/);
});

test('--since with naive datetime (no tz) exits 1', () => {
  const { code, stderr } = runScript(
    ['--since', '2026-07-01T00:00:00', '--until', '2026-07-08T00:00:00'],
    {
      MECH_ANALYTICS_URL: 'https://ma.example',
      NEXT_PUBLIC_GNOSIS_MARKETPLACE_SUBGRAPH_URL: 'https://sg1.example',
      NEXT_PUBLIC_POLYGON_MARKETPLACE_SUBGRAPH_URL: 'https://sg2.example',
      NEXT_PUBLIC_OLAS_PREDICT_AGENTS_SUBGRAPH_URL: 'https://sg3.example',
      NEXT_PUBLIC_OLAS_POLYMARKET_AGENTS_SUBGRAPH_URL: 'https://sg4.example',
    }
  );
  assert.equal(code, 1);
  assert.match(stderr, /must include a timezone/);
});

test('--since with --window-days is mutually exclusive (exits 1)', () => {
  const { code, stderr } = runScript(
    ['--since', '2026-07-01T00:00:00Z', '--until', '2026-07-08T00:00:00Z', '--window-days', '4'],
    {
      MECH_ANALYTICS_URL: 'https://ma.example',
      NEXT_PUBLIC_GNOSIS_MARKETPLACE_SUBGRAPH_URL: 'https://sg1.example',
      NEXT_PUBLIC_POLYGON_MARKETPLACE_SUBGRAPH_URL: 'https://sg2.example',
      NEXT_PUBLIC_OLAS_PREDICT_AGENTS_SUBGRAPH_URL: 'https://sg3.example',
      NEXT_PUBLIC_OLAS_POLYMARKET_AGENTS_SUBGRAPH_URL: 'https://sg4.example',
    }
  );
  assert.equal(code, 1);
  assert.match(stderr, /mutually exclusive/);
});

test('bad --window-days exits 1 (not 0, not a stack trace)', () => {
  // env-var validation runs before flag parsing (correct order — the
  // script cannot do anything without those URLs), so supply the env
  // to force the failure onto the --window-days branch.
  const { code, stderr } = runScript(['--window-days', 'seven'], {
    MECH_ANALYTICS_URL: 'https://ma.example',
    NEXT_PUBLIC_GNOSIS_MARKETPLACE_SUBGRAPH_URL: 'https://sg1.example',
    NEXT_PUBLIC_POLYGON_MARKETPLACE_SUBGRAPH_URL: 'https://sg2.example',
    NEXT_PUBLIC_OLAS_PREDICT_AGENTS_SUBGRAPH_URL: 'https://sg3.example',
    NEXT_PUBLIC_OLAS_POLYMARKET_AGENTS_SUBGRAPH_URL: 'https://sg4.example',
  });
  assert.equal(code, 1);
  assert.match(stderr, /--window-days must be a positive integer/);
});

// ---------------------------------------------------------------------------
// decideVerdict — exit-code precedence, truncation downgrade, vacuous dilution
// ---------------------------------------------------------------------------
//
// Exit-code contract: 0 pass / 1 error (sentinel — set only when the try
// block never reaches decideVerdict) / 2 vacuous / 3 divergence / 4 gap.
// Precedence: divergence > gap > full-vacuous > partial-vacuous > pass.

test('decideVerdict: all pass → exit 0', () => {
  const r = [
    { check: 'open_market_count', platform: 'omenstrat', status: 'pass' },
    { check: 'open_market_count', platform: 'polystrat', status: 'pass' },
    { check: 'row_parity', platform: 'omenstrat', status: 'pass' },
    { check: 'row_parity', platform: 'polystrat', status: 'pass' },
    { check: 'sender_total', platform: 'omenstrat', status: 'pass' },
    { check: 'sender_total', platform: 'polystrat', status: 'pass' },
  ];
  const d = decideVerdict(r);
  assert.equal(d.exitCode, 0);
  assert.equal(d.verdict, 'PASS');
  assert.equal(d.counts.pass, 6);
});

test('decideVerdict: any divergence → exit 3 (outranks gap)', () => {
  const r = [
    { check: 'open_market_count', platform: 'omenstrat', status: 'divergence' },
    { check: 'row_parity', platform: 'omenstrat', status: 'gap' },
    { check: 'sender_total', platform: 'omenstrat', status: 'pass' },
  ];
  const d = decideVerdict(r);
  assert.equal(d.exitCode, 3);
  assert.equal(d.verdict, 'FAIL');
  assert.match(d.message, /divergence.*omenstrat\/open_market_count/);
});

test('decideVerdict: gap without divergence → exit 4', () => {
  const r = [
    { check: 'open_market_count', platform: 'omenstrat', status: 'gap' },
    { check: 'row_parity', platform: 'omenstrat', status: 'pass' },
  ];
  const d = decideVerdict(r);
  assert.equal(d.exitCode, 4);
  assert.equal(d.verdict, 'FAIL');
  assert.match(d.message, /data gap.*omenstrat\/open_market_count/);
});

test('decideVerdict: every result vacuous → exit 2 (full-vacuous)', () => {
  const r = [
    { check: 'open_market_count', platform: 'omenstrat', status: 'vacuous' },
    { check: 'open_market_count', platform: 'polystrat', status: 'vacuous' },
  ];
  const d = decideVerdict(r);
  assert.equal(d.exitCode, 2);
  assert.equal(d.verdict, 'VACUOUS');
});

test('decideVerdict: partial-vacuous — one check kind 100% vacuous → exit 2 (not 0)', () => {
  // Reviewer's scenario: 2 platforms × 3 checks = 6 results. Check 3
  // goes vacuous on both platforms (empty instances + null windows.all
  // after an API contract change). Old logic reported passed=4,
  // vacuous=2, diverged=0 and exited 0 despite two checks doing no
  // verification. New logic must exit 2.
  const r = [
    { check: 'open_market_count', platform: 'omenstrat', status: 'pass' },
    { check: 'open_market_count', platform: 'polystrat', status: 'pass' },
    { check: 'row_parity', platform: 'omenstrat', status: 'pass' },
    { check: 'row_parity', platform: 'polystrat', status: 'pass' },
    { check: 'sender_total', platform: 'omenstrat', status: 'vacuous' },
    { check: 'sender_total', platform: 'polystrat', status: 'vacuous' },
  ];
  const d = decideVerdict(r);
  assert.equal(d.exitCode, 2);
  assert.equal(d.verdict, 'VACUOUS');
  assert.match(d.message, /sender_total/);
  assert.equal(d.counts.pass, 4);
  assert.equal(d.counts.vacuous, 2);
});

test('decideVerdict: mixed vacuous — kind is verified on at least one platform → exit 0', () => {
  // Contrast with the previous test: sender_total is vacuous on
  // polystrat but PASS on omenstrat. The check kind IS verified on at
  // least one platform, so the run stands.
  const r = [
    { check: 'open_market_count', platform: 'omenstrat', status: 'pass' },
    { check: 'open_market_count', platform: 'polystrat', status: 'pass' },
    { check: 'sender_total', platform: 'omenstrat', status: 'pass' },
    { check: 'sender_total', platform: 'polystrat', status: 'vacuous' },
  ];
  const d = decideVerdict(r);
  assert.equal(d.exitCode, 0);
  assert.equal(d.verdict, 'PASS');
});

test('decideVerdict: empty checkResults → exit 2 VACUOUS (nothing checked is never a pass)', () => {
  // Reviewer regression: round 2 added `checkResults.length > 0 &&` to
  // the all-vacuous branch and, as a side effect, made an empty list
  // fall through to the final `PASS`. Any future caller that hands an
  // empty list to decideVerdict (filtered subset, early return,
  // feature-flagged PLATFORMS) would inherit "nothing checked means
  // PASS". Empty MUST be exit 2, not exit 0.
  const d = decideVerdict([]);
  assert.equal(d.exitCode, 2);
  assert.equal(d.verdict, 'VACUOUS');
  assert.match(d.message, /no checks were recorded/);
});

test('decideVerdict: propagates pre-labelled "gap" status to exit 4', () => {
  // decideVerdict operates on already-classified statuses. This test
  // pins the contract that a `gap` from any check-site downgrade
  // escalates to exit 4 (not exit 0). The actual downgrade computation
  // is tested against resolveCheck1Status / resolveCheck2Status below.
  const r = [
    { check: 'open_market_count', platform: 'omenstrat', status: 'gap' },
    { check: 'row_parity', platform: 'omenstrat', status: 'pass' },
  ];
  const d = decideVerdict(r);
  assert.equal(d.exitCode, 4);
});

test('decideVerdict: pre-labelled "gap" from truncated+mismatch does not escalate to divergence', () => {
  // Same as above in the opposite direction: even when there IS a diff,
  // a check-site that labels itself `gap` (because it was truncated)
  // must not be treated as `divergence` by decideVerdict — otherwise a
  // truncated fetch could report a fake regression.
  const r = [
    { check: 'open_market_count', platform: 'omenstrat', status: 'gap' },
  ];
  const d = decideVerdict(r);
  assert.equal(d.exitCode, 4);
  assert.equal(d.counts.divergence, 0);
  assert.equal(d.counts.gap, 1);
});

// ---------------------------------------------------------------------------
// extractRowUsability — the shared filter classifyAnalyticsRows /
// computeAnalyticsOpenCount both go through
// ---------------------------------------------------------------------------

test('extractRowUsability: lowercases requester and requires non-empty title', () => {
  // Both fields required; requester lowercased; either missing → not usable.
  assert.deepEqual(extractRowUsability({ requester: '0xABC', question_title: 'q' }), {
    requester: '0xabc',
    title: 'q',
    usable: true,
  });
  assert.deepEqual(extractRowUsability({ requester: null, question_title: 'q' }), {
    requester: null,
    title: 'q',
    usable: false,
  });
  assert.deepEqual(extractRowUsability({ requester: '0xABC', question_title: null }), {
    requester: '0xabc',
    title: null,
    usable: false,
  });
  assert.deepEqual(extractRowUsability({ requester: '', question_title: 'q' }), {
    requester: '',
    title: 'q',
    usable: false,
  });
  assert.deepEqual(extractRowUsability({ requester: '0xabc', question_title: '' }), {
    requester: '0xabc',
    title: '',
    usable: false,
  });
});

test('classifyAnalyticsRows and computeAnalyticsOpenCount agree on usability filter', () => {
  // Both call sites must classify "usable" identically for the artifact
  // to make sense. This is the anti-drift test the reviewer asked for:
  // if the shared helper's contract changes, both callers move together
  // or this fails.
  const rows = [
    { request_id: 'r1', requester: '0xA', question_title: 'q1', resolution_status: 'pending', requested_at: '2026-07-01T00:00:00Z', market_id: null },
    { request_id: 'r2', requester: null, question_title: 'q2', resolution_status: 'pending', requested_at: '2026-07-01T00:00:00Z', market_id: null },
    { request_id: 'r3', requester: '0xB', question_title: '', resolution_status: 'pending', requested_at: '2026-07-01T00:00:00Z', market_id: null },
    { request_id: 'r4', requester: '', question_title: 'q4', resolution_status: 'pending', requested_at: '2026-07-01T00:00:00Z', market_id: null },
  ];
  const { counts, usable } = classifyAnalyticsRows(rows);
  const result = computeAnalyticsOpenCount(rows, [], NO_WINDOW);
  // classifyAnalyticsRows skipped 3, computeAnalyticsOpenCount skipped 3;
  // exactly one row survived on each side.
  assert.equal(counts.raw_skipped_missing_key, 3);
  assert.equal(usable.length, 1);
  assert.equal(result.skippedMissingKey, 3);
  assert.equal(result.ingested, 1);
});

// ---------------------------------------------------------------------------
// computeAnalyticsOpenCount — skippedMissingKey counter (previously untested)
// ---------------------------------------------------------------------------

test('computeAnalyticsOpenCount: skippedMissingKey counts survivors of ts+invalid but no requester/title', () => {
  // Ordering matters: dedup → ts → invalid → missing-key. A row that
  // survives dedup, ts, and invalid but has no requester or title lands
  // in skippedMissingKey (not skippedInvalid or skippedOutOfWindow).
  const rows = [
    { request_id: 'r1', requester: '0xA', question_title: 'q1', resolution_status: 'pending', requested_at: '2026-07-01T00:00:00Z', market_id: null },
    { request_id: 'r2', requester: null, question_title: 'q2', resolution_status: 'pending', requested_at: '2026-07-01T00:00:00Z', market_id: null },
    { request_id: 'r3', requester: '0xB', question_title: null, resolution_status: 'pending', requested_at: '2026-07-01T00:00:00Z', market_id: null },
    { request_id: 'r4', requester: null, question_title: null, resolution_status: 'pending', requested_at: '2026-07-01T00:00:00Z', market_id: null },
  ];
  const result = computeAnalyticsOpenCount(rows, [], NO_WINDOW);
  assert.equal(result.skippedMissingKey, 3);
  assert.equal(result.skippedInvalid, 0);
  assert.equal(result.skippedOutOfWindow, 0);
  assert.equal(result.skippedDuplicate, 0);
  assert.equal(result.ingested, 1);
});

// ---------------------------------------------------------------------------
// resolveCheck1Status — extracted downgrade / vacuous / gap logic
// ---------------------------------------------------------------------------

test('resolveCheck1Status: exact match with no truncation → pass', () => {
  const r = resolveCheck1Status({
    subgraphOpen: 5,
    subgraphConsumed: 2,
    analyticsOpen: 5,
    analyticsConsumed: 2,
    analyticsIngested: 7,
    analyticsRawRowCount: 7,
    subgraphRowCount: 7,
    analyticsSkippedOutOfWindow: 0,
    truncated: false,
  });
  assert.equal(r.status, 'pass');
  assert.equal(r.reason, 'exact-match');
});

test('resolveCheck1Status: truncated match downgrades pass → gap', () => {
  const r = resolveCheck1Status({
    subgraphOpen: 5,
    subgraphConsumed: 2,
    analyticsOpen: 5,
    analyticsConsumed: 2,
    analyticsIngested: 7,
    analyticsRawRowCount: 7,
    subgraphRowCount: 7,
    analyticsSkippedOutOfWindow: 0,
    truncated: true,
  });
  assert.equal(r.status, 'gap');
  assert.equal(r.reason, 'match-but-truncated');
});

test('resolveCheck1Status: truncated mismatch downgrades divergence → gap', () => {
  const r = resolveCheck1Status({
    subgraphOpen: 5,
    subgraphConsumed: 2,
    analyticsOpen: 3,
    analyticsConsumed: 4,
    analyticsIngested: 7,
    analyticsRawRowCount: 7,
    subgraphRowCount: 7,
    analyticsSkippedOutOfWindow: 0,
    truncated: true,
  });
  assert.equal(r.status, 'gap');
  assert.equal(r.reason, 'mismatch-but-truncated');
});

test('resolveCheck1Status: untruncated mismatch → divergence', () => {
  const r = resolveCheck1Status({
    subgraphOpen: 5,
    subgraphConsumed: 2,
    analyticsOpen: 4,
    analyticsConsumed: 3,
    analyticsIngested: 7,
    analyticsRawRowCount: 7,
    subgraphRowCount: 7,
    analyticsSkippedOutOfWindow: 0,
    truncated: false,
  });
  assert.equal(r.status, 'divergence');
  assert.equal(r.reason, 'open-mismatch');
});

test('resolveCheck1Status: both feeds empty → vacuous', () => {
  const r = resolveCheck1Status({
    subgraphOpen: 0,
    subgraphConsumed: 0,
    analyticsOpen: 0,
    analyticsConsumed: 0,
    analyticsIngested: 0,
    analyticsRawRowCount: 0,
    subgraphRowCount: 0,
    analyticsSkippedOutOfWindow: 0,
    truncated: false,
  });
  assert.equal(r.status, 'vacuous');
  assert.equal(r.reason, 'no-rows-either-side');
});

test('resolveCheck1Status: analytics raw non-empty but ingested=0 → gap (round-2 regression)', () => {
  // Reviewer's reproduction: 500 rows with unparseable requested_at, the
  // window/ts gate drops all 500, ingested=0, open=0. Subgraph quiet in
  // the same window (open=0). Old branch would PASS. Must now GAP.
  const r = resolveCheck1Status({
    subgraphOpen: 0,
    subgraphConsumed: 0,
    analyticsOpen: 0,
    analyticsConsumed: 0,
    analyticsIngested: 0,
    analyticsRawRowCount: 500,
    subgraphRowCount: 0,
    analyticsSkippedOutOfWindow: 500,
    truncated: false,
  });
  assert.equal(r.status, 'gap');
  assert.equal(r.reason, 'analytics-ingested-zero');
});

test('resolveCheck1Status: analytics dropped >50% of raw via out-of-window → gap (partial degradation)', () => {
  // Between total failure and healthy: half the raw feed gets dropped
  // by the ts gate. We can't trust the open count as representative.
  // Ratio threshold guard should escalate to gap.
  const r = resolveCheck1Status({
    subgraphOpen: 5,
    analyticsOpen: 5,
    analyticsIngested: 4,
    analyticsRawRowCount: 10,
    subgraphRowCount: 7,
    analyticsSkippedOutOfWindow: 6, // 6/10 = 60% > 50%
    analyticsSkippedMissingKey: 0,
    analyticsSkippedInvalid: 0,
    truncated: false,
  });
  assert.equal(r.status, 'gap');
  assert.equal(r.reason, 'analytics-attrition-majority');
});

test('resolveCheck1Status: skip ratio at threshold is not enough to trigger gap', () => {
  // Boundary check: SKIP_RATIO_THRESHOLD is strict-greater-than (`>`).
  // Exactly at the threshold is not a gap — otherwise flapping around
  // the boundary would produce inconsistent verdicts.
  assert.equal(SKIP_RATIO_THRESHOLD, 0.5);
  const r = resolveCheck1Status({
    subgraphOpen: 5,
    analyticsOpen: 5,
    analyticsIngested: 5,
    analyticsRawRowCount: 10,
    subgraphRowCount: 7,
    analyticsSkippedOutOfWindow: 5, // 5/10 = exactly 0.5
    analyticsSkippedMissingKey: 0,
    analyticsSkippedInvalid: 0,
    truncated: false,
  });
  assert.equal(r.status, 'pass');
});

test('resolveCheck1Status: majority of analytics feed lost via missing-key → gap (round-3 widened numerator)', () => {
  // Ojus's round-3 repro (comment 3736451382): 5000 raw rows, 4999 lose
  // `requester` to a schema drift and land in `skippedMissingKey`, one
  // survivor matches the subgraph's single row. Old numerator counted
  // only `skippedOutOfWindow` → 0/5000 → ratio guard didn't fire → open
  // matched → PASS on a feed that lost 99.98% of its rows. Widened
  // numerator must escalate to gap.
  const r = resolveCheck1Status({
    subgraphOpen: 1,
    analyticsOpen: 1,
    analyticsIngested: 1,
    analyticsRawRowCount: 5000,
    subgraphRowCount: 1,
    analyticsSkippedOutOfWindow: 0,
    analyticsSkippedMissingKey: 4999,
    analyticsSkippedInvalid: 0,
    truncated: false,
  });
  assert.equal(r.status, 'gap');
  assert.equal(r.reason, 'analytics-attrition-majority');
});

test('resolveCheck1Status: majority of analytics feed lost via invalid → gap (widened numerator, predict-api regression)', () => {
  // Sibling of the missing-key case: predict-api starts mis-classifying
  // rows as `resolution_status = 'invalid'` on most of the feed. Landing
  // entirely in `skippedInvalid` was invisible to the round-2 numerator.
  const r = resolveCheck1Status({
    subgraphOpen: 1,
    analyticsOpen: 1,
    analyticsIngested: 1,
    analyticsRawRowCount: 100,
    subgraphRowCount: 1,
    analyticsSkippedOutOfWindow: 0,
    analyticsSkippedMissingKey: 0,
    analyticsSkippedInvalid: 60,
    truncated: false,
  });
  assert.equal(r.status, 'gap');
  assert.equal(r.reason, 'analytics-attrition-majority');
});

test('resolveCheck1Status: duplicates alone do NOT trigger the attrition guard (healthy re-serves)', () => {
  // docs/mech-analytics-migration.md:79-84 — the API re-serves the same
  // row on every sweep touch, so `skippedDuplicate` is expected on any
  // window with resolution-sweep activity. Including it in the numerator
  // would fire the guard on perfectly healthy data. Guard the invariant
  // structurally: the function does not accept a `analyticsSkippedDuplicate`
  // parameter, so a future change that pipes it in is a signature-level
  // breakage this call site would surface immediately. The runtime check
  // below asserts a 90-duplicate window with no non-duplicate attrition
  // stays pass.
  const r = resolveCheck1Status({
    subgraphOpen: 3,
    analyticsOpen: 3,
    analyticsIngested: 10,
    analyticsRawRowCount: 100,
    subgraphRowCount: 3,
    analyticsSkippedOutOfWindow: 0,
    analyticsSkippedMissingKey: 0,
    analyticsSkippedInvalid: 0,
    truncated: false,
  });
  assert.equal(r.status, 'pass');
});

test('resolveCheck1Status: subgraph ingested 0 rows from non-empty raw → gap (round-3 subgraph guard)', () => {
  // Ojus's round-3 comment 3736451400 — mirror of the analytics zero-
  // ingest guard. `fetchMarketplaceRequests` returns rows === [] after
  // filtering missing sender/title/ts or past-window-end, but the raw
  // page had entries. Without this branch it looks like a quiet window
  // (subgraphRowCount === 0 but subgraphRawRowCount > 0 falls through
  // to open-mismatch or exact-match depending on the analytics side).
  // Analytics side kept healthy so the analytics guards don't fire first.
  const r = resolveCheck1Status({
    subgraphOpen: 0,
    analyticsOpen: 0,
    analyticsIngested: 5,
    analyticsRawRowCount: 5,
    subgraphRowCount: 0,
    subgraphRawRowCount: 500,
    subgraphSkippedMissingKey: 500,
    subgraphSkippedAfterWindowEnd: 0,
    analyticsSkippedOutOfWindow: 0,
    analyticsSkippedMissingKey: 0,
    analyticsSkippedInvalid: 0,
    truncated: false,
  });
  assert.equal(r.status, 'gap');
  assert.equal(r.reason, 'subgraph-ingested-zero');
});

test('resolveCheck1Status: majority of subgraph feed lost via missing-key → gap (round-3 subgraph guard)', () => {
  // The subgraph side sibling of `analytics-attrition-majority`.
  // `sender.id` (or `parsedRequest.questionTitle`) going missing on
  // most `Request` entities lands entirely in `skippedMissingKey` and
  // would otherwise present as a smaller `subgraphRowCount`,
  // structurally indistinguishable from a genuinely quiet window.
  const r = resolveCheck1Status({
    subgraphOpen: 1,
    analyticsOpen: 1,
    analyticsIngested: 100,
    analyticsRawRowCount: 100,
    subgraphRowCount: 1,
    subgraphRawRowCount: 100,
    subgraphSkippedMissingKey: 60, // 60/100 = 60% > 50%
    subgraphSkippedAfterWindowEnd: 0,
    analyticsSkippedOutOfWindow: 0,
    analyticsSkippedMissingKey: 0,
    analyticsSkippedInvalid: 0,
    truncated: false,
  });
  assert.equal(r.status, 'gap');
  assert.equal(r.reason, 'subgraph-attrition-majority');
});

// ---------------------------------------------------------------------------
// resolveCheck2Status — extracted row-parity downgrade
// ---------------------------------------------------------------------------

test('resolveCheck2Status: zero diffs, not truncated → pass', () => {
  const r = resolveCheck2Status({
    subgraphRowCount: 10,
    analyticsRowCount: 10,
    missingInAnalytics: 0,
    extraInAnalytics: 0,
    truncated: false,
  });
  assert.equal(r.status, 'pass');
  assert.equal(r.reason, 'exact-match');
});

test('resolveCheck2Status: zero diffs BUT truncated → gap (match-but-truncated)', () => {
  const r = resolveCheck2Status({
    subgraphRowCount: 10,
    analyticsRowCount: 10,
    missingInAnalytics: 0,
    extraInAnalytics: 0,
    truncated: true,
  });
  assert.equal(r.status, 'gap');
  assert.equal(r.reason, 'match-but-truncated');
});

test('resolveCheck2Status: non-zero diffs BUT truncated → gap not divergence', () => {
  const r = resolveCheck2Status({
    subgraphRowCount: 10,
    analyticsRowCount: 8,
    missingInAnalytics: 2,
    extraInAnalytics: 0,
    truncated: true,
  });
  assert.equal(r.status, 'gap');
  assert.equal(r.reason, 'mismatch-but-truncated');
});

test('resolveCheck2Status: non-zero diffs, not truncated → divergence', () => {
  const r = resolveCheck2Status({
    subgraphRowCount: 10,
    analyticsRowCount: 8,
    missingInAnalytics: 2,
    extraInAnalytics: 0,
    truncated: false,
  });
  assert.equal(r.status, 'divergence');
  assert.equal(r.reason, 'row-set-mismatch');
});

test('resolveCheck2Status: both empty → vacuous', () => {
  const r = resolveCheck2Status({
    subgraphRowCount: 0,
    analyticsRowCount: 0,
    missingInAnalytics: 0,
    extraInAnalytics: 0,
    truncated: false,
  });
  assert.equal(r.status, 'vacuous');
});

// ---------------------------------------------------------------------------
// End-to-end reproduction of the round-2 zero-ingest regression
// ---------------------------------------------------------------------------

test('E2E round-2 regression: 500 unparseable rows + quiet subgraph must be GAP not PASS', () => {
  // Ojus's exact scenario: mech-analytics ETL contract drift produces
  // 500 scored rows with unparseable requested_at. The ts gate drops
  // all 500 → ingested=0 → open=0. Subgraph is quiet in the same
  // window (no marketplace rows). Old check-1 branch would emit
  // "PASS: open-market counts match exactly (0)" and exit 0. This test
  // wires computeAnalyticsOpenCount to resolveCheck1Status the same
  // way parity.mjs does and asserts the pipeline lands on `gap`.
  const rows = Array.from({ length: 500 }, (_, i) => ({
    request_id: `r${i}`,
    requester: '0xa',
    question_title: 'q',
    resolution_status: 'pending',
    requested_at: 'not a valid date at all', // Date.parse → NaN → ts NaN → skipped
    market_id: null,
  }));
  const windowStartSec = Math.floor(Date.parse('2026-07-01T00:00:00Z') / 1000);
  const analyticsOpen = computeAnalyticsOpenCount(rows, [], windowStartSec);
  // Precondition: exactly the ETL-drift shape the reviewer described.
  assert.equal(analyticsOpen.ingested, 0);
  assert.equal(analyticsOpen.open, 0);
  assert.equal(analyticsOpen.skippedOutOfWindow, 500);
  const subgraphOpen = { open: 0, consumed: 0 };
  const decision = resolveCheck1Status({
    subgraphOpen: subgraphOpen.open,
    subgraphConsumed: subgraphOpen.consumed,
    analyticsOpen: analyticsOpen.open,
    analyticsConsumed: analyticsOpen.consumed,
    analyticsIngested: analyticsOpen.ingested,
    analyticsRawRowCount: rows.length, // 500 raw rows in
    subgraphRowCount: 0,
    analyticsSkippedOutOfWindow: analyticsOpen.skippedOutOfWindow,
    truncated: false,
  });
  assert.equal(decision.status, 'gap');
  assert.equal(decision.reason, 'analytics-ingested-zero');
});

