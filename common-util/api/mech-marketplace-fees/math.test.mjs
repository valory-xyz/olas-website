#!/usr/bin/env node
/**
 * Unit tests for the pure "fees collected" helpers. Uses Node's built-in test runner
 * with type-stripping to load the .ts module directly. Run with `yarn mech-fees-math:test`.
 *
 * These decide the published protocol-fee number: how a subgraph row becomes a drained
 * total, how un-drained + drained is valued, and when a lower reading is refused.
 */

/* eslint-disable no-undef -- standalone test module: uses JS built-in globals */

import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  findDecreasedToken,
  isSaneFeesUsd,
  MAX_MARKETPLACE_FEES_USD,
  parseRawUnits,
  toDrainedByModel,
  trackerFees,
} from './math.ts';

test('parseRawUnits reads a BigDecimal raw amount as integer units', () => {
  assert.equal(parseRawUnits('1575'), 1575n);
  assert.equal(parseRawUnits('1575.0'), 1575n);
  assert.equal(parseRawUnits('0'), 0n);
  assert.equal(parseRawUnits(''), 0n);
});

test('toDrainedByModel keys rows by payment model', () => {
  const byModel = toDrainedByModel([
    { id: 'native', totalDrainedRaw: '1575', totalDrainedUSD: '0.0000000000027856074645' },
    { id: 'token-usdc', totalDrainedRaw: '5000000', totalDrainedUSD: '5' },
  ]);
  assert.deepEqual(byModel, {
    native: { raw: 1575n, usd: 0.0000000000027856074645 },
    'token-usdc': { raw: 5000000n, usd: 5 },
  });
});

test('toDrainedByModel returns no models for an empty or missing collection', () => {
  assert.deepEqual(toDrainedByModel([]), {});
  assert.deepEqual(toDrainedByModel(null), {});
  assert.deepEqual(toDrainedByModel(undefined), {});
});

test('USD-pegged tracker: amount equals usd, drained is added to both', () => {
  const fees = trackerFees(100_000_000n, 6, 1, { raw: 5_000_000n, usd: 5 });
  assert.deepEqual(fees, { amount: 105, usd: 105 });
});

test('priced tracker: un-drained valued at the current price, drained at drain-time usd', () => {
  // 0.00015 ETH un-drained at $2,500 = $0.375; 0.00001 ETH drained, booked at $20 then.
  const fees = trackerFees(150_000_000_000_000n, 18, 2500, { raw: 10_000_000_000_000n, usd: 20 });
  assert.equal(fees.amount, 0.00016);
  assert.equal(fees.usd, 20.375);
});

test('no drained totals defaults to zero', () => {
  assert.deepEqual(trackerFees(0n, 18, 2500), { amount: 0, usd: 0 });
});

test('isSaneFeesUsd rejects negative, non-finite and absurd totals', () => {
  assert.equal(isSaneFeesUsd(788.49), true);
  assert.equal(isSaneFeesUsd(0), true);
  assert.equal(isSaneFeesUsd(-1), false);
  assert.equal(isSaneFeesUsd(NaN), false);
  assert.equal(isSaneFeesUsd(Infinity), false);
  assert.equal(isSaneFeesUsd(MAX_MARKETPLACE_FEES_USD + 1), false);
});

test('findDecreasedToken flags a token whose lifetime amount fell', () => {
  const previous = { xDAI: 685.9455, USDC: 102.171, ETH: 0.00015 };
  assert.equal(findDecreasedToken(previous, { xDAI: 0, USDC: 102.171, ETH: 0.00015 }), 'xDAI');
  assert.equal(findDecreasedToken(previous, { xDAI: 685.9455, USDC: 100, ETH: 0.00015 }), 'USDC');
});

test('findDecreasedToken accepts growth, equality, new tokens and float noise', () => {
  const previous = { xDAI: 685.9455, USDC: 102.171 };
  assert.equal(findDecreasedToken(previous, { xDAI: 700, USDC: 102.171, POL: 1 }), null);
  assert.equal(findDecreasedToken(previous, { xDAI: 685.9455, USDC: 102.171 }), null);
  assert.equal(
    findDecreasedToken(previous, { xDAI: 685.9455 * (1 - 1e-12), USDC: 102.171 }),
    null
  );
});

test('findDecreasedToken ignores tokens missing from the new reading and a missing previous', () => {
  assert.equal(findDecreasedToken({ xDAI: 685.9455 }, { USDC: 1 }), null);
  assert.equal(findDecreasedToken(null, { xDAI: 1 }), null);
  assert.equal(findDecreasedToken(undefined, { xDAI: 1 }), null);
});
