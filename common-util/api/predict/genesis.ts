/**
 * Genesis timestamps (UTC midnight) for the predict platforms — the earliest day any
 * accumulator backfills to. They live here so a correction can't miss one of the
 * consumers (`roi-distribution`, `accuracy`, `brier`, `staking-rewards`).
 */

/** predict-omen's first indexed day. */
export const OMEN_GENESIS_TS = 1763769600;

/** 2026-01-16 — first (internal-testing) on-chain activity; public launch was 2026-02-10. */
export const POLYMARKET_GENESIS_TS = 1768521600;

/** Earliest block timestamp to consider when fetching mech requests. */
export const GNOSIS_MECH_REQUESTS_GENESIS_TS = 1763078400;
export const POLYGON_MECH_REQUESTS_GENESIS_TS = 1763078400;
