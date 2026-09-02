import resources from 'data/resources.json';
import tokens from 'data/tokens.json';

type TokenEntry = { key?: string; address?: string };

export const OLAS_TOKEN_ADDRESS_BY_CHAIN: Record<string, string> = (tokens as TokenEntry[]).reduce(
  (acc, t) => {
    if (t.key && t.address) acc[t.key] = t.address;
    return acc;
  },
  {} as Record<string, string>
);

export const DOCS_BASE_URL = 'https://docs.olas.network';
export const LAUNCH_CONTACT_URL = 'https://t.me/pahlmeyer';

export const MENU_DATA = [
  { link: '/about', text: 'About' },
  { link: '/blog', text: 'Blog' },
  { text: 'More resources', submenu: resources },
];

export const WHITEPAPER = '/documents/whitepaper/Whitepaper v1.0.pdf';
export const WHITEPAPER_SUMMARY = '/documents/whitepaper/Whitepaper Summary v1.0.pdf';
export const CORE_TECHNICAL_DOCUMENT =
  '/documents/whitepaper/Autonolas_Tokenomics_Core_Technical_Document.pdf';

export const X_OLAS_URL = 'https://x.com/autonolas';
export const X_VALORY_AG_URL = 'https://x.com/valoryag';
export const VALORY_URL = 'https://www.valory.xyz';
export const SHORTS_URL = 'https://shorts.wtf';
export const MECH_MARKETPLACE_URL = 'https://marketplace.olas.network/';
export const PEARL_YOU_URL = 'https://pearl.you/';
export const PEARL_YOU_URL_WITH_UTM_SOURCE = `${PEARL_YOU_URL}?utm_source=olas-site`;
export const UTM_SOURCE_OLAS_SITE = 'utm_source=olas-site';

export const CONTRIBUTE_URL = 'https://contribute.olas.network';
export const OPERATE_URL = 'https://operate.olas.network';
export const LAUNCH_URL = 'https://launch.olas.network/';
export const PREDICT_URL = 'https://predict.olas.network';
export const BUILD_URL = 'https://build.olas.network';
export const GOVERN_URL = 'https://govern.olas.network';
export const BOND_URL = 'https://bond.olas.network';
export const STACK_URL = 'https://stack.olas.network';

export const BONDING_PROGRAMS_URL = `${BOND_URL}/bonding-products`;
export const VEOLAS_URL = `${GOVERN_URL}/veolas`;
export const VEOLAS_TOKEN_ID = '0x7e01a500805f8a52fad229b3015ad130a332b7b3';
export const OPERATE_AGENTS_URL = `${OPERATE_URL}/agents`;
export const DEV_REWARDS_URL = `${BUILD_URL}/dev-incentives`;
export const BUILD_MECH_TOOL_URL = `${BUILD_URL}/paths/prediction-agents-mechs-ai-tool`;

export const OLAS_API_URL = 'https://api.olas.autonolas.tech';
export const ACCELERATOR_APPLY_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSed_jc5XNlnib0m9yG2IRo8_PKFNPwp0DFTdbph4LpR9E9uhg/viewform';

export const VALORY_GIT_URL = 'https://github.com/valory-xyz';

export const AUTONOLAS_SUBGRAPH_URL = process.env.NEXT_PUBLIC_AUTONOLAS_SUBGRAPH_URL;

export const TOKENOMICS_SUBGRAPH_URLS = [
  {
    key: 'ethereum',
    url: process.env.NEXT_PUBLIC_TOKENOMICS_ETHEREUM_SUBGRAPH_URL,
  },
  {
    key: 'arbitrum',
    url: process.env.NEXT_PUBLIC_TOKENOMICS_ARBITRUM_SUBGRAPH_URL,
  },
  {
    key: 'base',
    url: process.env.NEXT_PUBLIC_TOKENOMICS_BASE_SUBGRAPH_URL,
  },
  {
    key: 'celo',
    url: process.env.NEXT_PUBLIC_TOKENOMICS_CELO_SUBGRAPH_URL,
  },
  {
    key: 'gnosis',
    url: process.env.NEXT_PUBLIC_TOKENOMICS_GNOSIS_SUBGRAPH_URL,
  },
  {
    key: 'optimism',
    url: process.env.NEXT_PUBLIC_TOKENOMICS_OPTIMISM_SUBGRAPH_URL,
  },
  {
    key: 'polygon',
    url: process.env.NEXT_PUBLIC_TOKENOMICS_POLYGON_SUBGRAPH_URL,
  },
  { key: 'mode', url: process.env.NEXT_PUBLIC_TOKENOMICS_MODE_SUBGRAPH_URL },
];

export const STAKING_SUBGRAPH_URLS = [
  { key: 'gnosis', url: process.env.NEXT_PUBLIC_GNOSIS_STAKING_SUBGRAPH_URL },
  { key: 'optimism', url: process.env.NEXT_PUBLIC_OPTIMISM_STAKING_SUBGRAPH_URL },
  { key: 'base', url: process.env.NEXT_PUBLIC_BASE_STAKING_SUBGRAPH_URL },
  { key: 'mode', url: process.env.NEXT_PUBLIC_MODE_STAKING_SUBGRAPH_URL },
  { key: 'polygon', url: process.env.NEXT_PUBLIC_POLYGON_STAKING_SUBGRAPH_URL },
];

export const REGISTRY_SUBGRAPH_URLS = [
  { key: 'ethereum', url: process.env.NEXT_PUBLIC_ETHEREUM_REGISTRY_SUBGRAPH_URL },
  { key: 'gnosis', url: process.env.NEXT_PUBLIC_GNOSIS_REGISTRY_SUBGRAPH_URL },
  { key: 'base', url: process.env.NEXT_PUBLIC_BASE_REGISTRY_SUBGRAPH_URL },
  { key: 'mode', url: process.env.NEXT_PUBLIC_MODE_REGISTRY_SUBGRAPH_URL },
  { key: 'optimism', url: process.env.NEXT_PUBLIC_OPTIMISM_REGISTRY_SUBGRAPH_URL },
  { key: 'celo', url: process.env.NEXT_PUBLIC_CELO_REGISTRY_SUBGRAPH_URL },
  { key: 'arbitrum', url: process.env.NEXT_PUBLIC_ARBITRUM_REGISTRY_SUBGRAPH_URL },
  { key: 'polygon', url: process.env.NEXT_PUBLIC_POLYGON_REGISTRY_SUBGRAPH_URL },
];

export const LIQUIDITY_SUBGRAPH_URLS = [
  { key: 'ethereum', url: process.env.NEXT_PUBLIC_LIQUIDITY_ETHEREUM_SUBGRAPH_URL },
  { key: 'gnosis', url: process.env.NEXT_PUBLIC_LIQUIDITY_GNOSIS_SUBGRAPH_URL },
  { key: 'polygon', url: process.env.NEXT_PUBLIC_LIQUIDITY_POLYGON_SUBGRAPH_URL },
  { key: 'arbitrum', url: process.env.NEXT_PUBLIC_LIQUIDITY_ARBITRUM_SUBGRAPH_URL },
  { key: 'optimism', url: process.env.NEXT_PUBLIC_LIQUIDITY_OPTIMISM_SUBGRAPH_URL },
  { key: 'base', url: process.env.NEXT_PUBLIC_LIQUIDITY_BASE_SUBGRAPH_URL },
  { key: 'celo', url: process.env.NEXT_PUBLIC_LIQUIDITY_CELO_SUBGRAPH_URL },
];

/**
 * Per-chain subgraph lag tolerance.
 *
 * `lagLimit` is derived rather than hand-written: a single magic block count used to bury
 * both the chain's block time and the tolerance, so neither could be reviewed on its own.
 *
 * Tolerance scales with how much a chain moves the published totals, because a lagging
 * chain only distorts an aggregate in proportion to its share of it. Gnosis dominates
 * registry transactions by roughly two orders of magnitude, so a delay there is material
 * within hours; the remaining chains are each low single-digit percentages or less, where
 * half a day of delay is a rounding error. Flagging those at 12h greys headline metrics
 * over differences too small to see, which just teaches people to ignore the indicator.
 *
 * Both inputs are point-in-time observations, not invariants — block times drift with
 * network upgrades and traffic shares move as chains are added. Re-derive rather than
 * trust these if you are changing them:
 *   blockTimeSec  — (t(head) - t(head - N)) / N over each chain's public RPC
 *   traffic share — `global(id: "") { txCount }` per REGISTRY_GRAPH_CLIENTS entry
 * Last checked 2026-08-10 (PR #553); shares then were gnosis 96.57%, optimism 1.69%,
 * polygon 0.86%, base 0.64%, mode 0.24% (ethereum/celo/arbitrum not reachable at the time).
 */
const CHAIN_LAG_CONFIG: Record<
  string,
  { rpc: string; blockTimeSec: number; lagToleranceHours: number }
> = {
  // Mainnet registry is the origin chain — treat delays there as material.
  ethereum: { rpc: process.env.ETHEREUM_RPC, blockTimeSec: 12, lagToleranceHours: 12 },
  // ~96.6% of registry transactions: the only chain that can shift a total on its own.
  gnosis: { rpc: process.env.GNOSIS_RPC, blockTimeSec: 5.1, lagToleranceHours: 12 },
  arbitrum: { rpc: process.env.ARBITRUM_RPC, blockTimeSec: 0.25, lagToleranceHours: 48 },
  optimism: { rpc: process.env.OPTIMISM_RPC, blockTimeSec: 2, lagToleranceHours: 48 },
  base: { rpc: process.env.BASE_RPC, blockTimeSec: 2, lagToleranceHours: 48 },
  celo: { rpc: process.env.CELO_RPC, blockTimeSec: 1, lagToleranceHours: 48 },
  polygon: { rpc: process.env.POLYGON_RPC, blockTimeSec: 2, lagToleranceHours: 48 },
  mode: { rpc: process.env.MODE_RPC, blockTimeSec: 2, lagToleranceHours: 48 },
};

export const CHAIN_CONFIG: Record<string, { rpc: string; blockTimeSec: number; lagLimit: number }> =
  Object.fromEntries(
    Object.entries(CHAIN_LAG_CONFIG).map(([chain, { rpc, blockTimeSec, lagToleranceHours }]) => [
      chain,
      { rpc, blockTimeSec, lagLimit: Math.round((lagToleranceHours * 3600) / blockTimeSec) },
    ])
  );

// VoteWeighting on Ethereum — its nominees define the officially maintained staking programs.
export const VOTE_WEIGHTING_ADDRESS = '0x95418b46d5566D3d1ea62C12Aea91227E566c5c1';

export const TELEGRAM_INVITE_URL = 'https://t.me/olaschat';

export const COINGECKO_URL = 'https://www.coingecko.com';
export const ETHERSCAN_URL = 'https://etherscan.io';

// Ethereum addresses holding non-circulating OLAS, shown on the /olas-token
// supply distribution pie chart. Keys match the ids in SupplyPieChart's DATA config.
export const OLAS_SUPPLY_DISTRIBUTION_ADDRESSES = {
  veOlas: '0x7e01A500805f8A52Fad229b3015AD130A332B7b3',
  dao: '0x3C1fF68f5aa342D296d4DEe4Bb1cACCA912D95fE',
  valory: '0x87cc0d34f6111c8A7A4Bdf758a9a715A3675f941',
} as const;

// Balancer pools used for on-chain OLAS USD pricing for Predict ROI.
// - Gnosis: OLAS-WXDAI (WXDAI ≈ 1 USD)
// - Polygon: OLAS-WMATIC (WMATIC -> USD conversion is done via Polygon POL/USD Chainlink feed)
export const GNOSIS_BALANCER_OLAS_WXDAI_POOL_ID =
  '0x79c872ed3acb3fc5770dd8a0cd9cd5db3b3ac985000200000000000000000067';

export const POLYGON_BALANCER_OLAS_WMATIC_POOL_ID =
  '0x62309056c759c36879cde93693e7903bf415e4bc000200000000000000000d5f';

// Polygon POL/USD Chainlink feed (used to convert WMATIC -> USD).
export const CHAINLINK_PRICE_FEED_ADDRESS_POLYGON_POL_USD =
  '0xAB594600376Ec9fD91F8e885dADF0CE036862dE0';
export const CHAINLINK_PRICE_FEED_DECIMALS_POLYGON_POL_USD = 8;
export const SNAPSHOT_URL = 'https://snapshot.org/#/autonolas.eth';
export const ON_CHAIN_PROPOSALS_URL = 'https://govern.olas.network/proposals';

export const CACHE_DURATION_SECONDS = 12 * 60 * 60; // 12 hours
export const REVALIDATE_DURATION = 5 * 60; // 5 minutes
export const DEFAULT_MECH_FEE = BigInt('10000000000000000'); // 0.01
export const PREDICT_MARKET_DURATION_DAYS = 4;
// Age-out TTL for pending QMR entries; also bounds the mech-analytics ingest window
export const QMR_MAX_AGE_DAYS = 14;

// Omenstrat agent classification used for transactions-by-type and DAA queries
export const OMENSTRAT_AGENT_CLASSIFICATION = {
  market_maker: [13],
  valory_trader: [14, 25],
  mech: [9, 26, 29, 37, 36],
  other_trader: [33, 44, 46, 45],
};

// Polystrat (Polymarket) agent classification for transactions-by-type and DAA queries
export const POLYSTRAT_AGENT_CLASSIFICATION = {
  valory_trader: [86],
  mech: [9, 26, 29, 37, 36],
};

// Registry agent IDs (per chain) whose staking programs count as predict: trader agents
// only. Filtering by the contract's staked agent ids keeps the list maintenance-free and
// excludes non-predict programs (LST has no agent ids, mech stakes a mech agent).
export const PREDICT_STAKING_AGENT_IDS: Record<'gnosis' | 'polygon', number[]> = {
  gnosis: [25, 40],
  polygon: [86],
};

// Mech agent classification used for categorized request counts
export const MECH_AGENT_CLASSIFICATION = {
  predict: [14, 25, 13, 86],
  contribute: [6],
  governatooor: [5],
  agentsfun: [43],
};

/**
 * List of staking contracts currently available for staking on different chains
 * Source: https://operate.olas.network/contracts
 * TODO: read directly from https://etherscan.io/address/0x95418b46d5566D3d1ea62C12Aea91227E566c5c1#readContract#F9
 **/
export const MODIUS_STAKING_CONTRACTS = [
  '0x534C0A05B6d4d28d5f3630D6D74857B253cf8332',
  '0xeC013E68FE4B5734643499887941eC197fd757D0',
  '0x9034D0413D122015710f1744A19eFb1d7c2CEB13',
  '0x8BcAdb2c291C159F9385964e5eD95a9887302862',
  '0x5fc25f50e96857373c64dc0edb1abcbed4587e91',
  '0xa008f200a4eba119d25a19c8e100751a6da1f52c',
  '0xed8cded731b34c90bdaf5f6e9d9035433cf73689',
];
export const OPTIMUS_STAKING_CONTRACTS = [
  '0xBCA056952D2A7a8dD4A002079219807CFDF9fd29',
  '0x0f69f35652B1acdbD769049334f1AC580927E139',
  '0x6891Cf116f9a3bDbD1e89413118eF81F69D298C3',
];
// Basius (Base) staking contracts — Source: https://govern.olas.network/contracts
export const BASIUS_STAKING_CONTRACTS = [
  '0x0fb55cef7b12b76ea52900325461a5443f51b43f',
  '0x728ca3b024ba4c273695df6e45e79db675b8c756',
  '0x9593c4524df86f46935aa0ec996b4ccbe71c8234',
];

// Hardcoded values for Modius, suggested by Babydegen team
export const MODIUS_FIXED_END_DATE_UTC = '2025-09-18T00:00:00Z';
export const MODIUS_FIXED_OLAS_PRICE_USD = 0.23; // olas price in USD on 2025-09-18
/**
 * Chains the Mech Marketplace is deployed on, derived from the chain roster above by
 * subtraction so there is one list to maintain rather than two that can drift.
 *
 * Excluded:
 *   celo — marketplace subgraph exists but is commented out in `MARKETPLACE_GRAPH_CLIENTS`
 *   mode — no marketplace subgraph
 *
 * Lives here rather than in `graphql/client.ts` so components can state a metric's scope
 * without pulling GraphQL clients into the browser bundle; `client.ts` asserts the two
 * stay in step.
 */
const MARKETPLACE_EXCLUDED_CHAINS = ['celo', 'mode'] as const;

/**
 * When the Mech Marketplace 15% fee was switched on (2026-06-15 ~06:30 UTC; proposal
 * executed on Ethereum, bridged to the L2s minutes later). Lives here so components can
 * state it without importing the RPC-scanning fee module and its viem client.
 */
export const FEE_LIVE_SINCE_SEC = 1781503200; // 2026-06-15 06:00 UTC

export const MARKETPLACE_CHAIN_KEYS = Object.keys(CHAIN_LAG_CONFIG).filter(
  (chain) =>
    !MARKETPLACE_EXCLUDED_CHAINS.includes(chain as (typeof MARKETPLACE_EXCLUDED_CHAINS)[number])
);

export const MARKETPLACE_CHAIN_SCOPE = (() => {
  const names = MARKETPLACE_CHAIN_KEYS.map((k) => k.charAt(0).toUpperCase() + k.slice(1));
  const list = `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
  // Count first so it reads as a complete set, then the names so a reader can verify it.
  // Both derived, so neither can drift from the aggregation being described.
  return `all ${names.length} chains the Mech Marketplace is deployed on (${list})`;
})();

// ---------------------------------------------------------------------------
// Hero press feature — temporary, self-expiring (remove after the run).
// Everything for it is greppable by "HERO_FEATURE" / "hero-feature".
// ---------------------------------------------------------------------------

/**
 * The press piece promoted under the homepage hero subheading. A single object
 * so the copy, the outlet and the link can never drift apart across the two
 * hero breakpoints that render it.
 */
export const HERO_FEATURE = {
  headline: 'Agentic Commerce Is Here As Mastercard Cloudflare And Olas Build Rails',
  outlet: 'Forbes',
  /** Logo under public/images/featured-in — shared with the "As seen in" reel. */
  logoFilename: 'forbes.svg',
  url: 'https://www.forbes.com/sites/sandycarter/2026/09/02/agentic-commerce-is-here-as-mastercard-cloudflare-and-olas-build-rails/',
} as const;

/**
 * When the feature stops rendering — a month after the article ran (2026-09-02).
 * Keep the explicit Z: a bare date parses as midnight UTC and would cut the
 * last day off the run.
 */
export const HERO_FEATURE_END = '2026-10-02T23:59:59Z';

/** Whether the hero feature is still within its run. */
export const isHeroFeatureActive = (now: number = Date.now()): boolean => {
  const endsAt = Date.parse(HERO_FEATURE_END);
  // Fail closed: an unparseable end date hides the feature rather than
  // stranding a stale press link on the homepage forever.
  return !Number.isNaN(endsAt) && now < endsAt;
};
