---
name: run-dev
description: Launch the olas-website Next.js dev server and verify changes visually (screenshots via browser). Use when asked to run the app, check a change in the browser, or screenshot a page.
---

# Run the olas-website dev server

## Node/yarn setup (required first)

`node`/`yarn` are NOT on PATH in non-interactive shells — Node is managed by
nvm, which only initializes in interactive shells. Load nvm and let it resolve
the version from the repo's `.nvmrc` (single source of truth — `nvm install`
installs it if missing, otherwise just switches to it):

```bash
source "$HOME/.nvm/nvm.sh" && nvm install
```

yarn (classic, `/usr/local/bin/yarn`) works once node is on PATH.

Note: shell state does not persist between Bash tool calls — re-source nvm in
each call that needs node/yarn, or chain commands with `&&` in one call.

## Launch

```bash
yarn dev   # run in background
```

- Next may not get port 3000 (it auto-falls back to 3001, 3002, …). Read the
  actual port from the dev-server output line `- Local: http://localhost:<port>`
  before navigating. If another process holds a port, it isn't ours — leave it.
- Ready in ~3s. Poll, don't sleep — and note macOS has no `timeout` command:

```bash
for i in $(seq 1 60); do curl -sf http://localhost:<port> >/dev/null && break; sleep 1; done
```

- `.env.local` exists in the repo root and is sufficient for local rendering.
  Homepage metrics come from Vercel Blob snapshots at build/ISR time, so pages
  render fine even if some subgraph env vars are missing.

## Stop

```bash
lsof -ti:<port> -sTCP:LISTEN | xargs -r kill
```

## Screenshots / driving the app

Pick a driver in this order:

1. **`chromium-cli`** if installed (`which chromium-cli`) — headless, no
   extension needed.
2. **claude-in-chrome** skill (Chrome extension MCP tools):
   `tabs_context_mcp` → `navigate` → `javascript_tool` to scroll → `computer`
   screenshot with `save_to_disk: true`. There is no upfront check for the
   extension — invoking the skill is the check: it fails (or walks through
   setup) when the extension isn't installed/connected. If that happens, tell
   the user they can install it from https://claude.ai/chrome, and fall back
   to option 3 meanwhile.
3. **Playwright fallback** (no extension, no chromium-cli): `npx playwright`
   with a one-off script — `chromium.launch()` → `page.goto(devUrl)` →
   `page.screenshot()`. First run downloads a browser
   (`npx playwright install chromium`), so prefer 1/2 when available.

Verification loop for whatever page the change touches:

1. Navigate to the route the diff affects (find it via the component's
   importer chain up to `pages/`; sections often have an `id` you can target).
2. Wait for the page to hydrate, then assert on the DOM with
   `javascript_tool` (element exists, href/text correct) — cheaper and more
   precise than eyeballing pixels.
3. Scroll the changed section into view and screenshot it. Actually look at
   the screenshot — a blank or stale frame is a failure.
4. Check `read_console_messages` with `onlyErrors: true` before declaring
   success.

## Gotchas (all hit in practice)

- **Stale images after replacing files in `public/`**: Next's image optimizer
  caches aggressively in dev. Fix: `rm -rf .next/cache/images`, then hard
  reload in the browser (`cmd+shift+r`). Production builds are unaffected.
- **Scroll resets after hydration**: the site enables the `scrollRestoration`
  experiment; a `scrollIntoView` right after load gets undone. Scroll again
  (or re-run the scroll JS) immediately before screenshotting.
- **First paint per route is slow** in dev (on-demand compile). Wait ~5s after
  first navigation to a route before asserting on the DOM.
