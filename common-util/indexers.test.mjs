import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  MARKETPLACE_SUBGRAPH_URLS,
  MARKETPLACE_SQUID_URLS,
  MARKETPLACE_SETTLEMENT_WALK_CHAINS,
  REGISTRY_SUBGRAPH_URLS,
  REGISTRY_SQUID_URLS,
} from './indexers.ts';

test('Base and Polygon use exactly one Marketplace backend without changing registry routing', () => {
  for (const chain of ['base', 'polygon']) {
    assert.ok(chain in MARKETPLACE_SQUID_URLS);
    assert.ok(!(chain in MARKETPLACE_SUBGRAPH_URLS));
  }
  assert.ok('base' in REGISTRY_SQUID_URLS);
  assert.ok('polygon' in REGISTRY_SUBGRAPH_URLS);
  assert.ok(!MARKETPLACE_SETTLEMENT_WALK_CHAINS.includes('polygon'));
});
