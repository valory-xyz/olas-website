#!/usr/bin/env node
/**
 * Unit tests for the pure ROI accounting helpers. Uses Node's built-in test runner
 * with type-stripping to load the .ts module directly — no new devDependencies, no
 * build step. Run with `yarn roi-math:test`.
 *
 * These formulas decide the published Predict ROI numbers, and every rule they
 * encode shipped wrong at least once (docs/predict-roi-accounting.md, History):
 * redemption-basis payouts booked as losses, mech requests double-counted, and a
 * rebuild that wiped windowed mech cost. The cases below pin the corrected rules.
 */

/* eslint-disable no-undef -- standalone test module: uses JS built-in globals */

import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  roiPercent,
  allTimeNetGainAndCosts,
  windowedNetGainAndCosts,
  senderLifetimeRequests,
  mergeQmr,
  isLowMechAttribution,
  MIN_MECH_FEE_BPS,
} from './roi-math.ts';

const MECH_FEE = 10n ** 16n; // 0.01, DEFAULT_MECH_FEE in constants.ts

// --- roiPercent -----------------------------------------------------------------------

test('roiPercent: 2-decimal precision, sign preserved', () => {
  assert.equal(roiPercent(1234n, 10000n), 12.34);
  assert.equal(roiPercent(-747n, 10000n), -7.47);
});

// --- allTimeNetGainAndCosts -----------------------------------------------------------

test('allTimeNetGainAndCosts: mech fees enter both the numerator and the denominator', () => {
  const { netGain, totalCosts } = allTimeNetGainAndCosts({
    payout: 150n * 10n ** 18n,
    tradingCosts: 100n * 10n ** 18n,
    mechRequests: 500, // × 0.01 = 5e18
    mechFeeWei: MECH_FEE,
  });
  assert.equal(totalCosts, 105n * 10n ** 18n);
  assert.equal(netGain, 45n * 10n ** 18n);
});

test('allTimeNetGainAndCosts: zero requests degrades to payout − tradingCosts', () => {
  const { netGain, totalCosts } = allTimeNetGainAndCosts({
    payout: 90n,
    tradingCosts: 100n,
    mechRequests: 0,
    mechFeeWei: MECH_FEE,
  });
  assert.equal(totalCosts, 100n);
  assert.equal(netGain, -10n);
});

// --- windowedNetGainAndCosts ----------------------------------------------------------

test('windowedNetGainAndCosts: polystrat (scale 1e12, feesSettled 0) reproduces traded * scale', () => {
  const scale = 10n ** 12n;
  const tradedSettled = 92_700_000n; // 92.7 USDC in 1e6
  const profit = 5_000_000n;
  const mechRequests = 580;
  const { netGain, totalCosts } = windowedNetGainAndCosts({
    profit,
    tradedSettled,
    feesSettled: 0n,
    mechRequests,
    scale,
    mechFeeWei: MECH_FEE,
  });
  // The pre-refactor polystrat formula: costs = traded * scale (no fee term).
  const mechFees = BigInt(mechRequests) * MECH_FEE;
  assert.equal(totalCosts, tradedSettled * scale + mechFees);
  assert.equal(netGain, profit * scale - mechFees);
});

test('windowedNetGainAndCosts: omenstrat (scale 1) reproduces traded + fees', () => {
  const tradedSettled = 2_796n * 10n ** 18n; // xDAI, already 1e18
  const feesSettled = 55n * 10n ** 18n;
  const profit = -100n * 10n ** 18n;
  const mechRequests = 5511;
  const { netGain, totalCosts } = windowedNetGainAndCosts({
    profit,
    tradedSettled,
    feesSettled,
    mechRequests,
    scale: 1n,
    mechFeeWei: MECH_FEE,
  });
  // The pre-refactor omenstrat formula: costs = traded + fees.
  const mechFees = BigInt(mechRequests) * MECH_FEE;
  assert.equal(totalCosts, tradedSettled + feesSettled + mechFees);
  assert.equal(netGain, profit - mechFees);
});

// --- senderLifetimeRequests -----------------------------------------------------------

test('senderLifetimeRequests: totalLegacyRequests alone — never summed with its own subset', () => {
  const sender = { totalLegacyRequests: '42', totalMarketplaceRequests: '30' };
  assert.equal(senderLifetimeRequests(sender), 42);
});

// --- mergeQmr -------------------------------------------------------------------------

const qmr = (list) => ({ title: { agent: [...list] } });

test('mergeQmr: rebuild — each stored copy absorbs one incoming copy (keeps max, not sum)', () => {
  const { merged, added } = mergeQmr(qmr([100]), qmr([100, 100]), true);
  assert.deepEqual(merged.title.agent, [100, 100]);
  assert.equal(added, 1);
});

test('mergeQmr: rebuild — stored copies beyond the incoming count survive', () => {
  const { merged, added } = mergeQmr(qmr([100, 100]), qmr([100]), true);
  assert.deepEqual(merged.title.agent, [100, 100]);
  assert.equal(added, 0);
});

test('mergeQmr: incremental — two distinct same-second requests must both count', () => {
  const { merged, added } = mergeQmr(qmr([100]), qmr([100]), false);
  assert.deepEqual(merged.title.agent, [100, 100]);
  assert.equal(added, 1);
});

test('mergeQmr: new titles and agents are created, lists come back sorted', () => {
  const existing = { known: { a: [300] } };
  const { merged, added } = mergeQmr(
    existing,
    { known: { a: [100], b: [200] }, fresh: { c: [50] } },
    false
  );
  assert.deepEqual(merged.known.a, [100, 300]);
  assert.deepEqual(merged.known.b, [200]);
  assert.deepEqual(merged.fresh.c, [50]);
  assert.equal(added, 3);
});

// --- isLowMechAttribution -------------------------------------------------------------

// Figures from the threshold derivation in docs/predict-roi-accounting.md:
// 92.7 USDC settled over the week, lifted from 1e6 to 1e18.
const WEEK_SETTLED = 92_700_000n * 10n ** 12n;

test('isLowMechAttribution: healthy Polystrat week (~630bps) is not low', () => {
  assert.equal(
    isLowMechAttribution({ mechRequests: 580, settledCosts: WEEK_SETTLED, mechFeeWei: MECH_FEE }),
    false
  );
});

test('isLowMechAttribution: the 2026-08 incident trickle (~16bps) fires the alarm', () => {
  assert.equal(
    isLowMechAttribution({ mechRequests: 15, settledCosts: WEEK_SETTLED, mechFeeWei: MECH_FEE }),
    true
  );
});

test('isLowMechAttribution: no settled volume means no signal, even at zero requests', () => {
  assert.equal(
    isLowMechAttribution({ mechRequests: 0, settledCosts: 0n, mechFeeWei: MECH_FEE }),
    false
  );
});

test('isLowMechAttribution: threshold boundary — exactly MIN_MECH_FEE_BPS is not low', () => {
  // Pick settledCosts so mechFees land exactly on the threshold: 1 request × fee
  // at 50bps of costs → costs = fee × 10000 / 50.
  const settledCosts = (MECH_FEE * 10000n) / MIN_MECH_FEE_BPS;
  assert.equal(
    isLowMechAttribution({ mechRequests: 1, settledCosts, mechFeeWei: MECH_FEE }),
    false
  );
  assert.equal(
    isLowMechAttribution({
      mechRequests: 1,
      settledCosts: settledCosts + 1n,
      mechFeeWei: MECH_FEE,
    }),
    true
  );
});
