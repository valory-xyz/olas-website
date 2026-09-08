#!/usr/bin/env node
/**
 * Post-build check: every hidden metric sentence must still name a label the page
 * actually shows.
 *
 * `MetricContext` echoes the visible label into its screen-reader-only sentence as
 * `(shown as "…")`. That echo is the only thing tying the two together — nothing else
 * fails when a tile is renamed, because the hidden text is invisible by construction.
 * "Partial ROI" became "Trading ROI" mid-review and the hidden copy kept the old name
 * for a week; this script is what would have caught it.
 *
 * It reads the built HTML rather than the source, so it checks what a crawler is
 * actually served, including pages assembled from props at build time.
 *
 * Runs in `postbuild`, so every Vercel build checks it. Warning-only when a build has no
 * echoes at all (an unreachable metrics blob renders every tile as `--`), so a blob
 * outage does not block a deploy; pass `--require-echoes` to make that fatal too.
 */

/* eslint-disable no-console, no-undef -- standalone build script */

import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

const PAGES_DIR = path.join(process.cwd(), '.next', 'server', 'pages');

/**
 * Every `(shown as "…")` echo emitted by `buildMetricContext`. React escapes the quotes
 * in a text node, so the served markup reads `&quot;` — match both forms rather than
 * decoding the whole document, which would turn `&lt;` back into real tags.
 */
const ECHO = /\(shown as (?:&quot;|")(.*?)(?:&quot;|")\)/g;

const collectHtmlFiles = async (dir) => {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const files = await Promise.all(
    entries.map((entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return collectHtmlFiles(full);
      return entry.name.endsWith('.html') ? [full] : [];
    })
  );
  return files.flat();
};

const decodeEntities = (text) =>
  text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#x2F;/g, '/');

const normalise = (text) => decodeEntities(text).replace(/\s+/g, ' ').trim();

/**
 * Elements with no closing tag, which must not be counted as opening a subtree.
 * React serialises these as `<img/>`, but not every one of them, so match by name.
 */
const VOID_ELEMENTS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]);

/**
 * The `[start, end)` range of every element whose opening tag matches `isTarget`.
 *
 * A plain non-greedy `</span>` match stops at the first nested close tag, which silently
 * under-reports — it is how an earlier review nearly shipped "0 focusable links" when
 * there were five. So walk the tags and count depth.
 */
const elementRanges = (html, isTarget) => {
  const ranges = [];
  const tag = /<(\/?)([a-zA-Z][\w-]*)[^>]*?>/g;
  let start = -1;
  let depth = 0;
  let match;

  while ((match = tag.exec(html)) !== null) {
    const [raw, closing, name] = match;
    const isVoid = VOID_ELEMENTS.has(name.toLowerCase()) || raw.endsWith('/>');

    if (depth === 0) {
      if (!closing && isTarget(raw)) {
        start = match.index;
        if (isVoid) ranges.push([start, tag.lastIndex]);
        else depth = 1;
      }
      continue;
    }

    if (closing) {
      depth -= 1;
      if (depth === 0) ranges.push([start, tag.lastIndex]);
    } else if (!isVoid) {
      depth += 1;
    }
  }

  return ranges;
};

/** Removes every element whose opening tag matches `isTarget`, along with its contents. */
const stripElements = (html, isTarget) => {
  const kept = [];
  let cursor = 0;
  for (const [start, end] of elementRanges(html, isTarget)) {
    kept.push(html.slice(cursor, start));
    cursor = end;
  }
  kept.push(html.slice(cursor));
  return kept.join(' ');
};

/** The class list of an opening tag, so `sr-only` is matched as a whole token. */
const classesOf = (raw) => raw.match(/\sclass="([^"]*)"/)?.[1]?.split(/\s+/) ?? [];

const stripSrOnly = (html) => stripElements(html, (raw) => classesOf(raw).includes('sr-only'));

/**
 * Drops the off-screen selector-state mirrors, which mark themselves with
 * `data-selector-states="off-screen"`.
 *
 * Those blocks deliberately describe states the page is not currently showing — a
 * BabyDegen metric while Predict is selected, say — so their labels have no visible
 * counterpart by definition, and requiring one would make the check unsatisfiable. They
 * are generated from the same descriptor lists as the visible tiles, so the drift this
 * script exists to catch cannot happen inside them.
 */
const stripOffScreenStates = (html) =>
  stripElements(html, (raw) => /data-selector-states="off-screen"/.test(raw));

/**
 * Drops `<script>` and `<style>` blocks.
 *
 * Must run *before* any tag walking: the Next.js data payload is JSON containing angle
 * brackets, which the tag regex reads as unbalanced opening tags. That left the depth
 * counter permanently inside a subtree and silently swallowed 53KB of a 56KB page — the
 * check then passed on a deliberately drifted label because the only text left was the
 * hidden sentence itself.
 */
const stripScripts = (html) =>
  html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ');

/** Visible text only: the hidden layer removed, then tags dropped. */
const visibleText = (body) => normalise(stripSrOnly(body).replace(/<[^>]+>/g, ' '));

/**
 * How much visible text around an echo counts as "beside it".
 *
 * Searching the whole page would pass a drifted label whose old name happens to appear in
 * unrelated body copy — "Traders", "Operators" and "Prediction Accuracy" are all ordinary
 * words on these pages. A window keeps the match local without assuming the tile is
 * immediately above: `MetricContext` renders beside its tile, but the Explorer and
 * homepage summaries are page-level blocks whose tiles sit some way further down.
 *
 * Both directions for the same reason. This is a heuristic — it narrows the haystack, it
 * does not prove the label belongs to that tile.
 */
const LABEL_PROXIMITY_CHARS = 1500;

/** Above this share of a page's markup, the hidden layer is a broken walk, not a mirror. */
const MAX_HIDDEN_MARKUP_SHARE = 0.8;

/**
 * The visible text either side of the hidden element containing `index`.
 *
 * Cutting at the echo itself is what made an earlier version of this check useless:
 * the opening `sr-only` tag lands in the prefix, so the suffix is no longer recognisable
 * as hidden, and it *begins* with the hidden copy of the label — every label then matched
 * itself and a deliberately drifted one passed. Skip the whole enclosing element instead.
 */
const visibleTextAround = (body, index) => {
  const hidden = elementRanges(body, (raw) => classesOf(raw).includes('sr-only')).find(
    ([start, end]) => index >= start && index < end
  );
  // An echo always sits inside an `sr-only` element; if that stops being true, fail the
  // page rather than silently searching text that includes the sentence itself.
  if (!hidden) return null;

  const [start, end] = hidden;
  return `${visibleText(body.slice(0, start)).slice(-LABEL_PROXIMITY_CHARS)} ${visibleText(
    body.slice(end)
  ).slice(0, LABEL_PROXIMITY_CHARS)}`;
};

/**
 * Checks one page's markup. Exported so the fixtures in `check-metric-context.test.mjs`
 * can exercise it directly — every bug this script has had was in here, and each looked
 * exactly like a clean run.
 */
export const checkPage = (html) => {
  const body = stripScripts(html);
  // Only the sentences describing what is currently on screen are checkable.
  const onScreen = stripOffScreenStates(body);
  const found = [...onScreen.matchAll(ECHO)];
  const skipped = [...body.matchAll(ECHO)].length - found.length;

  // Guard against the failure that already fooled this script once: the depth counter got
  // stuck inside an element and ate the rest of the document, so the only text left was
  // the hidden sentences themselves — every label then "matched" itself and a deliberately
  // drifted one passed.
  //
  // The threshold is deliberately loose. The runaway case removed 95% of the page; the
  // largest legitimate hidden layer (Predict, with all eight selector states) is under
  // 40%, and this runs in `postbuild`, so a tight bound would eventually block a deploy
  // for adding states rather than for a bug. Compare markup, not extracted text: the
  // Explorer heatmap is legitimately ~350KB of tags carrying under 1KB of words.
  const keptMarkup = stripSrOnly(body).length;
  const brokenWalk =
    found.length > 0 && keptMarkup < body.length * (1 - MAX_HIDDEN_MARKUP_SHARE)
      ? `Stripping sr-only elements removed ${body.length - keptMarkup} of ${body.length} chars`
      : null;

  const echoes = found.map((match) => {
    const label = match[1];
    const nearby = visibleTextAround(onScreen, match.index);
    return { label, matched: nearby !== null && nearby.includes(normalise(label)) };
  });

  return { echoes, skipped, brokenWalk };
};

const main = async () => {
  const files = await collectHtmlFiles(PAGES_DIR);
  if (files.length === 0) {
    console.error(`No built pages under ${PAGES_DIR}. Run \`next build\` first.`);
    process.exit(1);
  }

  const verbose = process.argv.includes('--verbose');
  const failures = [];
  let echoes = 0;
  let skipped = 0;
  let pagesWithContext = 0;

  for (const file of files) {
    const html = await readFile(file, 'utf8');
    const page = path.relative(PAGES_DIR, file).replace(/\\/g, '/');
    const result = checkPage(html);

    skipped += result.skipped;
    if (result.echoes.length === 0) continue;
    pagesWithContext += 1;

    if (result.brokenWalk) {
      console.error(`
${result.brokenWalk} on ${page}.`);
      console.error('The HTML walk is broken — fix it rather than trusting this run.');
      process.exit(1);
    }

    if (verbose) console.log(`  ${page}: ${result.echoes.length} echo(es)`);

    for (const { label, matched } of result.echoes) {
      echoes += 1;
      if (verbose) console.log(`    ${matched ? 'ok  ' : 'MISS'} "${label}"`);
      if (!matched) failures.push({ page, label });
    }
  }

  console.log(
    `Checked ${echoes} label echo(es) across ${pagesWithContext} page(s) of ${files.length} built` +
      `${skipped > 0 ? `, and skipped ${skipped} in off-screen selector-state blocks` : ''}.`
  );

  if (failures.length > 0) {
    console.error('\nHidden metric context names a label the page does not show:\n');
    for (const { page, label } of failures) {
      console.error(`  ${page}: "${label}"`);
    }
    console.error(
      '\nThe visible label was renamed but the `label` prop passed to <MetricContext> was not.'
    );
    process.exit(1);
  }

  // Zero echoes means the check passed vacuously, which reads identically to a clean run.
  // Only fatal when the caller asserts the build had data: on a build where the metrics
  // blob was unreachable every tile renders "--" and no sentence is emitted at all, which
  // is a snapshot problem rather than a drifted label.
  if (echoes === 0) {
    const message = 'No label echoes found at all. Is <MetricContext> still rendering?';
    if (process.argv.includes('--require-echoes')) {
      console.error(message);
      process.exit(1);
    }
    console.warn(`${message} (no metrics in this build — not treated as a failure)`);
    return;
  }

  console.log('All hidden metric context matches a visible label.');
};

// Only when invoked directly, so the test module can import `checkPage` without the
// script scanning `.next` and calling `process.exit`.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
