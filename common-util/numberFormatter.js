export const formatWeiNumber = (numberInWei) => {
  const formatNumberWithSuffix = (number) => {
    if (number >= 1e9) {
      return `${Math.floor((number / 1e9) * 10) / 10}B`;
    }
    if (number >= 1e6) {
      return `${Math.floor((number / 1e6) * 10) / 10}M`;
    }
    if (number >= 1e3) {
      return `${Math.floor((number / 1e3))}k`;
    }
    return Math.floor(number);
  };

  return formatNumberWithSuffix(parseFloat(`${numberInWei / 10 ** 18}`));
};
