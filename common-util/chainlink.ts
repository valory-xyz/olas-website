import { CHAINLINK_MAX_ANSWER_AGE_SEC, CHAINLINK_USD_FEED_DECIMALS } from 'common-util/constants';
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
 * (`CHAINLINK_USD_FEED_DECIMALS`). Throws when the read fails, the answer is not positive,
 * or the round is older than `CHAINLINK_MAX_ANSWER_AGE_SEC` — a stalled feed keeps
 * returning its last price without reverting.
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
  const fields = round as { answer?: unknown; updatedAt?: unknown };
  const rawAnswer = Array.isArray(round) ? round[1] : fields?.answer;
  const rawUpdatedAt = Array.isArray(round) ? round[3] : fields?.updatedAt;
  const answer = rawAnswer == null ? 0n : BigInt(rawAnswer as bigint);
  if (answer <= 0n) throw new Error(`Chainlink feed ${feed} on ${chain} answered ${answer}`);
  const ageSec = Math.floor(Date.now() / 1000) - Number(rawUpdatedAt ?? 0);
  if (ageSec > CHAINLINK_MAX_ANSWER_AGE_SEC) {
    throw new Error(`Chainlink feed ${feed} on ${chain} is ${ageSec}s old`);
  }
  return answer;
};

/** Latest answer of a Chainlink <asset>/USD feed as a USD number. */
export const readChainlinkUsdPrice = async (chain: string, feed: `0x${string}`): Promise<number> =>
  Number(formatUnits(await readChainlinkUsdAnswer(chain, feed), CHAINLINK_USD_FEED_DECIMALS));
