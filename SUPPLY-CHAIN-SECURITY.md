# Supply Chain Security

This document describes how `olas-website` protects itself against npm supply chain attacks — specifically, the scenario where a dependency (direct or transitive) is compromised and a malicious version is published.

It complements [`SECURITY.md`](./SECURITY.md), which covers reporting vulnerabilities in our own code.

## Threat model

The attacks we care about:

1. **Malicious publish** — a maintainer account is compromised (or a maintainer goes rogue) and a bad version of a legitimate package is published. Recent examples: `ua-parser-js` (2021), `node-ipc` protestware (2022), various `@ctrl/*` / `rspack`-related worms (2024–2025), the `shai-hulud` npm worm (2025).
2. **Typosquatting / dependency confusion** — a look-alike name is installed instead of the intended package.
3. **Postinstall script abuse** — a compromised package runs arbitrary code during `yarn install`, exfiltrating env vars or tokens from the build environment. Higher-impact here than on a static marketing site because olas-website has a meaningful server-side secret surface (see [§7](#7-secrets-hygiene-in-the-build-environment)).
4. **Transitive compromise** — a deep, rarely-audited dependency is the attack vector. The `web3` + Next.js + Radix tree is large.

## Policies

### 1. Exact version pinning in `package.json`

All direct dependencies in [`package.json`](./package.json) are pinned to **exact versions** — no `^`, no `~`, no `>=`, no floating major.

**Why:** `^` allows minor and patch updates; `~` allows patch updates. If a compromised patch is published and someone runs `yarn add <other-pkg>` or `yarn install` without a lockfile, the bad version can enter the tree silently. Exact pins make every version change an explicit, reviewable `package.json` diff.

**How to update a dependency:** bump the exact version in `package.json`, run `yarn install`, review the `yarn.lock` diff, and commit both files in the same PR. Never run `yarn upgrade` without pinning the result.

**Transitive overrides follow the same rule.** If a `"resolutions"` block is ever added to [`package.json`](./package.json), entries must use `"1.2.3"`, not `"^1.2.3"` or `">=1.2.3"`, so a compromised patch cannot silently enter the tree through an override. When adding a resolution to clear a CVE, reference the advisory in the PR/commit message so future readers understand why the override exists.

### 2. Single lockfile, treated as source of truth

[`yarn.lock`](./yarn.lock) is the canonical lockfile. The `packageManager` field in [`package.json`](./package.json) pins Yarn `1.22.22`; CI activates that version explicitly via `corepack enable` + `corepack prepare yarn@1.22.22 --activate` at the start of every Node job ([.github/workflows/main.yml](./.github/workflows/main.yml)), so installs don't fall back to whatever Yarn the runner happens to ship with. `package-lock.json` / `pnpm-lock.yaml` are in [`.gitignore`](./.gitignore) so a stray `npm install` / `pnpm install` can't land a second lockfile that conflicts with `yarn.lock`. CI and Vercel ([`vercel.json`](./vercel.json)) both install with `yarn install --frozen-lockfile`, which fails if `package.json` and `yarn.lock` disagree — catching any silent resolution drift at build time.

### 3. Lockfile review in PRs

Any PR that touches `yarn.lock` requires a reviewer to confirm:

- The diff is proportionate to the `package.json` change.
- No unexpected packages appear. Look for unfamiliar names, typos of known packages, or packages with very recent publish dates on high-traffic names.
- Resolved URLs point to the official registry (`registry.yarnpkg.com` / `registry.npmjs.org`), not a fork or mirror.

### 4. Cooldown window on updates

Prefer dependency versions that are **at least 7 days old**. Most malicious publishes are caught and unpublished within hours to days.

This is enforced by **manual discipline on every PR** — there is no Renovate or Dependabot bot on this repo. When a PR bumps a dependency, the reviewer checks `npm view <pkg> time` (or the npm page) and confirms the target version is at least 7 days old. If the bump is for a disclosed security advisory, the cooldown does not apply — note the advisory ID in the PR description so the override is auditable.

Vulnerability discovery does not depend on the 7-day rule. Already-disclosed CVEs are caught by the `yarn audit` job in [.github/workflows/main.yml](./.github/workflows/main.yml) on every PR (see [§5](#5-audit-in-ci)), and GitHub sends passive Dependabot alerts (Security tab / email) for advisories affecting our lockfile regardless of any repo configuration.

**Known gap:** the GitHub Actions in [.github/workflows/main.yml](./.github/workflows/main.yml) are SHA-pinned and will not receive updates (including security fixes) without a human bumping the SHA. Audit the pins periodically — at minimum once per major release of each action.

### 5. Audit in CI

Run `yarn audit --groups dependencies` on every PR, with high/critical gating enforced via exit-code bitmask rather than `--level` (see the "Yarn 1.x audit quirk" note below and the `audit` job in [.github/workflows/main.yml](./.github/workflows/main.yml)). A high/critical advisory against a production dependency blocks merge unless explicitly acknowledged. `--groups dependencies` restricts the audit to the production tree — `devDependencies` (ESLint / Babel / TypeScript / types) generate substantial transitive-advisory noise and do not ship to users, so they are excluded by policy.

We also run [`lockfile-lint`](https://github.com/lirantal/lockfile-lint) on every PR to enforce that every `resolved` URL in `yarn.lock` points at `registry.yarnpkg.com` or `registry.npmjs.org`, uses HTTPS, and has an integrity hash — automating the registry-origin part of [§3](#3-lockfile-review-in-prs). The tool itself is pinned as a `devDependency` in [`package.json`](./package.json) (currently `5.0.0`) and invoked via the `yarn lint:lockfile` script, so the `lockfile-lint` binary used in CI is integrity-verified against `yarn.lock` rather than re-fetched on every run.

**Yarn 1.x audit quirk.** This repo uses Yarn `1.22.22`. Yarn 1.x `yarn audit` exits with a severity bitmask (`1`=info, `2`=low, `4`=moderate, `8`=high, `16`=critical) rather than a threshold comparison against `--level`, so `--level high` filters the *printed* output but does not affect the exit code. The workflow handles this by checking `exit_code & 24` (i.e. `high | critical`) and failing only when that bit is set — see the `audit` job in [.github/workflows/main.yml](./.github/workflows/main.yml). Revisit on a future Yarn Berry migration, which ships `yarn npm audit` with proper severity gating and makes the bitmask dance unnecessary.

**Known backlog.** `yarn audit --groups dependencies` currently reports **4 high** advisories (0 critical), all of them gated on a single piece of work — a Next.js 14 → 15 migration:

- **`next` 14.2.35** — two Next.js Server Components DoS advisories (GHSA-h25m-26qc-wcjf, GHSA-q4gf-8mx6-v5v3). Both are patched only in Next `≥15.0.8` / `≥15.5.15`. There is no 14.x patch; the 14.2.x line is at its final release.
- **`undici`** (transitive via `next`) — two WebSocket advisories (GHSA-vrm6-8vpv-qv8q, GHSA-v9p9-hfj2-hcw8), patched in `≥6.24.0`. Yarn `resolutions` on `undici` conflict with Next 14's own requirement (`undici@^5.28.4`), so this cannot be cleared with a transitive override; it clears automatically when `next` upgrades.

Next 15 is a migration, not a patch: it requires React 19 (we're on React 18.2.0), makes dynamic-route `params` async, and reworks caching defaults. That work is tracked as a separate TODO below.

**Temporary warn-only mode.** To avoid blocking unrelated PRs while this backlog exists, the `audit` job in [.github/workflows/main.yml](./.github/workflows/main.yml) currently carries `continue-on-error: true` and is omitted from `all-checks-passed.needs`. The job still runs on every PR and its output is fully visible; it just does not gate merges. **Flip to blocking** by deleting that `continue-on-error` line and adding `audit` back to the `needs` list once the Next 15 migration lands. Do not mask findings with `--level` or allowlists.

### 6. Avoid postinstall-heavy dependencies

When adding a new dependency, check:

- Does it have a `postinstall` / `preinstall` / `install` script? (`yarn why <pkg>` + inspect its `package.json`)
- If yes, is the script necessary, and is the package well-known?
- Prefer alternatives with no install scripts for new additions.

**Olas-specific watches:**

- [`web3`](https://www.npmjs.com/package/web3) pulls a very large transitive tree and the web3 / viem ecosystem has historically been a high-value target. Scrutinize any bump, including `web3-types`.
- [`@vercel/blob`](https://www.npmjs.com/package/@vercel/blob) is what actually reads `BLOB_READ_WRITE_TOKEN` at runtime (see [§7](#7-secrets-hygiene-in-the-build-environment)). A compromised version could exfiltrate the token. Pin tightly and do not skip review on its transitive bumps.
- [`@vercel/og`](https://www.npmjs.com/package/@vercel/og) runs in Node.js runtime (see [`pages/api/og/[[...slug]].tsx`](./pages/api/og/[[...slug]].tsx)) and executes vendor code during OG image generation, where it has access to `BLOB_READ_WRITE_TOKEN` via `@vercel/blob`.

### 7. Secrets hygiene in the build environment

#### What secrets this app actually uses

The runtime and build environments for `olas-website` hold a non-trivial set of server-only secrets. An auditor should be able to enumerate them exactly:

| Name | Purpose | Scope | Where read |
| --- | --- | --- | --- |
| `DUNE_API_KEY` | Dune Analytics API key for protocol fee metrics | Runtime (server-only) | [`common-util/api/other-metrics/protocol.ts`](./common-util/api/other-metrics/protocol.ts) |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob read/write for cached metric snapshots | Runtime (server-only) | Implicitly by `@vercel/blob` SDK — see [`common-util/snapshot-storage.ts`](./common-util/snapshot-storage.ts), [`common-util/og/load-snapshots.ts`](./common-util/og/load-snapshots.ts), [`pages/api/og/[[...slug]].tsx`](./pages/api/og/[[...slug]].tsx) |
| `ETHEREUM_RPC`, `GNOSIS_RPC`, `ARBITRUM_RPC`, `OPTIMISM_RPC`, `BASE_RPC`, `CELO_RPC`, `POLYGON_RPC`, `MODE_RPC` | EVM chain RPC endpoints (typically keyed Alchemy/Infura/etc. URLs) used for subgraph-lag validation | Runtime (server-only) | [`common-util/constants.ts`](./common-util/constants.ts) |
| `SOLANA_RPC` | Solana RPC endpoint for vault token balance lookups | Runtime (server-only) | [`common-util/api/other-metrics/protocol.ts`](./common-util/api/other-metrics/protocol.ts) |

RPC URLs are **effectively secrets**: they typically embed an API key in the URL, and a compromised value can be used to drain our quota or impersonate reads from us. Treat every `*_RPC` entry in Vercel as a secret.

The `NEXT_PUBLIC_*` variables listed in [`.env.example`](./.env.example) — subgraph URLs, CMS URL, balancer URLs, etc. — are inlined into the client bundle by Next.js and are visible to anyone who loads the site. Treat them as public configuration.

#### Heightened exposure from cron routes

[`vercel.json`](./vercel.json) defines seven cron endpoints under `/api/refresh-metrics/*` that run on schedules from hourly to 6-hourly. Each one executes with access to the full runtime secret set above. This increases the blast radius of a compromised dependency: a malicious `@vercel/blob` or transitive web3 dep would have many daily opportunities to exfiltrate `DUNE_API_KEY`, `BLOB_READ_WRITE_TOKEN`, and RPC URLs in server-side execution.

#### General hygiene

- No long-lived secrets in CI env vars that a postinstall script could exfiltrate. When CI is added (see [§5](#5-audit-in-ci)), the workflow must not export repo or org secrets to the install step.
- Vercel **build-time** env vars should be limited to what the build actually needs; anything only the running server needs must be marked runtime-only in the Vercel project settings so it is not present when `yarn install` runs. Audit the current Vercel project to confirm `DUNE_API_KEY`, `BLOB_READ_WRITE_TOKEN`, and every `*_RPC` are **runtime-only**, not build-time.
- Vercel deploy tokens, GitHub tokens, and cloud-provider credentials must never be available to the build environment.
- `.npmrc` / `.yarnrc` auth tokens: never committed. [`.gitignore`](./.gitignore) currently protects `.env`, `.env*.local`, and `.vercel`.

### 8. Dependency review on every new addition

Before adding a new direct dependency:

- Weekly download count on npm — very low numbers on a "popular-sounding" name is a typosquat red flag.
- GitHub repo exists, is active, has reasonable star count and contributor history.
- Maintainer is the expected one (check publish history: `npm view <pkg> time`).
- No recently transferred ownership unless it's a known, announced transfer.

## Response playbook: "a dependency we use was just disclosed as compromised"

1. **Identify exposure.** `yarn why <pkg>` — direct or transitive? Which version is in our lockfile? Was it loaded by any of the seven cron endpoints?
2. **Check the window.** When was the bad version published vs. when we last ran `yarn install` / deployed? If our lockfile predates the bad version, we are not shipping it in production — but any developer running `yarn install` fresh could pull it locally.
3. **Pin to a safe version.** Edit `package.json` to a known-good version (or add a Yarn `resolutions` entry for transitive deps, following the exact-pinning rule in [§1](#1-exact-version-pinning-in-packagejson)). Commit lockfile.
4. **Rotate every secret the build/runtime could have seen.** If the compromised version ran in any cron invocation since it was published, rotate **all** of: `DUNE_API_KEY`, `BLOB_READ_WRITE_TOKEN`, every `*_RPC` (8 EVM + Solana), plus Vercel deploy tokens and any npm/GitHub tokens attached to the build account. See [§7](#7-secrets-hygiene-in-the-build-environment) for the full enumeration.
5. **Redeploy.** Force a fresh build so production no longer serves any code influenced by the bad version. Confirm the next cron run uses the new deployment.
6. **Post-mortem.** Record the incident: what package, which version, how we detected it, time-to-mitigate, what leaked (if anything).

## Current gaps / TODO

- [x] Pin all direct dependencies in [`package.json`](./package.json) to exact versions.
- [x] Add a `packageManager` field to [`package.json`](./package.json) pinning `yarn@1.22.22`.
- [x] Add `package-lock.json` and `pnpm-lock.yaml` to [`.gitignore`](./.gitignore) to prevent stray dual-lockfile creation.
- [x] Declare Vercel install command as `yarn install --frozen-lockfile` in [`vercel.json`](./vercel.json) (overrides any dashboard setting).
- [x] Stand up `.github/workflows/` with a `lint` job, an `audit` job (`yarn audit --groups dependencies` with bitmask gating for Yarn 1.x, currently warn-only), and a `lockfile-lint` job — all SHA-pinned. See [.github/workflows/main.yml](./.github/workflows/main.yml).
- [ ] **Migrate from Next.js 14.2.x to 15.x** — clears the remaining 4 high advisories (2× `next`, 2× `undici` transitive). Requires: React 18 → 19, async `params` in dynamic routes, caching-defaults review. This is the only work blocking the audit job from going fully blocking.
- [ ] **Flip the `audit` job to blocking** once the Next 15 migration lands: delete `continue-on-error: true` and add `audit` back to `all-checks-passed.needs` in [.github/workflows/main.yml](./.github/workflows/main.yml).
- [ ] Audit Vercel project env-var scoping in the Vercel dashboard: confirm `DUNE_API_KEY`, `BLOB_READ_WRITE_TOKEN`, and all `*_RPC` are **runtime-only**, not build-time.

## References

- [GitHub advisory database](https://github.com/advisories)
- [Socket.dev](https://socket.dev/) — supply chain scanner with postinstall script detection
- [Shai-Hulud Strikes Again (v2) — Socket, Nov 2025](https://socket.dev/blog/shai-hulud-strikes-again-v2) — representative of modern npm worm class (500+ packages, 700+ versions affected)
