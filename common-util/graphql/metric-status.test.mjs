#!/usr/bin/env node
/**
 * Unit tests for the pure metric-status helpers. Uses Node's built-in test runner with
 * type-stripping to load the .ts module directly — no new devDependencies, no build step.
 * Run with `yarn metric-status:test`.
 *
 * These helpers decide which number every metric on the public dashboard publishes, and
 * whether it renders as live or held-over. Two behaviours in particular are easy to
 * regress by "simplifying" the condition, and both shipped as bugs before:
 *   - lag alone must NOT fall back (that froze the homepage for days), and
 *   - a hard error MUST fall back (publishing a partial sum understated the totals).
 * The matrix below is the PR's verification table, executed rather than eyeballed.
 */

/* eslint-disable no-undef -- standalone test module: uses JS built-in globals */

import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  hasHardError,
  isFrozen,
  readGlobalField,
  resolveMergedMetric,
  mergeSnapshotTree,
} from './metric-status.ts';

const NOW = 1_700_000_000_000;
const OLD_VALID_AT = 1_600_000_000_000;

const status = (over = {}) => ({
  stale: false,
  lastValidAt: null,
  indexingErrors: [],
  fetchErrors: [],
  laggingSubgraphs: [],
  ...over,
});

const oldMetric = { value: 'OLD', status: status({ stale: true, lastValidAt: OLD_VALID_AT }) };

// --- hasHardError ---------------------------------------------------------------------

test('hasHardError: false for clean and for lag-only', () => {
  assert.equal(hasHardError(status()), false);
  assert.equal(hasHardError(status({ laggingSubgraphs: ['registry:celo'] })), false);
});

test('hasHardError: true for fetch or indexing errors', () => {
  assert.equal(hasHardError(status({ fetchErrors: ['mechFees:gnosis'] })), true);
  assert.equal(hasHardError(status({ indexingErrors: ['registry:base'] })), true);
});

test('hasHardError: tolerates missing status and missing arrays', () => {
  assert.equal(hasHardError(undefined), false);
  assert.equal(hasHardError(null), false);
  assert.equal(hasHardError({}), false);
});

// --- isFrozen -------------------------------------------------------------------------

test('isFrozen: prefers the explicit flag when present', () => {
  assert.equal(isFrozen(status({ frozen: true })), true);
  // Lag-only but explicitly not frozen — the case that must render live, not greyed.
  assert.equal(isFrozen(status({ frozen: false, laggingSubgraphs: ['registry:celo'] })), false);
});

test('isFrozen: derives from error arrays for snapshots written before `frozen` existed', () => {
  assert.equal(isFrozen(status({ fetchErrors: ['x'] })), true);
  assert.equal(isFrozen(status({ laggingSubgraphs: ['registry:celo'] })), false);
});

// --- readGlobalField ------------------------------------------------------------------

test('readGlobalField: returns the value and records nothing when present', () => {
  const fetchErrors = [];
  assert.equal(readGlobalField({ txCount: '42' }, 'txCount', 'registry:gnosis', fetchErrors), '42');
  assert.deepEqual(fetchErrors, []);
});

test('readGlobalField: a null entity is an error, not a zero', () => {
  const fetchErrors = [];
  assert.equal(readGlobalField(null, 'txCount', 'registry:celo', fetchErrors), null);
  assert.deepEqual(fetchErrors, ['registry:celo:missing:txCount']);
});

test('readGlobalField: a present entity missing the field is also an error', () => {
  const fetchErrors = [];
  assert.equal(readGlobalField({}, 'txCount', 'registry:celo', fetchErrors), null);
  assert.deepEqual(fetchErrors, ['registry:celo:missing:txCount']);
});

test('readGlobalField: a real zero is a value, not an absence', () => {
  const fetchErrors = [];
  assert.equal(readGlobalField({ txCount: 0 }, 'txCount', 'registry:mode', fetchErrors), 0);
  assert.equal(readGlobalField({ txCount: '' }, 'txCount', 'registry:mode', fetchErrors), '');
  assert.deepEqual(fetchErrors, []);
});

// --- resolveMergedMetric: the PR verification matrix ----------------------------------

const cases = [
  {
    name: 'clean -> publishes new, not stale, not frozen',
    next: { value: 'NEW', status: status() },
    expect: { value: 'NEW', stale: false, frozen: false, lastValidAt: NOW },
  },
  {
    name: 'lag only -> publishes NEW while still flagged stale',
    next: {
      value: 'NEW',
      status: status({ stale: true, laggingSubgraphs: ['registry:celo'] }),
    },
    expect: { value: 'NEW', stale: true, frozen: false, lastValidAt: NOW },
  },
  {
    name: 'fetch error -> holds OLD',
    next: { value: 'NEW', status: status({ stale: true, fetchErrors: ['mechFees:gnosis'] }) },
    expect: { value: 'OLD', stale: true, frozen: true, lastValidAt: OLD_VALID_AT },
  },
  {
    name: 'indexing error -> holds OLD',
    next: { value: 'NEW', status: status({ stale: true, indexingErrors: ['registry:base'] }) },
    expect: { value: 'OLD', stale: true, frozen: true, lastValidAt: OLD_VALID_AT },
  },
  {
    name: 'nil value -> holds OLD even with no recorded error',
    next: { value: null, status: status() },
    expect: { value: 'OLD', stale: true, frozen: true, lastValidAt: OLD_VALID_AT },
  },
];

for (const { name, next, expect } of cases) {
  test(`resolveMergedMetric: ${name}`, () => {
    const merged = resolveMergedMetric(next, oldMetric, NOW);
    assert.equal(merged.value, expect.value);
    assert.equal(merged.status.stale, expect.stale);
    assert.equal(merged.status.frozen, expect.frozen);
    assert.equal(merged.status.lastValidAt, expect.lastValidAt);
  });
}

test('resolveMergedMetric: lag-only keeps advancing rather than ageing', () => {
  // The regression that motivated the change: repeated lagging runs must keep publishing
  // the newest reading, not pin the first one forever.
  let merged = resolveMergedMetric(
    { value: 1, status: status({ stale: true, laggingSubgraphs: ['registry:celo'] }) },
    oldMetric,
    NOW
  );
  merged = resolveMergedMetric(
    { value: 2, status: status({ stale: true, laggingSubgraphs: ['registry:celo'] }) },
    merged,
    NOW + 3600_000
  );
  assert.equal(merged.value, 2);
  assert.equal(merged.status.lastValidAt, NOW + 3600_000);
});

test('resolveMergedMetric: no usable fallback keeps the new metric and flags it frozen', () => {
  const merged = resolveMergedMetric({ value: null, status: status() }, null, NOW);
  assert.equal(merged.value, null);
  assert.equal(merged.status.stale, true);
  assert.equal(merged.status.frozen, true);
});

test('resolveMergedMetric: an old nil value is not a usable fallback', () => {
  const merged = resolveMergedMetric(
    { value: null, status: status({ fetchErrors: ['x'] }) },
    { value: null, status: status({ lastValidAt: OLD_VALID_AT }) },
    NOW
  );
  assert.equal(merged.value, null);
  assert.equal(merged.status.frozen, true);
});

test('readGlobalField: two absent fields on one source stay distinguishable', () => {
  // A bare `${source}:missingGlobal` produced duplicate, field-less entries here, which
  // rendered as "Affected Sources: mechFees:gnosis:missingGlobal, mechFees:gnosis:missingGlobal".
  const fetchErrors = [];
  readGlobalField(null, 'totalFeesInUSD', 'mechFees:gnosis', fetchErrors);
  readGlobalField(null, 'totalFeesOutUSD', 'mechFees:gnosis', fetchErrors);
  assert.deepEqual(fetchErrors, [
    'mechFees:gnosis:missing:totalFeesInUSD',
    'mechFees:gnosis:missing:totalFeesOutUSD',
  ]);
});

test('isFrozen: true when frozen with empty error arrays (transform returned null)', () => {
  // The build.ts / govern.ts path: resolveMergedMetric freezes on the nil value alone, so
  // a local `hardErrors.length > 0` in the tooltip would disagree with the grey-out.
  const merged = resolveMergedMetric(
    { value: null, status: status() },
    { value: 42, status: status({ lastValidAt: OLD_VALID_AT }) },
    NOW
  );
  assert.equal(merged.status.frozen, true);
  assert.deepEqual(merged.status.fetchErrors, []);
  assert.equal(hasHardError(merged.status), false);
  assert.equal(isFrozen(merged.status), true);
});

// --- mergeSnapshotTree ----------------------------------------------------------------

test('mergeSnapshotTree: applies the leaf decision at nested metric leaves', () => {
  const merged = mergeSnapshotTree(
    { a: { b: { value: null, status: status({ fetchErrors: ['x'] }) } } },
    { a: { b: { value: 'OLD', status: status({ lastValidAt: OLD_VALID_AT }) } } },
    NOW
  );
  assert.equal(merged.a.b.value, 'OLD');
  assert.equal(merged.a.b.status.frozen, true);
});

test('mergeSnapshotTree: carries forward keys absent from the new fetch', () => {
  const merged = mergeSnapshotTree({ kept: 1 }, { kept: 0, dropped: 'from-old' }, NOW);
  assert.equal(merged.kept, 1);
  assert.equal(merged.dropped, 'from-old');
});

test('mergeSnapshotTree: passes primitives and nulls through untouched', () => {
  assert.equal(mergeSnapshotTree(5, 9, NOW), 5);
  assert.equal(mergeSnapshotTree(null, 'old', NOW), null);
  assert.equal(mergeSnapshotTree('s', 'old', NOW), 's');
});

test('mergeSnapshotTree: returns arrays as-is rather than pairing by index', () => {
  // Index pairing is meaningless for the ordered series these snapshots hold, and would
  // carry stale keys from the old array's objects into the new one.
  const next = [{ x: 1 }, { x: 2 }];
  assert.deepEqual(mergeSnapshotTree(next, [{ x: 9, stale: 'leak' }, { x: 8 }], NOW), next);
});

test('mergeSnapshotTree: warns when metrics are nested in an array (no fallback applied)', () => {
  const warnings = [];
  const original = console.warn;
  console.warn = (m) => warnings.push(m);
  try {
    mergeSnapshotTree(
      { series: [{ value: null, status: status({ fetchErrors: ['x'] }) }] },
      { series: [{ value: 'OLD', status: status() }] },
      NOW
    );
  } finally {
    console.warn = original;
  }
  assert.equal(warnings.length, 1);
  assert.match(warnings[0], /series/);
});

test('mergeSnapshotTree: a per-chain metric record freezes failed chains independently', () => {
  // The polByChain shape: a plain record of MetricWithStatus leaves. One chain's hard
  // failure must hold that chain's last-good value alone — the others publish live.
  const merged = mergeSnapshotTree(
    {
      polByChain: {
        gnosis: { value: null, status: status({ stale: true, fetchErrors: ['liquidity:gnosis'] }) },
        base: { value: 127162, status: status() },
      },
    },
    {
      polByChain: {
        gnosis: { value: 273628, status: status({ lastValidAt: OLD_VALID_AT }) },
        base: { value: 100000, status: status({ lastValidAt: OLD_VALID_AT }) },
      },
    },
    NOW
  );
  assert.equal(merged.polByChain.gnosis.value, 273628);
  assert.equal(merged.polByChain.gnosis.status.frozen, true);
  assert.equal(merged.polByChain.base.value, 127162);
  assert.equal(merged.polByChain.base.status.frozen, false);
});

test('mergeSnapshotTree: a per-chain record absent from the old snapshot publishes fresh', () => {
  const merged = mergeSnapshotTree(
    { polByChain: { gnosis: { value: 273628, status: status() } } },
    { totalProtocolOwnedLiquidity: { value: 1, status: status() } },
    NOW
  );
  assert.equal(merged.polByChain.gnosis.value, 273628);
  assert.equal(merged.polByChain.gnosis.status.frozen, false);
});

test('mergeSnapshotTree: a metric gaining a new sibling keeps both', () => {
  const merged = mergeSnapshotTree(
    { a: { value: 1, status: status() }, b: { value: 2, status: status() } },
    { a: { value: 0, status: status() } },
    NOW
  );
  assert.equal(merged.a.value, 1);
  assert.equal(merged.b.value, 2);
});
