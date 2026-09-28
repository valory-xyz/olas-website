import { OMEN_GENESIS_TS, POLYMARKET_GENESIS_TS } from 'common-util/api/predict/genesis';
import type { RangeKey } from 'common-util/api/predict/roi-distribution';
import type { WindowKey } from 'common-util/api/predict';

/**
 * The four time windows the Predict page offers, in tab order.
 *
 * One list for the whole page: the performance tabs and the ROI-distribution tabs offer
 * the same windows, and had drifted into three separate definitions of the same four
 * strings. `dataKey` is how the ROI snapshot keys its ranges (`d7`, not `7d`) — mixing
 * the two up silently suppressed a whole table once already.
 */
export const PREDICT_WINDOWS: Array<{
  key: WindowKey;
  /** Tab label. */
  label: string;
  /** As prose, for the machine-readable sentences. */
  phrase: string;
  /** Key into the ROI distribution snapshot. */
  dataKey: RangeKey;
}> = [
  { key: '7d', label: '7D', phrase: 'over the last 7 days', dataKey: 'd7' },
  { key: '30d', label: '30D', phrase: 'over the last 30 days', dataKey: 'd30' },
  { key: '90d', label: '90D', phrase: 'over the last 90 days', dataKey: 'd90' },
  { key: '365d', label: '1Y', phrase: 'over the last 365 days', dataKey: 'd365' },
];

const GENESIS_TS = { omenstrat: OMEN_GENESIS_TS, polystrat: POLYMARKET_GENESIS_TS } as const;

/**
 * The window as prose, e.g. `'over the last 7 days'`.
 *
 * With a platform, 1Y follows the genesis clamp the data applies: while the platform is
 * younger than a year the range starts at its first day, so it reads `'since 22 November
 * 2025'` rather than claiming 365 days.
 */
export const windowPhrase = (key: WindowKey, platform?: keyof typeof GENESIS_TS) => {
  if (key === '365d' && platform) {
    const genesis = GENESIS_TS[platform];
    if (genesis > Date.now() / 1000 - 365 * 86400) {
      const date = new Date(genesis * 1000).toLocaleDateString('en-GB', {
        timeZone: 'UTC',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      return `since ${date}`;
    }
  }
  return PREDICT_WINDOWS.find((window) => window.key === key)?.phrase ?? '';
};

/** The snapshot key for a window, e.g. `'d7'`. */
export const windowDataKey = (key: WindowKey): RangeKey =>
  PREDICT_WINDOWS.find((window) => window.key === key)?.dataKey ?? 'd7';

/** The two prediction-market platforms, as the text layer names them. */
export const PLATFORM_NAME = {
  omenstrat: 'Omenstrat',
  polystrat: 'Polystrat',
} as const;

/** The full descriptive clause, for sentences that must stand on their own. */
export const PLATFORM_PHRASE = {
  omenstrat: 'Omenstrat agents trading Omen prediction markets on Gnosis',
  polystrat: 'Polystrat agents trading Polymarket prediction markets on Polygon',
} as const;
