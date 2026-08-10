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
  assert.deepEqual(fetchErrors, ['registry:celo:missingGlobal']);
});

test('readGlobalField: a present entity missing the field is also an error', () => {
  const fetchErrors = [];
  assert.equal(readGlobalField({}, 'txCount', 'registry:celo', fetchErrors), null);
  assert.deepEqual(fetchErrors, ['registry:celo:missingGlobal']);
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
