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
 * Strips every `sr-only` element and its contents.
 *
 * A plain non-greedy `</span>` match stops at the first nested close tag, which silently
 * under-reports — it is how an earlier review nearly shipped "0 focusable links" when
 * there were five. So walk the tags and count depth.
 */
const stripSrOnly = (html) => {
  const out = [];
  const tag = /<(\/?)(\w+)[^>]*?>/g;
  let cursor = 0;
  let depth = 0;
  let match;

  while ((match = tag.exec(html)) !== null) {
    const [raw, closing, name] = match;
    if (depth === 0) {
      const isSrOnly = !closing && /class="[^"]*\bsr-only\b/.test(raw);
      if (isSrOnly) {
        out.push(html.slice(cursor, match.index));
        // Self-closing or void elements carry no children to skip.
        if (!raw.endsWith('/>')) depth = 1;
        cursor = tag.lastIndex;
      }
      continue;
    }
    if (name === 'span' || depth > 0) {
      if (closing) {
        depth -= 1;
        if (depth === 0) cursor = tag.lastIndex;
      } else if (!raw.endsWith('/>')) {
        depth += 1;
      }
    }
  }
  out.push(html.slice(cursor));
  return out.join(' ');
};

/** Visible text only: hidden layer removed, tags and scripts dropped. */
const visibleText = (html) =>
  normalise(
    stripSrOnly(html)
      .replace(/<script[\s\S]*?<\/script>/g, ' ')
      .replace(/<style[\s\S]*?<\/style>/g, ' ')
      .replace(/<[^>]+>/g, ' ')
  );

const main = async () => {
  const files = await collectHtmlFiles(PAGES_DIR);
  if (files.length === 0) {
    console.error(`No built pages under ${PAGES_DIR}. Run \`next build\` first.`);
    process.exit(1);
  }

  const failures = [];
  let echoes = 0;
  let pagesWithContext = 0;

  for (const file of files) {
    const html = await readFile(file, 'utf8');
    const found = [...html.matchAll(ECHO)];
    if (found.length === 0) continue;

    pagesWithContext += 1;
    const visible = visibleText(html);
    const page = path.relative(PAGES_DIR, file).replace(/\\/g, '/');

    for (const [, label] of found) {
      echoes += 1;
      if (!visible.includes(normalise(label))) {
        failures.push({ page, label });
      }
    }
  }

  console.log(
    `Checked ${echoes} label echo(es) across ${pagesWithContext} page(s) of ${files.length} built.`
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
