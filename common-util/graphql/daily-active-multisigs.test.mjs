#!/usr/bin/env node
/**
 * Unit tests for the daily active multisigs squid fold. Uses Node's built-in test runner
 * with type-stripping to load the .ts module directly. Run with
 * `yarn daily-active-multisigs:test`.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  dailyActiveMultisigsDays,
  toDailyActiveMultisigsCollection,
} from './daily-active-multisigs.ts';

const DAY = 86400;
const TODAY = 1793491200; // a midnight UTC

test('dailyActiveMultisigsDays lists the 7 days strictly inside the window, newest first', () => {
  const days = dailyActiveMultisigsDays(TODAY - 8 * DAY, TODAY);
  assert.deepEqual(
    days,
    [1, 2, 3, 4, 5, 6, 7].map((n) => TODAY - n * DAY)
  );
});

test('squid aliases fold newest first and drop days with no row', () => {
  const meta = { hasIndexingErrors: false, block: { number: 10 } };
  const result = toDailyActiveMultisigsCollection({
    [`day_${TODAY - 3 * DAY}`]: { id: `day-${TODAY - 3 * DAY}`, count: 3 },
    [`day_${TODAY - DAY}`]: { id: `day-${TODAY - DAY}`, count: 1 },
    [`day_${TODAY - 2 * DAY}`]: null,
    _meta: meta,
  });
  assert.deepEqual(result, {
    _meta: meta,
    dailyActiveMultisigs_collection: [
      { id: `day-${TODAY - DAY}`, count: 1 },
      { id: `day-${TODAY - 3 * DAY}`, count: 3 },
    ],
  });
});

test('subgraph responses pass through untouched', () => {
  const subgraph = {
    dailyActiveMultisigs_collection: [{ id: '1', count: 5 }],
    _meta: { hasIndexingErrors: false, block: { number: 1 } },
  };
  assert.equal(toDailyActiveMultisigsCollection(subgraph), subgraph);
});
