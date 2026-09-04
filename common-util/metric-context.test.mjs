#!/usr/bin/env node
/**
 * Unit tests for the sentences published to the machine-readable text layer.
 * Uses Node's built-in test runner with type-stripping to load the .ts module directly —
 * no new devDependencies, no build step. Run with `yarn metric-context:test`.
 *
 * This layer exists to stop a number being quoted without its scope. The failure mode is
 * silent: a wrong sentence renders identically to a right one, because nothing here is
 * visible on screen. So the cases worth pinning are the ones where a sentence would be
 * *misleading* rather than merely ugly:
 *   - a placeholder or non-numeric value must emit nothing, not "-- transactions",
 *   - a held-over value must say so, and must be distinguished from one that never had a
 *     confirmed reading at all,
 *   - lag must not be reported as a freeze (a live-but-behind figure is still today's),
 *   - the visible label must be echoed verbatim, which is what ties this text to the tile.
 *
 * The label echo is also checked against the built HTML by
 * `scripts/check-metric-context.mjs`, which reads the real pages rather than these fixtures.
 */

/* eslint-disable no-undef -- standalone test module: uses JS built-in globals */

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { buildMetricContext, formatFullNumber } from './metric-context.ts';

/** 13 August 2025 14:00 UTC — fixed so the formatted stamp is assertable. */
const AS_OF = 1_755_093_600_000;
const AS_OF_TEXT = '13 August 2025 14:00 UTC';

const base = { value: 1000, noun: 'agent transactions' };

test('formatFullNumber never abbreviates', () => {
  assert.equal(formatFullNumber(4_254_952), '4,254,952');
  assert.equal(formatFullNumber(14_523_741), '14,523,741');
});

test('formatFullNumber reformats strings that arrive pre-stringified', () => {
  // Snapshots mix numbers and strings, and some callers pass a value that has already
  // been through `toLocaleString`. Both must come out identically formatted.
  assert.equal(formatFullNumber('14523741'), '14,523,741');
  assert.equal(formatFullNumber('14,523,741'), '14,523,741');
  assert.equal(formatFullNumber('$108,506.07', { isMoney: true }), '$108,506.07');
});

test('formatFullNumber pads cents only when there is a fraction', () => {
  assert.equal(formatFullNumber(645.3, { isMoney: true }), '$645.30');
  assert.equal(formatFullNumber(100, { isMoney: true }), '$100');
});

test('formatFullNumber appends a unit', () => {
  assert.equal(formatFullNumber(28_405, { unit: 'OLAS' }), '28,405 OLAS');
});

test('formatFullNumber rejects non-numeric input', () => {
  for (const value of ['--', '', 'N/A', Number.NaN, Infinity]) {
    assert.equal(formatFullNumber(value), null, `expected null for ${String(value)}`);
  }
});

test('a complete metric reads as one self-contained sentence', () => {
  // Retrieval shows passages out of context, so every clause has to survive on its own.
  assert.equal(
    buildMetricContext({
      value: 4_254_952,
      noun: 'transactions by Olas agents',
      label: 'Transactions',
      scope: 'across all supported chains',
      window: 'all time',
      status: { lastValidAt: AS_OF },
    }),
    `4,254,952 transactions by Olas agents (shown as "Transactions"), across all supported chains, all time, as of ${AS_OF_TEXT}.`
  );
});

test('the visible label is echoed verbatim', () => {
  // The whole point of the echo: rename the tile and the sentence follows, instead of
  // going stale silently the way "Partial ROI" did while this work was in review.
  const sentence = buildMetricContext({ ...base, label: 'Trading ROI - Average' });
  assert.match(sentence, /\(shown as "Trading ROI - Average"\)/);
});

test('an absent label leaves no empty parenthetical', () => {
  const sentence = buildMetricContext(base);
  assert.ok(!sentence.includes('('), `unexpected parenthetical: ${sentence}`);
  assert.equal(sentence, '1,000 agent transactions.');
});

test('optional clauses are omitted rather than left blank', () => {
  assert.equal(
    buildMetricContext({ ...base, window: 'all time' }),
    '1,000 agent transactions, all time.'
  );
});

test('nothing is emitted for a value the page does not publish', () => {
  // "-- agent transactions" would assert a number the tile is not showing.
  for (const value of [null, undefined, '', '--', 'N/A']) {
    assert.equal(
      buildMetricContext({ ...base, value }),
      null,
      `expected no sentence for ${JSON.stringify(value)}`
    );
  }
});

test('an already-suffixed value passes through unformatted', () => {
  assert.equal(
    buildMetricContext({ ...base, value: '69%', noun: 'prediction accuracy' }),
    '69% prediction accuracy.'
  );
});

test('a date is never invented', () => {
  const sentence = buildMetricContext({ ...base, status: {}, asOfFallback: null });
  assert.ok(!sentence.includes('as of'), sentence);
});

test('a lagging source falls back to the snapshot timestamp', () => {
  // `lastValidAt` is null while a source merely lags, but the snapshot itself is dated.
  const sentence = buildMetricContext({
    ...base,
    status: { stale: true, laggingSubgraphs: ['gnosis'] },
    asOfFallback: AS_OF,
  });
  assert.ok(sentence.includes(`as of ${AS_OF_TEXT}`), sentence);
});

test('lag is reported as a possible undercount, not as a freeze', () => {
  // Lag must not read as "unavailable": the figure is this run's live data.
  const sentence = buildMetricContext({
    ...base,
    status: { stale: true, laggingSubgraphs: ['gnosis'] },
    asOfFallback: AS_OF,
  });
  assert.match(sentence, /may undercount/);
  assert.ok(!sentence.includes('last confirmed value'), sentence);
});

test('a held-over value says it is held over and dates the value itself', () => {
  const sentence = buildMetricContext({
    ...base,
    status: { stale: true, frozen: true, lastValidAt: AS_OF, fetchErrors: ['base'] },
  });
  assert.match(sentence, /last confirmed value/);
  assert.ok(sentence.includes(`as of ${AS_OF_TEXT}`), sentence);
});

test('a frozen value with no prior reading is called incomplete', () => {
  // The third state, which `isFrozen` alone conflates with the one above: there is no
  // earlier confirmed value, so the timestamp dates the failed refresh, not the number.
  const sentence = buildMetricContext({
    ...base,
    status: { stale: true, frozen: true, fetchErrors: ['base'] },
    asOfFallback: AS_OF,
  });
  assert.match(sentence, /reading is incomplete/);
  assert.ok(!sentence.includes('last confirmed value'), sentence);
});

test('the incomplete caveat does not point at a date that is not there', () => {
  // With no `lastValidAt` and no fallback the sentence carries no date, so "the date
  // above" would send a reader looking for something the text does not contain.
  const sentence = buildMetricContext({
    ...base,
    status: { stale: true, frozen: true, fetchErrors: ['base'] },
    asOfFallback: null,
  });
  assert.match(sentence, /reading is incomplete/);
  assert.ok(!sentence.includes('date above'), sentence);
});

test('a healthy metric carries no caveat', () => {
  const sentence = buildMetricContext({ ...base, status: { lastValidAt: AS_OF } });
  assert.equal(sentence, `1,000 agent transactions, as of ${AS_OF_TEXT}.`);
});
