#!/usr/bin/env node
/**
 * Unit tests for the post-build label check.
 *
 * This script exists to catch a hidden sentence naming a label the page no longer shows.
 * Every bug it has had made it *pass* when it should have failed, and a check that passes
 * wrongly is indistinguishable from a clean run — so the cases below are the ones where
 * it previously reported `ok`:
 *
 *   - a drifted label matched *itself*, because the search window was cut at the echo and
 *     so began inside the very sentence being checked (reported by @ROMAN-VALORY),
 *   - a drifted label matched an unrelated mention elsewhere on the page, back when the
 *     search was page-wide.
 *
 * Run with `yarn metric-context:check:test`.
 */

/* eslint-disable no-undef -- standalone test module: uses JS built-in globals */

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { checkPage } from './check-metric-context.mjs';

/** A tile as React serialises it: visible label, value, then the hidden sentence. */
const tile = (visibleLabel, echoedLabel) => `
  <div class="tile">
    <span class="label">${visibleLabel}</span>
    <span class="value">28%</span>
    <span class="sr-only"> 28% average trading return on investment (shown as &quot;${echoedLabel}&quot;), over the last 7 days, as of 4 September 2026 14:00 UTC.</span>
  </div>`;

const page = (...body) => `<!doctype html><html><body><main>${body.join('')}</main></body></html>`;

test('a matching label passes', () => {
  const { echoes } = checkPage(page(tile('Trading ROI - Average', 'Trading ROI - Average')));
  assert.deepEqual(echoes, [{ label: 'Trading ROI - Average', matched: true }]);
});

test('a drifted label does not match itself', () => {
  // The regression: the window was cut at the echo, so its forward half began inside the
  // hidden sentence and always contained the label. This reported `ok "Partial ROI"`.
  const { echoes } = checkPage(page(tile('Trading ROI - Average', 'Partial ROI')));
  assert.deepEqual(echoes, [{ label: 'Partial ROI', matched: false }]);
});

test('a drifted label does not match an unrelated mention far away on the page', () => {
  // "Traders" and "Operators" are ordinary words in this copy, which is why the match has
  // to be local rather than page-wide.
  const filler = `<p>${'lorem ipsum dolor sit amet consectetur '.repeat(80)}</p>`;
  const { echoes } = checkPage(
    page('<p>Traders</p>', filler, tile('Mechs: Prediction Brokers', 'Traders'))
  );
  assert.deepEqual(echoes, [{ label: 'Traders', matched: false }]);
});

test('a label separated from its tile by ordinary copy still matches', () => {
  // The Explorer and homepage summaries are page-level blocks whose tiles sit further
  // down, so the window has to look forward as well as back.
  const { echoes } = checkPage(
    page(
      `<span class="sr-only"> 15 daily active agents (shown as &quot;Latest DAAs&quot;), as of 4 September 2026.</span>`,
      '<p>Some intervening prose about the heatmap below.</p>',
      '<div class="tile"><span>Latest DAAs</span><span>15</span></div>'
    )
  );
  assert.deepEqual(echoes, [{ label: 'Latest DAAs', matched: true }]);
});

test('off-screen selector states are skipped, not matched', () => {
  // Those blocks describe states the page is not rendering, so their labels have no
  // visible counterpart by definition.
  const result = checkPage(
    page(
      tile('Trading ROI - Average', 'Trading ROI - Average'),
      `<div class="sr-only" data-selector-states="off-screen">
         <table><caption>Polystrat performance over all time.</caption>
           <tbody><tr><th scope="row">Assets Under Management</th>
           <td>$13,775 assets under management (shown as &quot;Assets Under Management&quot;), on 4 September 2026.</td></tr></tbody>
         </table>
       </div>`
    )
  );
  assert.equal(result.skipped, 1);
  assert.deepEqual(result.echoes, [{ label: 'Trading ROI - Average', matched: true }]);
});

test('nested markup inside a hidden block does not truncate the strip', () => {
  // A non-greedy `</span>` match stops at the first nested close tag; the walk counts
  // depth instead. If it did not, the rest of the page would be swallowed.
  const { echoes, brokenWalk } = checkPage(
    page(
      `<div class="sr-only"><p><span>nested</span> <em>markup</em></p></div>`,
      `<p>${'visible copy '.repeat(60)}</p>`,
      tile('Prediction Accuracy', 'Prediction Accuracy')
    )
  );
  assert.equal(brokenWalk, null);
  assert.deepEqual(echoes, [{ label: 'Prediction Accuracy', matched: true }]);
});

test('a strip that swallows the page is reported rather than trusted', () => {
  // The runaway: the walk never left the first hidden element, so the only remaining text
  // was the hidden sentence, and the label matched itself.
  const { brokenWalk } = checkPage(
    page(
      `<div class="sr-only">${'swallowed markup '.repeat(200)}${tile('X', 'Y')}</div>`,
      '<p>tiny</p>'
    )
  );
  assert.match(brokenWalk ?? '', /Stripping sr-only elements removed/);
});

test('a page with no echoes reports nothing rather than failing', () => {
  const result = checkPage(page('<p>No metrics here.</p>'));
  assert.deepEqual(result.echoes, []);
  assert.equal(result.skipped, 0);
  assert.equal(result.brokenWalk, null);
});

test('script and style contents are not walked as markup', () => {
  // The Next.js data payload is JSON full of angle brackets. Walking it as tags left the
  // depth counter stuck inside an element and ate 53KB of a 56KB page.
  const { echoes, brokenWalk } = checkPage(
    page(
      `<script>self.__NEXT_DATA__ = {"html":"<div><span>"}</script>`,
      tile('Prediction Accuracy', 'Prediction Accuracy')
    )
  );
  assert.equal(brokenWalk, null);
  assert.deepEqual(echoes, [{ label: 'Prediction Accuracy', matched: true }]);
});
