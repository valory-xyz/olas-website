export const formatWeiNumber = (
  numberInWei: string | bigint,
  options: Intl.NumberFormatOptions = {
    notation: 'compact',
    maximumFractionDigits: 3,
  }
) => {
  let wei: bigint;
  if (typeof numberInWei === 'bigint') {
    wei = numberInWei;
  } else {
    try {
      wei = BigInt(numberInWei);
    } catch {
      // Fallback: If it's not a valid bigint string (e.g. has decimals or non-numeric)
      // or is already a numeric value (e.g. converted from bigint by chart libraries),
      const numValue = Number(numberInWei);
      if (!Number.isFinite(numValue) || Number.isNaN(numValue)) {
        return new Intl.NumberFormat('en', options).format(0);
      }
      return new Intl.NumberFormat('en', options).format(numValue / 1e18);
    }
  }

  const divisor = 10n ** 18n;
  const ethInt = wei / divisor;
  const ethFrac = wei % divisor;
  const eth = Number(ethInt) + Number(ethFrac) / 1e18;
  return new Intl.NumberFormat('en', options).format(eth);
};

export const formatEthNumber = (
  numberInEth: number | string,
  options: Intl.NumberFormatOptions = {
    notation: 'compact',
    maximumFractionDigits: 3,
  }
) => {
  const formatter = Intl.NumberFormat('en', options);
  return formatter.format(Number(numberInEth));
};

// Format a USD metric, falling back to '--' when the value is missing/non-numeric
// (e.g. a snapshot taken before this metric existed) so we never render "$NaN".
export const formatUsd = (value?: string | number | null, fractionDigits?: number) => {
  const num = Number(value);
  if (value == null || !Number.isFinite(num)) return '--';
  return `$${num.toLocaleString(
    'en-US',
    fractionDigits != null
      ? { minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits }
      : undefined
  )}`;
};

const OG_COMPACT: Intl.NumberFormatOptions = {
  notation: 'compact',
  compactDisplay: 'short',
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
};

export const formatOgCompactCount = (value: number | string | null | undefined): string => {
  if (value === null || value === undefined) return '—';
  const n = typeof value === 'string' ? Number(value) : value;
  if (!Number.isFinite(n)) return '—';
  return new Intl.NumberFormat('en', OG_COMPACT).format(n);
};

export const formatOgIntegerCount = (value: number | string | null | undefined): string => {
  if (value === null || value === undefined) return '—';
  const n = typeof value === 'string' ? Number(value) : value;
  if (!Number.isFinite(n)) return '—';
  return String(Math.round(n));
};

export const formatOgOlasSupplyWei = (wei: string | null | undefined): string => {
  if (wei == null || wei === '') return '—';
  return formatWeiNumber(wei, OG_COMPACT);
};

/**
 * A token amount, with precision chosen from its magnitude: 2 decimals below 10,
 * 1 below 1,000, none above. Large balances read as whole tokens while a fractional
 * WETH balance keeps the digits that carry its value.
 *
 * Pass `fractionDigits` to fix the precision instead.
 */
export const formatTokenAmount = (amount: number, fractionDigits?: number) =>
  amount.toLocaleString('en-US', {
    maximumFractionDigits: fractionDigits ?? (amount < 10 ? 2 : amount < 1000 ? 1 : 0),
    ...(fractionDigits != null ? { minimumFractionDigits: fractionDigits } : {}),
  });
