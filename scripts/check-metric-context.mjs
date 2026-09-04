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
 * Run with `yarn metric-context:check` after `next build`.
 */

/* eslint-disable no-console, no-undef -- standalone build script */

import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

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
 * Removes every element whose opening tag matches `isTarget`, along with its contents.
 *
 * A plain non-greedy `</span>` match stops at the first nested close tag, which silently
 * under-reports — it is how an earlier review nearly shipped "0 focusable links" when
 * there were five. So walk the tags and count depth.
 */
const stripElements = (html, isTarget) => {
  const out = [];
  const tag = /<(\/?)([a-zA-Z][\w-]*)[^>]*?>/g;
  let cursor = 0;
  let depth = 0;
  let match;

  while ((match = tag.exec(html)) !== null) {
    const [raw, closing, name] = match;
    const isVoid = VOID_ELEMENTS.has(name.toLowerCase()) || raw.endsWith('/>');

    if (depth === 0) {
      if (!closing && isTarget(raw)) {
        out.push(html.slice(cursor, match.index));
        if (!isVoid) depth = 1;
        cursor = tag.lastIndex;
      }
      continue;
    }

    if (closing) {
      depth -= 1;
      if (depth === 0) cursor = tag.lastIndex;
    } else if (!isVoid) {
      depth += 1;
    }
  }

  out.push(html.slice(cursor));
  return out.join(' ');
};

/** The class list of an opening tag, so `sr-only` is matched as a whole token. */
const classesOf = (raw) => raw.match(/\sclass="([^"]*)"/)?.[1]?.split(/\s+/) ?? [];

const stripSrOnly = (html) => stripElements(html, (raw) => classesOf(raw).includes('sr-only'));

/**
 * Drops the all-states duplicates.
 *
 * Those blocks deliberately describe selector states the page is not currently showing —
 * a BabyDegen metric while Predict is selected, say — so their labels have no visible
 * counterpart by definition, and requiring one would make the check unsatisfiable. They
 * are also generated from the same descriptor list as the visible tiles, so the drift
 * this script exists to catch cannot happen inside them.
 */
const stripAriaHidden = (html) => stripElements(html, (raw) => /aria-hidden="true"/.test(raw));

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
    const body = stripScripts(await readFile(file, 'utf8'));
    // Only the sentences describing what is currently on screen are checkable.
    const onScreen = stripAriaHidden(body);
    const found = [...onScreen.matchAll(ECHO)];
    skipped += [...body.matchAll(ECHO)].length - found.length;
    if (found.length === 0) continue;

    pagesWithContext += 1;
    const visible = visibleText(body);
    const page = path.relative(PAGES_DIR, file).replace(/\\/g, '/');

    // Guard against the failure that already fooled this script once: the depth counter
    // got stuck inside an element and ate the rest of the document, so the only text left
    // was the hidden sentences themselves — every label then "matched" itself and a
    // deliberately drifted one passed. The hidden layer is a small fraction of any page,
    // so a strip that removes most of the markup is a broken walk, not a real result.
    // (Compare markup, not extracted text: the Explorer heatmap is legitimately ~350KB of
    // tags carrying under 1KB of words.)
    const keptMarkup = stripSrOnly(body).length;
    if (keptMarkup < body.length / 2) {
      console.error(
        `\nStripping sr-only elements removed ${body.length - keptMarkup} of ${body.length} chars of ${page}.` +
          '\nThe HTML walk is broken — fix it rather than trusting this run.'
      );
      process.exit(1);
    }

    if (verbose) {
      console.log(`  ${page}: ${found.length} echo(es)`);
    }

    for (const [, label] of found) {
      echoes += 1;
      const matched = visible.includes(normalise(label));
      if (verbose) console.log(`    ${matched ? 'ok  ' : 'MISS'} "${label}"`);
      if (!matched) {
        failures.push({ page, label });
      }
    }
  }

  console.log(
    `Checked ${echoes} label echo(es) across ${pagesWithContext} page(s) of ${files.length} built` +
      `${skipped > 0 ? `, and skipped ${skipped} in aria-hidden all-states blocks` : ''}.`
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

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
