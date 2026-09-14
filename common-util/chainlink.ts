import { CHAINLINK_USD_FEED_DECIMALS } from 'common-util/constants';
import { getChainReader } from 'common-util/web3';
import { Abi, formatUnits } from 'viem';

const AGGREGATOR_V3_ABI = [
  {
    name: 'latestRoundData',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      { name: 'roundId', type: 'uint80' },
      { name: 'answer', type: 'int256' },
      { name: 'startedAt', type: 'uint256' },
      { name: 'updatedAt', type: 'uint256' },
      { name: 'answeredInRound', type: 'uint80' },
    ],
  },
] as const satisfies Abi;

/**
 * Latest answer of a Chainlink <asset>/USD feed in raw feed units
 * (`CHAINLINK_USD_FEED_DECIMALS`). Throws when the read fails or the answer is not positive.
 */
export const readChainlinkUsdAnswer = async (
  chain: string,
  feed: `0x${string}`
): Promise<bigint> => {
  const read = getChainReader(chain);
  if (!read) throw new Error(`Missing RPC for ${chain}`);

  const round = await read({
    address: feed,
    abi: AGGREGATOR_V3_ABI as unknown as Abi,
    functionName: 'latestRoundData',
  });
  const raw = Array.isArray(round) ? round[1] : (round as { answer?: unknown })?.answer;
  const answer = raw == null ? 0n : BigInt(raw as bigint);
  if (answer <= 0n) throw new Error(`Chainlink feed ${feed} on ${chain} answered ${answer}`);
  return answer;
};

/** Latest answer of a Chainlink <asset>/USD feed as a USD number. */
export const readChainlinkUsdPrice = async (chain: string, feed: `0x${string}`): Promise<number> =>
  Number(formatUnits(await readChainlinkUsdAnswer(chain, feed), CHAINLINK_USD_FEED_DECIMALS));
