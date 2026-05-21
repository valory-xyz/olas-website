/* eslint-disable no-console */
/**
 * Injects a Content-Signal directive (https://contentsignals.org/) into the
 * robots.txt that `next-sitemap` generates. Runs as part of `postbuild` after
 * next-sitemap. Idempotent: re-running will not duplicate the line.
 *
 * Declares how AI crawlers may use the site's content. Update CONTENT_SIGNAL
 * if the policy stance changes.
 */
const fs = require('fs');
const path = require('path');

const CONTENT_SIGNAL = 'Content-Signal: search=yes, ai-train=yes, ai-input=yes';
const ROBOTS_PATH = path.join(__dirname, '..', 'public', 'robots.txt');

function injectContentSignal() {
  if (!fs.existsSync(ROBOTS_PATH)) {
    console.error(`[content-signal] robots.txt not found at ${ROBOTS_PATH}; run next-sitemap first.`);
    process.exit(1);
  }

  const robots = fs.readFileSync(ROBOTS_PATH, 'utf8');

  if (robots.includes('Content-Signal:')) {
    console.log('[content-signal] Content-Signal already present; skipping.');
    return;
  }

  const lines = robots.split('\n');
  const userAgentIndex = lines.findIndex((line) => /^User-agent:\s*\*/i.test(line.trim()));

  if (userAgentIndex === -1) {
    console.error('[content-signal] No "User-agent: *" group found in robots.txt.');
    process.exit(1);
  }

  // Insert the directive immediately after the `User-agent: *` line so it
  // applies to that group.
  lines.splice(userAgentIndex + 1, 0, CONTENT_SIGNAL);
  fs.writeFileSync(ROBOTS_PATH, lines.join('\n'));
  console.log('[content-signal] Injected Content-Signal directive into robots.txt.');
}

injectContentSignal();
