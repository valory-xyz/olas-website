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
  { key: 'max', label: 'Max', phrase: 'over all time', dataKey: 'all' },
];

/** The window as prose, e.g. `'over the last 7 days'`. */
export const windowPhrase = (key: WindowKey) =>
  PREDICT_WINDOWS.find((window) => window.key === key)?.phrase ?? '';

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
