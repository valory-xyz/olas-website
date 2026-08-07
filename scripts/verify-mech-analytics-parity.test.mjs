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
  computeSubgraphOpenCount,
  computeAnalyticsOpenCount,
  classifyAnalyticsRows,
  diffRowSets,
  pickSubgraphSenderTotal,
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

test('computeWindow: trailing default when neither since nor until is given', () => {
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
  assert.equal(w.windowStartSec, nowSec - 4 * 86400);
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

test('computeWindow: trailing window rejects lag buffer that consumes the whole window', () => {
  const nowSec = 1_800_000_000;
  assert.throws(
    () =>
      computeWindow({
        since: null,
        until: null,
        nowSec,
        windowDays: 1,
        lagBufferMinutes: 60 * 24 + 1, // > 1 day
      }),
    /lag buffer consumes the whole window/
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
  assert.equal(counts.pending_with_market, 1);
  assert.equal(counts.no_market_id, 1);
  assert.equal(counts.invalid, 1);
  assert.equal(counts.resolved, 1);
  assert.equal(counts.skipped_missing_key, 2);
  assert.equal(usable.length, 4); // rows with requester+title survive the key check
});

// ---------------------------------------------------------------------------
// computeAnalyticsOpenCount / computeSubgraphOpenCount — the check 1 fix
// ---------------------------------------------------------------------------

test('computeAnalyticsOpenCount: does NOT filter on market_id (check 1 gate bug regression)', () => {
  // The pre-fix version gated on rows with market_id IS NOT NULL, which
  // dropped ~99% of legitimate chain-100 rows because market_id is a
  // recently-added column. The consumer (mech-analytics.ts) doesn't
  // filter on market_id at all — it filters only on invalid and
  // missing requester/title. Force the shape of that bug into the input
  // and confirm the rows without market_id still enter QMR.
  const usable = [
    { requester: '0xa', row: { requester: '0xa', question_title: 'q1', resolution_status: 'pending', market_id: null } },
    { requester: '0xa', row: { requester: '0xa', question_title: 'q2', resolution_status: 'pending', market_id: null } },
    { requester: '0xb', row: { requester: '0xb', question_title: 'q3', resolution_status: 'invalid', market_id: null } },
  ];
  const result = computeAnalyticsOpenCount(usable, [], 'question');
  // Two pending rows without market_id: both count as open. One invalid: skipped.
  assert.equal(result.ingested, 2);
  assert.equal(result.skippedInvalid, 1);
  assert.equal(result.consumed, 0);
  assert.equal(result.open, 2);
});

test('computeAnalyticsOpenCount: settlement consumes matching (title, agent) via normalizeTitle', () => {
  const usable = [
    { requester: '0xagent1', row: { requester: '0xagent1', question_title: 'Will BTC hit $100k by 2026?', resolution_status: 'pending', market_id: null } },
    { requester: '0xagent1', row: { requester: '0xagent1', question_title: 'Will BTC hit $100k by 2026?', resolution_status: 'pending', market_id: null } },
    { requester: '0xagent2', row: { requester: '0xagent2', question_title: 'Will ETH hit 10k?', resolution_status: 'pending', market_id: null } },
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
  const result = computeAnalyticsOpenCount(usable, dailyStats, 'question');
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
  const usable = requests.map(({ requester, title }) => ({
    requester,
    row: { requester, question_title: title, resolution_status: 'pending', market_id: null },
  }));
  const dailyStats = [
    { traderAgent: { id: '0xagent2' }, profitParticipants: [{ question: 'market b' }] },
  ];
  const sub = computeSubgraphOpenCount(requests, dailyStats, 'question');
  const ana = computeAnalyticsOpenCount(usable, dailyStats, 'question');
  assert.equal(sub.open, ana.open);
  assert.equal(sub.consumed, ana.consumed);
});

test('computeAnalyticsOpenCount: handles polymarket metadata.title participant field', () => {
  const usable = [
    { requester: '0xagent1', row: { requester: '0xagent1', question_title: 'Market X', resolution_status: 'pending', market_id: null } },
  ];
  const dailyStats = [
    { traderAgent: { id: '0xagent1' }, profitParticipants: [{ metadata: { title: 'market x' } }] },
  ];
  const result = computeAnalyticsOpenCount(usable, dailyStats, 'metadata.title');
  assert.equal(result.consumed, 1);
  assert.equal(result.open, 0);
});

test('computeAnalyticsOpenCount: does not consume across agents (per-agent QMR)', () => {
  // A dailyStat from agent2 must not consume agent1's open rows even
  // if the titles match — this mirrors roi-distribution.ts's per-agent
  // consumption (each agent's stats consume only their own entries).
  const usable = [
    { requester: '0xagent1', row: { requester: '0xagent1', question_title: 'Market Z', resolution_status: 'pending', market_id: null } },
  ];
  const dailyStats = [
    { traderAgent: { id: '0xagent2' }, profitParticipants: [{ question: 'market z' }] },
  ];
  const result = computeAnalyticsOpenCount(usable, dailyStats, 'question');
  assert.equal(result.consumed, 0);
  assert.equal(result.open, 1);
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
