export const formatWeiNumber = (
  numberInWei: string | bigint,
  options: Intl.NumberFormatOptions = {
    notation: 'compact',
    maximumFractionDigits: 3,
  },
) => {
  let wei: bigint;
  if (typeof numberInWei === 'bigint') {
    wei = numberInWei;
  } else {
    try {
      const numValue = Number(numberInWei);
      if (
        !Number.isFinite(numValue) ||
        Number.isNaN(numValue) ||
        numValue < Number.MIN_SAFE_INTEGER ||
        numValue > Number.MAX_SAFE_INTEGER
      ) {
        return new Intl.NumberFormat('en', options).format(0);
      }
      wei = BigInt(numberInWei);
    } catch {
      return new Intl.NumberFormat('en', options).format(0);
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
  },
) => {
  const formatter = Intl.NumberFormat('en', options);
  return formatter.format(Number(numberInEth));
};
