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

export const FLIPSIDE_BASE_URL = 'https://flipsidecrypto.xyz';
export const FLIPSIDE_URL = `${FLIPSIDE_BASE_URL}/flipsideteam/olas-key-activity-metrics-pnPjda`;
export const FLIPSIDE_QUERY_URL = `${FLIPSIDE_BASE_URL}/flipsideteam/q/`;
export const FLIPSIDE_LIQUIDITY_QUERY_URL = `${FLIPSIDE_QUERY_URL}EVHMVqzqhIvF/total/visualizations/v2/2d31feb6-a661-4103-ba09-02f60d3d28e8`;
export const FLIPSIDE_PROTOCOL_FEES_QUERY_URL = `${FLIPSIDE_QUERY_URL}0H0TnBLIMXjf/olas-total-protocol-revenue-from-lp-new/visualizations/fa540a62-ac0b-4030-9b43-26d1d7faa454`;
export const FLIPSIDE_LOCKED_OLAS_QUERY_URL = `${FLIPSIDE_QUERY_URL}ORaUMVaQVovq/veolas/visualizations/v2/a437de1b-5d22-4139-82b8-b51cd1b07848`;
export const FLIPSIDE_VEOLAS_HOLDERS_QUERY_URL = `${FLIPSIDE_QUERY_URL}6ANzqADDc8VL/total-veolas-holders/visualizations/v2/939139ef-5597-4058-8e85-38e406cb6387`;
export const FLIPSIDE_DAAS_QUERY_URL = `${FLIPSIDE_QUERY_URL}9u9HmWdL4ioR/daily-active-autonomous-services/visualizations/8e57f727-bbc7-4fb7-80ee-6654214e5020`;
export const FLIPSIDE_TOTAL_HOLDERS_QUERY_URL = `${FLIPSIDE_QUERY_URL}WGkAsswnV2pH/total-holders/visualizations/v2/d57457e2-1c31-4c9b-af60-3a58de583eeb`;

export const DUNE_QUERY_URL = 'https://dune.com/queries';
export const DUNE_A2A_TRANSACTIONS_QUERY_URL = `${DUNE_QUERY_URL}/5204254/8561534`;
export const DUNE_AGENTS_QUERY_URL = `${DUNE_QUERY_URL}/5200009/8555457?category=decoded_project&namespace=autonolas&blockchain=ethereum`;
export const DUNE_MMV2_URL = `${DUNE_QUERY_URL}/5166975`;
export const DUNE_TOTAL_TRANSACTIONS_QUERY_URL = `${DUNE_QUERY_URL}/5194313/8548512`;
export const DUNE_CLASSIFIED_REQUESTS_QUERY_URL = `${DUNE_QUERY_URL}/5195400`;
export const DUNE_OPERATORS_QUERY_URL = `${DUNE_QUERY_URL}/5200009/8555457?category=decoded_project&namespace=autonolas&blockchain=ethereum`;
export const DUNE_OLAS_STAKED_URL = `${DUNE_QUERY_URL}/5344501/8755325`;

export const PREDICTION_DAA_QUERY_ID = '4165113';
export const PREDICTION_TXS_BY_AGENT_TYPE_QUERY_ID = '4161414';
export const PROTOCOL_EARNED_FEES_ID = '3511561';
export const PREDICTION_ECONOMY_DASHBOARD_URL = `${FLIPSIDE_BASE_URL}/MLDZMN/olas-predict-on-demand-agent-powered-predictions-47WGHl`;
export const MECH_TXS_QUERY_ID = '5195400';
export const TOTAL_MECH_TXS_ID = '5194313';
export const UNIQUE_STAKERS_QUERY_ID = '5200009';
export const UNIQUE_BUILDERS_QUERY_ID = '4331416';
export const DAILY_CONTRIBUTORS_QUERY_ID = '4349554';
export const FEE_FLOW_QUERY_ID = '5166975';
export const A2A_TRANSACTIONS_ID = '5204254';
export const OLAS_STAKED_QUERY_ID = '5344501';

export const DUNE_URL = 'https://dune.com/adrian0x';
export const MECH_ECONOMY_DASHBOARD_URL = `${DUNE_URL}/the-mechs-agent-economy`;
export const OLAS_ECONOMY_DASHBOARD_URL = `${DUNE_URL}/autonolas-ecosystem-activity`;
export const OLAS_PROTOCOL_LIQUIDITY_URL = `${DUNE_URL}/olas`;

export const X_OLAS_URL = 'https://x.com/autonolas';
export const X_VALORY_AG_URL = 'https://x.com/valoryag';
export const VALORY_URL = 'https://www.valory.xyz';
export const SHORTS_URL = 'https://shorts.wtf';
export const REGISTRY_URL = 'https://registry.olas.network/';

export const CONTRIBUTE_URL = 'https://contribute.olas.network';
export const OPERATE_URL = 'https://operate.olas.network';
export const LAUNCH_URL = 'https://launch.olas.network/';
export const STAKING_URL = 'https://staking.olas.network';
export const PREDICT_URL = 'https://predict.olas.network';
export const BUILD_URL = 'https://build.olas.network';
export const GOVERN_URL = 'https://govern.olas.network';
export const BOND_URL = 'https://bond.olas.network';

export const BONDING_PROGRAMS_URL = `${BOND_URL}/bonding-products`;
export const VEOLAS_URL = `${GOVERN_URL}/veolas`;
export const OPERATE_AGENTS_URL = `${OPERATE_URL}/agents`;
export const DEV_REWARDS_URL = `${BUILD_URL}/dev-incentives`;
export const BUILD_MECH_TOOL_URL = `${BUILD_URL}/paths/prediction-agents-mechs-ai-tool`;

export const OLAS_API_URL = 'https://api.olas.autonolas.tech';
export const ACCELERATOR_APPLY_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSed_jc5XNlnib0m9yG2IRo8_PKFNPwp0DFTdbph4LpR9E9uhg/viewform';

export const VALORY_GIT_URL = 'https://github.com/valory-xyz';
export const QUICKSTART_URL = `${VALORY_GIT_URL}/quickstart`;

export const DISCORD_INVITE_URL = 'https://discord.com/invite/BQzYqhjGjQ';

export const COINGECKO_URL = 'https://www.coingecko.com';
export const ETHERSCAN_URL = 'https://etherscan.io';
export const SNAPSHOT_URL = 'https://snapshot.org/#/autonolas.eth';
export const BOARDROOM_URL = 'https://boardroom.io/autonolas';

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
