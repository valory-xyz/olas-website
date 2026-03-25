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

const OG_COMPACT: Intl.NumberFormatOptions = {
  notation: 'compact',
  compactDisplay: 'short',
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
};

export const formatOgCompactCount = (value: number | null | undefined): string => {
  if (value === null || value === undefined || !Number.isFinite(value)) return '—';
  return new Intl.NumberFormat('en', OG_COMPACT).format(value);
};

export const formatOgIntegerCount = (value: number | null | undefined): string => {
  if (value === null || value === undefined || !Number.isFinite(value)) return '—';
  return String(Math.round(value));
};

export const formatOgOlasSupplyWei = (wei: string | null | undefined): string => {
  if (wei == null || wei === '') return '—';
  return formatWeiNumber(wei, OG_COMPACT);
};
