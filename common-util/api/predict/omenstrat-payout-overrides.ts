/**
 * TEMPORARY: Fallback payout data from on-chain PayoutRedemption event logs.
 *
 * The omenstrat predict subgraph has a bug where `totalPayout` is recorded as 0
 * for some daily statistics. This module reads the actual payouts directly from
 * chain logs and caches them in the `omenstrat-payouts` blob.
 *
 * Remove this file and all // TEMPORARY references in other files once the
 * subgraph bug is fixed.
 */

import { CHAIN_CONFIG } from 'common-util/constants';
import Web3 from 'web3';

export const OMENSTRAT_PAYOUT_OVERRIDES_ENABLED = true;

// ConditionalTokens (CTF) contract on Gnosis chain
const CTF_ADDRESS = '0xCeAfDD6bc0bEF976fdCd1112955828E00543c0Ce';

// keccak256('PayoutRedemption(address,address,bytes32,bytes32,uint256[],uint256)')
// Computed lazily to avoid issues at import time
let _payoutRedemptionTopic: string | null = null;
const getPayoutRedemptionTopic = (): string => {
  if (!_payoutRedemptionTopic) {
    _payoutRedemptionTopic = new Web3().utils.keccak256(
      'PayoutRedemption(address,address,bytes32,bytes32,uint256[],uint256)'
    );
  }
  return _payoutRedemptionTopic!;
};

const GNOSIS_CTF_GENESIS_BLOCK = 44616992; // ~ 15 days ago

const GNOSIS_BLOCK_TIME_SEC = 5;
const DAY_SECONDS = 86400;
// Small block range — events are dense (~every 60-120 blocks) and RPCs are sensitive
const LOG_CHUNK_SIZE = 10;
// Delay between chunks to avoid overwhelming the RPC
const CHUNK_DELAY_MS = 150;

/**
 * { [dayTimestamp]: { [agentAddress]: payoutBigIntString } }
 * Mirrors the byDay structure of AgentBlueprintRoiData.
 */
export type PayoutOverridesMap = Record<string, Record<string, string>>;

export type OmenstratPayoutsData = {
  overrides: PayoutOverridesMap;
  lastProcessedBlock: number;
};

const getGnosisWeb3 = (): Web3 => {
  const rpc = CHAIN_CONFIG.gnosis?.rpc;
  if (!rpc) throw new Error('GNOSIS_RPC env var is not configured');
  return new Web3(new Web3.providers.HttpProvider(rpc));
};

/**
 * Incrementally fetches all PayoutRedemption events from lastProcessedBlock+1
 * to the current chain tip. Fetches the real block timestamp for each block
 * that contains a redemption event (redemptions are sparse so this is cheap)
 * to get exact UTC day buckets that match the subgraph's dailyProfitStatistics.
 *
 * Returns the merged OmenstratPayoutsData with lastProcessedBlock updated.
 */
export const updatePayoutOverrides = async (
  existing: OmenstratPayoutsData | null
): Promise<OmenstratPayoutsData> => {
  const web3 = getGnosisWeb3();
  const latestBlock = await web3.eth.getBlock('latest');
  const latestBlockNumber = Number(latestBlock.number);
  const latestTs = Number(latestBlock.timestamp);

  const fromBlock = (existing?.lastProcessedBlock ?? GNOSIS_CTF_GENESIS_BLOCK) + 1;

  if (fromBlock > latestBlockNumber) {
    return existing ?? { overrides: {}, lastProcessedBlock: latestBlockNumber };
  }

  const topic = getPayoutRedemptionTopic();
  const newOverrides: PayoutOverridesMap = {};
  for (const [day, agents] of Object.entries(existing?.overrides ?? {})) {
    newOverrides[day] = { ...agents };
  }

  // Track the last block we successfully processed so a failed chunk doesn't
  // create a permanent gap — the next run will retry from here.
  let lastSuccessfulBlock = fromBlock - 1;

  for (let block = fromBlock; block <= latestBlockNumber; block += LOG_CHUNK_SIZE) {
    const end = Math.min(block + LOG_CHUNK_SIZE - 1, latestBlockNumber);
    try {
      const rawLogs = await web3.eth.getPastLogs({
        address: CTF_ADDRESS,
        topics: [topic],
        fromBlock: block,
        toBlock: end,
      });

      // Web3 v4 returns (Log | string)[] — filter to object logs only
      const logs = rawLogs.filter(
        (log): log is Exclude<typeof log, string> => typeof log !== 'string'
      );

      if (logs.length > 0) {
        // Fetch real timestamps for the unique block numbers that contain events.
        // Redemptions are sparse so this is typically a handful of extra RPC calls.
        const uniqueBlockNums = [...new Set(logs.map((log) => Number(log.blockNumber)))];

        const blockTimestamps = new Map<number, number>();
        await Promise.all(
          uniqueBlockNums.map(async (bn) => {
            try {
              const b = await web3.eth.getBlock(bn);
              blockTimestamps.set(bn, Number(b.timestamp));
            } catch {
              // Fallback to linear estimation if the block fetch fails
              blockTimestamps.set(bn, latestTs - (latestBlockNumber - bn) * GNOSIS_BLOCK_TIME_SEC);
            }
          })
        );

        for (const log of logs) {
          if (!log.topics || log.topics.length < 2) continue;

          // topic[1] is the redeemer address (indexed), padded to 32 bytes
          const redeemer = ('0x' + (log.topics[1] as string).slice(26)).toLowerCase();

          // Non-indexed data: (bytes32 conditionId, uint256[] indexSets, uint256 payout)
          const decoded = web3.eth.abi.decodeParameters(
            ['bytes32', 'uint256[]', 'uint256'],
            log.data as string
          );
          const payout = BigInt(decoded[2] as string);

          // Use the real block timestamp so the day bucket matches the subgraph's date
          const blockNum = Number(log.blockNumber);
          const realTs =
            blockTimestamps.get(blockNum) ??
            latestTs - (latestBlockNumber - blockNum) * GNOSIS_BLOCK_TIME_SEC;
          const dayTs = realTs - (realTs % DAY_SECONDS);

          const dayKey = String(dayTs);
          if (!newOverrides[dayKey]) newOverrides[dayKey] = {};
          newOverrides[dayKey][redeemer] = (
            BigInt(newOverrides[dayKey][redeemer] ?? '0') + payout
          ).toString();
        }
      }

      lastSuccessfulBlock = end;
      // Throttle to avoid overwhelming the RPC
      await new Promise((r) => setTimeout(r, CHUNK_DELAY_MS));
    } catch (e) {
      console.error(`[omenstrat-payout-overrides] Error fetching logs blocks ${block}-${end}:`, e);
      // Stop processing — next run will resume from lastSuccessfulBlock + 1
      break;
    }
  }

  return { overrides: newOverrides, lastProcessedBlock: lastSuccessfulBlock };
};
