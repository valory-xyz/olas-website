import type { DatasetEntry } from 'common-util/structured-data';

/**
 * One entry per section of /data, in page order.
 *
 * `id` must be the section's `id` attribute and `name` its visible `<h2>`, verbatim:
 * `yarn structured-data:check` reads the built page and fails if either does not match, or
 * if a section exists that is not listed here. `description` is a one-sentence summary for
 * the Dataset record — the full methodology stays on the page itself.
 */
export const DATASETS: DatasetEntry[] = [
  {
    id: 'daily-active-agents',
    name: 'Daily Active Agents',
    description:
      'Tracks how many unique multisigs were active each day for all agents across all supported networks.',
  },
  {
    id: 'babydegen-daily-active-agents',
    name: 'Babydegen Daily Active Agents',
    description: 'Tracks how many unique multisigs were active each day for Babydegen agents.',
  },
  {
    id: 'agentsfun-daily-active-agents',
    name: 'Agents.fun Daily Active Agents',
    description: 'Tracks how many unique multisigs were active each day for Agents.fun agents.',
  },
  {
    id: 'mech-daily-active-agents',
    name: 'Mech Daily Active Agents',
    description: 'Tracks how many unique multisigs of Mech agents were active each day.',
  },
  {
    id: 'omenstrat-daily-active-agents',
    name: 'Omenstrat Daily Active Agents',
    description: 'Tracks unique multisigs active each day for Omenstrat agents on Gnosis chain.',
  },
  {
    id: 'polystrat-daily-active-agents',
    name: 'Polystrat Daily Active Agents',
    description: 'Tracks unique multisigs active each day for Polystrat agents on Polygon chain.',
  },
  {
    id: 'pearl-daily-active-agents',
    name: 'Pearl Daily Active Agents',
    description:
      'Tracks how many unique multisigs were active each day for all agents in the Pearl app.',
  },
  {
    id: 'contribute-daily-active-agents',
    name: 'Contribute Daily Active Agents',
    description:
      'Tracks unique multisigs active each day for Contribute agents on Base, scoped by agentId = 41.',
  },
  {
    id: 'omenstrat-total-agents',
    name: 'Omenstrat Total Agents',
    description:
      'Counts every Omenstrat agent ever registered on Gnosis chain: distinct services in the Olas registry whose agent ids include an Omenstrat trader id, whether or not still running.',
  },
  {
    id: 'polystrat-total-agents',
    name: 'Polystrat Total Agents',
    description:
      'Counts every Polystrat agent ever registered on Polygon chain: distinct services in the Olas registry whose agent ids include a Polystrat trader id, whether or not still running.',
  },
  {
    id: 'babydegen-metrics',
    name: 'BabyDegen Metrics',
    description: 'Aggregates BabyDegen agent metrics from the BabyDegen and staking subgraphs.',
  },
  {
    id: 'mech-globals',
    name: 'Mech Globals',
    description:
      'Total requests and deliveries are aggregated from Mech Marketplace subgraphs on Gnosis, Base, Polygon and Optimism.',
  },
  {
    id: 'mech-requests-categorized',
    name: 'Mech Requests (Categorized)',
    description:
      'Predict, Contribute and Governatooorr request counts, computed by summing per-agent totals across the Mech Marketplace subgraphs using fixed agent IDs.',
  },
  {
    id: 'token-holders',
    name: 'Token Holders',
    description: 'Aggregates the number of unique OLAS token holders across supported networks.',
  },
  {
    id: 'govern-veolas',
    name: 'veOLAS Holders (Active)',
    description: 'Counts the number of wallets with an active veOLAS lock on Ethereum.',
  },
  {
    id: 'operators',
    name: 'Operators',
    description: 'Tracks the total number of unique operators across all supported networks.',
  },
  {
    id: 'builders',
    name: 'Builders',
    description: 'Tracks the total number of unique builders who have developed on the Olas Stack.',
  },
  {
    id: 'transactions',
    name: 'Transactions',
    description:
      'Tracks the total number of transactions executed by all agents across all supported networks.',
  },
  {
    id: 'omenstrat-predict-transactions-by-type',
    name: 'Omenstrat: Transactions by Agent Type',
    description:
      'Breaks down total Predict transactions by agent category using agent-level counters.',
  },
  {
    id: 'polystrat-predict-transactions-by-type',
    name: 'Polystrat: Transactions by Agent Type',
    description:
      'Breaks down total Polystrat (Polymarket) transactions by agent category using agent-level counters.',
  },
  {
    id: 'ata-transactions',
    name: 'ATA Transactions',
    description:
      'Tracks agent-to-agent transactions across every chain the Mech Marketplace is deployed on, aggregated from the Mech Marketplace and legacy mech subgraphs.',
  },
  {
    id: 'mech-turnover',
    name: 'Mech Turnover',
    description:
      'Tracks the total fees collected from the Mech Marketplace across every chain its subgraphs cover, plus legacy mech fees from Gnosis, summed in USD.',
  },
  {
    id: 'olas-staked',
    name: 'OLAS Staked',
    description:
      'Tracks the total amount of OLAS tokens currently staked across all agents in the ecosystem.',
  },
  {
    id: 'omenstrat-predict-roi',
    name: 'Omenstrat: Predict ROI',
    description:
      'Omenstrat agents’ return on investment: trading ROI from prediction performance alone, and total ROI including staking rewards, net of all related costs.',
  },
  {
    id: 'omenstrat-predict-apr',
    name: 'Omenstrat: Predict APR (OLAS Staking)',
    description:
      'APR is computed from the OLAS staking contracts on Gnosis, filtered to only the ones nominated in the VoteWeighting contract on Ethereum (getAllNominees).',
  },
  {
    id: 'omenstrat-predict-accuracy',
    name: 'Omenstrat: Predict Success Rate',
    description:
      'How often Omenstrat agents’ predictions were correct in resolved markets, per time range, with each trade counted on the day it was placed.',
  },
  {
    id: 'omenstrat-predict-brier',
    name: 'Omenstrat: Predict Brier Score',
    description:
      'The Brier score of Omenstrat agents’ predictions — how well-calibrated they are, where lower is better and 0 is a perfect forecast.',
  },
  {
    id: 'polystrat-predict-roi',
    name: 'Polystrat: Predict ROI',
    description:
      'Polystrat agents’ return on investment: trading ROI from prediction performance alone, and total ROI including staking rewards, net of all related costs.',
  },
  {
    id: 'polystrat-predict-apr',
    name: 'Polystrat: Predict APR (OLAS Staking)',
    description:
      'APR is computed from the OLAS staking contracts on Polygon, filtered to only the ones nominated in the VoteWeighting contract on Ethereum (getAllNominees).',
  },
  {
    id: 'polystrat-predict-accuracy',
    name: 'Polystrat: Predict Success Rate',
    description:
      'How often Polystrat agents’ predictions were correct in resolved markets, per time range, with each trade counted on the day it was placed.',
  },
  {
    id: 'protocol-owned-liquidity',
    name: 'Total Protocol-owned Liquidity',
    description:
      'Tracks the total USD value of LP tokens held by the Olas Treasury across all chains.',
  },
  {
    id: 'protocol-liquidity-fees',
    name: 'Fees from Protocol-owned Liquidity',
    description:
      'Tracks the cumulative swap fees earned by the Treasury’s LP positions across all chains.',
  },
  {
    id: 'protocol-fees',
    name: 'Protocol Fees and OLAS Burn',
    description: 'Tracks the amount of protocol fees collected by the Mech Marketplace.',
  },
];
