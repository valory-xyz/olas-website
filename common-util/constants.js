import resources from 'data/resources.json';

export const DOCS_BASE_URL = 'https://docs.olas.network';
export const LAUNCH_CONTACT_URL = 'https://t.me/pahlmeyer';

export const MENU_DATA = [
  { link: '/about', text: 'About' },
  { link: '/blog', text: 'Blog' },
  { text: 'More resources', submenu: resources },
];

export const WHITEPAPER = '/documents/whitepaper/Whitepaper v1.0.pdf';
export const WHITEPAPER_SUMMARY =
  '/documents/whitepaper/Whitepaper Summary v1.0.pdf';
export const CORE_TECHNICAL_DOCUMENT =
  '/documents/whitepaper/Autonolas_Tokenomics_Core_Technical_Document.pdf';

export const DUNE_QUERY_URL = 'https://dune.com/queries';
export const DUNE_DAAS_QUERY_URL = `${DUNE_QUERY_URL}/4915321/8136719`;
export const DUNE_TOTAL_SERVICE_TRANSACTIONS_URL = `${DUNE_QUERY_URL}/4915404/8136824`;
export const DUNE_PREDICT_DAA_QUERY_URL = `${DUNE_QUERY_URL}/5417479/8846100`;
export const DUNE_PREDICT_CLASSIFIED_TRANSACTIONS_URL = `${DUNE_QUERY_URL}/5417451/8846057`;
export const DUNE_TOTAL_PREDICT_TRANSACTIONS_URL = `${DUNE_QUERY_URL}/5416224/8846038`;

export const DUNE_AGENTS_QUERY_URL = `${DUNE_QUERY_URL}/5200009/8555457?category=decoded_project&namespace=autonolas&blockchain=ethereum`;
export const DUNE_OPERATORS_QUERY_URL = `${DUNE_QUERY_URL}/5200009/8555457?category=decoded_project&namespace=autonolas&blockchain=ethereum`;
export const DUNE_OLAS_STAKED_URL = `${DUNE_QUERY_URL}/5344501/8755325`;
export const DUNE_TOTAL_LIQUIDITY_URL = `${DUNE_QUERY_URL}/5383248/8807520`;
export const DUNE_TOTAL_PROTOCOL_REVENUE_URL = `${DUNE_QUERY_URL}/5409446/8836411`;

export const DAA_QUERY_ID = '4915321';
export const TOTAL_SERVICE_TRANSACTIONS_QUERY_ID = '4915404';
export const PREDICTION_DAA_QUERY_ID = '5417479';
export const PREDICTION_TXS_BY_AGENT_TYPE_QUERY_ID = '5417451';
export const PREDICTION_TOTAL_TXS_QUERY_ID = '5416224';
export const VEOLAS_CIRCULATING_SUPPLY_ID = '5376597';
export const TOTAL_PROTOCOL_OWNED_LIQUIDITY_ID = '5383248';
export const TOTAL_PROTOCOL_REVENUE_FROM_FEES_ID = '5409446';
export const PROTOCOL_EARNED_FEES_ID = '3511561';
export const MECH_TXS_QUERY_ID = '5195400';
export const UNIQUE_STAKERS_QUERY_ID = '5200009';
export const DAILY_CONTRIBUTORS_QUERY_ID = '4349554';
export const FEE_FLOW_QUERY_ID = '5166975';

export const OLAS_STAKED_QUERY_ID = '5344501';

export const DUNE_URL = 'https://dune.com/adrian0x';
export const OLAS_ECONOMY_DASHBOARD_URL = `${DUNE_URL}/autonolas-ecosystem-activity`;

export const X_OLAS_URL = 'https://x.com/autonolas';
export const X_VALORY_AG_URL = 'https://x.com/valoryag';
export const VALORY_URL = 'https://www.valory.xyz';
export const SHORTS_URL = 'https://shorts.wtf';
export const MECH_MARKETPLACE_URL = 'https://marketplace.olas.network/';

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
export const QUICKSTART_URL = `${VALORY_GIT_URL}/quickstart`;

export const STAKING_SUBGRAPH_URLS = {
  gnosis:
    'https://thegraph.com/explorer/subgraphs/F3iqL2iw5UTrP1qbb4S694pGEkBwzoxXp1TRikB2K4e?view=Query&chain=arbitrum-one',
  optimism:
    'https://thegraph.com/explorer/subgraphs/2fe1izA4aVvBHVwbPzP1BqxLkoR9ebygWM9iHXwLCnPE?view=Query&chain=arbitrum-one',
};

export const REGISTRY_SUBGRAPH_URLS = {
  ethereum:
    'https://thegraph.com/explorer/subgraphs/89VhY3d7w6Ran1C86wkchzYNEG3rLBgWvyDUZMEFyjtQ',
  base: 'https://thegraph.com/explorer/subgraphs/Baqj7bPWWQKw8HXwfqbMZnFhkSamuUYFa3JgCRYF8Tcr?view=Query&chain=arbitrum-one',
  celo: 'https://thegraph.com/explorer/subgraphs/BxkMNoiEHdbJDtrmMG1bqVvUfwVUWnf5bn47WnCdB1A4',
  gnosis:
    'https://thegraph.com/explorer/subgraphs/GmDw6a6EfP6z58dzkw5WehpxjaiEKB6aZRk4TNUm3DPn?view=Query&chain=arbitrum-one',
  optimism:
    'https://thegraph.com/explorer/subgraphs/BksA3aj8vX68TVs91ieDoGzFGASuLC7BaYo2HsGCea7p?view=Query&chain=arbitrum-one',
  polygon:
    'https://thegraph.com/explorer/subgraphs/HHRBjVWFT2bV7eNSRqbCNDtUVnLPt911hcp8mSe4z6KG',
  arbitrum:
    'https://thegraph.com/explorer/subgraphs/GpQfE1C5DzXz1KCFvvj6jZkuhpMouwtbf9yYSv2y2V4p',
};

export const AUTONOLAS_SUBGRAPH_URL =
  process.env.NEXT_PUBLIC_AUTONOLAS_SUBGRAPH_URL;

export const AUTONOLAS_BASE_SUBGRAPH_URL =
  process.env.NEXT_PUBLIC_AUTONOLAS_BASE_SUBGRAPH_URL;

export const TOKENOMICS_SUBGRAPH_URLS = [
  {
    key: 'ethereum',
    url: process.env.NEXT_PUBLIC_TOKENOMICS_ETHEREUM_SUBGRAPH_URL,
  },
  {
    key: 'arbitrum',
    url: 'https://thegraph.com/explorer/subgraphs/EKdR7Xqiz3iEtZuAQPChPku14aSxnb85pVpx9Nb13J2',
  },
  {
    key: 'base',
    url: 'https://thegraph.com/explorer/subgraphs/4PfoaqBSC8zJKGSVxKmyQPHLvK4VrHu9ZiLeaGjhN59G',
  },
  {
    key: 'celo',
    url: 'https://thegraph.com/explorer/subgraphs/pVCUc7dQYpRFPBjX6trqqvJDedZKPRXn1C1yaihwLRQ',
  },
  {
    key: 'gnosis',
    url: 'https://thegraph.com/explorer/subgraphs/CWCQsUk2zfD9JMYmsSYKvwhRjmTxFKRJtZK62w6x3bPX',
  },
  {
    key: 'optimism',
    url: 'https://thegraph.com/explorer/subgraphs/6PX6KaJdKtmeB3FmpA9s6PRRdB6yi7LMQipfSiJnNBRH',
  },
  {
    key: 'polygon',
    url: 'https://thegraph.com/explorer/subgraphs/B1BF29s7xVhueYcr6ZHhQiiSYr3h3uqpZnnqeP6Wefc3',
  },
  { key: 'mode', url: process.env.NEXT_PUBLIC_TOKENOMICS_MODE_SUBGRAPH_URL },
];

export const DISCORD_INVITE_URL = 'https://discord.com/invite/BQzYqhjGjQ';

export const COINGECKO_URL = 'https://www.coingecko.com';
export const ETHERSCAN_URL = 'https://etherscan.io';
export const SNAPSHOT_URL = 'https://snapshot.org/#/autonolas.eth';
export const ON_CHAIN_PROPOSALS_URL = 'https://govern.olas.network/proposals';

export const CACHE_DURATION_SECONDS = 12 * 60 * 60; // 12 hours
export const DEFAULT_MECH_FEE = BigInt('10000000000000000'); // 0.01
export const PREDICT_MARKET_DURATION_DAYS = 4;

// Predict agent classification used for transactions-by-type and DAA queries
export const PREDICT_AGENT_CLASSIFICATION = {
  market_maker: [13],
  valory_trader: [14, 25],
  mech: [9, 26, 29, 37, 36],
  other_trader: [33, 44, 46, 45],
};

// Mech agent classification used for categorized request counts
export const MECH_AGENT_CLASSIFICATION = {
  predict: [14, 25, 13],
  contribute: [6],
  governatooor: [5],
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

// Hardcoded values for Modius, suggested by Babydegen team
export const MODIUS_FIXED_END_DATE_UTC = '2025-09-18T00:00:00Z';
export const MODIUS_FIXED_OLAS_PRICE_USD = 0.23; // olas price in USD on 2025-09-18
export const GNOSIS_STAKING_CONTRACTS = [
  '0xeF44Fb0842DDeF59D37f85D61A1eF492bbA6135d',
  '0x389B46c259631Acd6a69Bde8B6cEe218230bAE8C',
  '0x5344B7DD311e5d3DdDd46A4f71481bD7b05AAA3e',
  '0xb964e44c126410df341ae04B13aB10A985fE3513',
  '0x80faD33Cadb5F53f9D29F02Db97D682E8b101618',
  '0x1c2F82413666d2a3fD8bC337b0268e62dDF67434',
  '0x238EB6993b90a978ec6AAD7530d6429c949C08DA',
  '0xDaF34eC46298b53a3d24CBCb431E84eBd23927dA',
  '0x998dEFafD094817EF329f6dc79c703f1CF18bC90',
  '0xaD9d891134443B443D7F30013c7e14Fe27F2E029',
  '0xE56dF1E563De1B10715cB313D514af350D207212',
  '0xBd59Ff0522aA773cB6074ce83cD1e4a05A457bc1',
  '0x3052451e1eAee78e62E169AfdF6288F8791F2918',
  '0x4Abe376Fda28c2F43b84884E5f822eA775DeA9F4',
  '0x2546214aEE7eEa4bEE7689C81231017CA231Dc93',
  '0xD7A3C8b975f71030135f1a66e9e23164d54fF455',
  '0xdB9E2713c3dA3C403F2eA6E570eB978b00304e9E',
  '0x1E90522b45c771DCF5f79645B9e96551d2ECaF62',
  '0x6c65430515c70a3f5E62107CC301685B7D46f991',
  '0x88eB38FF79fBa8C19943C0e5Acfa67D5876AdCC1',
  '0x356C108D49C5eebd21c84c04E9162de41933030c',
  '0x17dBAe44BC5618Cc254055b386A29576b4F87015',
  '0xB0ef657b8302bd2c74B6E6D9B2b4b39145b19c6f',
  '0x3112c1613eAC3dBAE3D4E38CeF023eb9E2C91CF7',
  '0xF4a75F476801B3fBB2e7093aCDcc3576593Cc1fc',
  '0x6C6D01e8eA8f806eF0c22F0ef7ed81D868C1aB39',
  '0x1430107A785C3A36a0C1FC0ee09B9631e2E72aFf',
  '0x041e679d04Fc0D4f75Eb937Dea729Df09a58e454',
  '0x9d6e7aB0B5B48aE5c146936147C639fEf4575231',
  '0x9fb17E549FefcCA630dd92Ea143703CeE4Ea4340',
  '0xCAbD0C941E54147D40644CF7DA7e36d70DF46f44',
  '0xAb10188207Ea030555f53C8A84339A92f473aa5e',
  '0x8d7bE092d154b01d404f1aCCFA22Cef98C613B5D',
  '0x9D00A0551F20979080d3762005C9B74D7Aa77b85',
  '0xE2f80659dB1069f3B6a08af1A62064190c119543',
  '0x75EECA6207be98cAc3fDE8a20eCd7B01e50b3472',
  '0x9c7F6103e3a72E4d1805b9C683Ea5B370Ec1a99f',
  '0xcdC603e0Ee55Aae92519f9770f214b2Be4967f7d',
  '0x22D6cd3d587D8391C3aAE83a783f26c67ab54A85',
  '0xaaEcdf4d0CBd6Ca0622892Ac6044472f3912A5f3',
  '0x168aED532a0CD8868c22Fc77937Af78b363652B1',
];

export const PREDICT_STAKING_PROGRAMS_PEARL = {
  pearl_alpha: '0xEE9F19b5DF06c7E8Bfc7B28745dcf944C504198A',
  pearl_beta: '0xeF44Fb0842DDeF59D37f85D61A1eF492bbA6135d',
  pearl_beta_2: '0x1c2F82413666d2a3fD8bC337b0268e62dDF67434',
  pearl_beta_3: '0xBd59Ff0522aA773cB6074ce83cD1e4a05A457bc1',
  pearl_beta_4: '0x3052451e1eAee78e62E169AfdF6288F8791F2918',
  pearl_beta_5: '0x4Abe376Fda28c2F43b84884E5f822eA775DeA9F4',
  pearl_beta_6: '0x6C6D01e8eA8f806eF0c22F0ef7ed81D868C1aB39',
  pearl_beta_mech_marketplace: '0xDaF34eC46298b53a3d24CBCb431E84eBd23927dA',
  'pearl_beta-mech_marketplace': '0xAb10188207Ea030555f53C8A84339A92f473aa5e',
  pearl_beta_mech_marketplace_2: '0x8d7bE092d154b01d404f1aCCFA22Cef98C613B5D',
  pearl_beta_mech_marketplace_3: '0x9d00a0551f20979080d3762005c9b74d7aa77b85',
  pearl_beta_mech_marketplace_4: '0xE2f80659dB1069f3B6a08af1A62064190c119543',
};
