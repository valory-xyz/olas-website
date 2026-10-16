#!/usr/bin/env node
/**
 * Unit tests for the Mech request split. Uses Node's built-in test runner with
 * type-stripping to load the .ts module directly. Run with `yarn mech-requests-math:test`.
 *
 * These decide the published request and delivery totals and the off-chain share: how a
 * chain's globals split into on-chain and settled off-chain counts, and when a reading is
 * refused instead of published.
 */

/* eslint-disable no-undef -- standalone test module: uses JS built-in globals */

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { offChainSharePercent, parseCount, splitChainRequests } from './mech-requests-math.ts';

// Optimism marketplace subgraph, 2026-10-14: the signed-delivery handler runs twice per
// event there, so the sender counters and the globals carry the off-chain part twice.
const OPTIMISM = {
  totalRequests: 9531,
  totalDeliveries: 9529,
  senderOffChain: 9154,
  offChain: 4577,
};

// Gnosis marketplace subgraph, same day: one data source, so sender sum equals event sum.
const GNOSIS = {
  totalRequests: 11932946,
  totalDeliveries: 10097014,
  senderOffChain: 24466,
  offChain: 24466,
};

test('splitChainRequests removes the whole off-chain part when the handler double-counts', () => {
  assert.deepEqual(splitChainRequests(OPTIMISM), {
    onChainRequests: 377,
    onChainDeliveries: 375,
    offChain: 4577,
  });
});

test('splitChainRequests leaves totals unchanged when counters match the event rows', () => {
  const split = splitChainRequests(GNOSIS);
  assert.deepEqual(split, {
    onChainRequests: 11908480,
    onChainDeliveries: 10072548,
    offChain: 24466,
  });
  assert.equal(split.onChainRequests + split.offChain, GNOSIS.totalRequests);
});

test('splitChainRequests reads a chain with no activity as zeros', () => {
  assert.deepEqual(
    splitChainRequests({ totalRequests: 0, totalDeliveries: 0, senderOffChain: 0, offChain: 0 }),
    { onChainRequests: 0, onChainDeliveries: 0, offChain: 0 }
  );
});

test('splitChainRequests refuses a sender total larger than either global', () => {
  assert.throws(
    () => splitChainRequests({ ...GNOSIS, totalDeliveries: GNOSIS.senderOffChain - 1 }),
    /exceeds the globals/
  );
  assert.throws(
    () => splitChainRequests({ ...GNOSIS, totalRequests: GNOSIS.senderOffChain - 1 }),
    /exceeds the globals/
  );
});

test('parseCount accepts subgraph BigInt strings and integers', () => {
  assert.equal(parseCount('4577'), 4577);
  assert.equal(parseCount('0'), 0);
  assert.equal(parseCount(12), 12);
});

test('parseCount rejects anything that is not a non-negative safe integer', () => {
  for (const raw of ['', ' ', '1.5', '-3', 'abc', '9007199254740993', -1, 2.5, NaN]) {
    assert.throws(() => parseCount(raw), /not a count/, `accepted ${String(raw)}`);
  }
});

test('offChainSharePercent divides by the on-chain plus off-chain total', () => {
  assert.equal(offChainSharePercent(4577, 377), (4577 / 4954) * 100);
  assert.equal(offChainSharePercent(0, 10), 0);
  assert.equal(offChainSharePercent(10, 0), 100);
});

test('offChainSharePercent is null when an input is missing or the total is zero', () => {
  assert.equal(offChainSharePercent(null, 10), null);
  assert.equal(offChainSharePercent(10, undefined), null);
  assert.equal(offChainSharePercent(0, 0), null);
});
