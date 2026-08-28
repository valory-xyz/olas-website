import type { CSSProperties } from 'react';

import type { PolChainKey, PolChainValue } from 'common-util/api/other-metrics/protocol';
import type { MetricWithStatus } from 'common-util/graphql/types';

// The design canvas — every coordinate below lives in this space; the whole
// diagram is scaled uniformly to fit narrower viewports (see useDiagramScale).
export const DIAGRAM = { width: 1320, height: 985 };

// The `protocol` slice of the 'other' snapshot the homepage passes down.
// Everything optional: snapshots written before polByChain existed lack it.
export type ProtocolActivityMetrics = {
  totalProtocolRevenue?: MetricWithStatus<number | null>;
  polByChain?: Partial<Record<PolChainKey, MetricWithStatus<PolChainValue | null>>>;
} | null;

export const TOOLTIPS = {
  dailyActiveAgents: '7-day average Daily Active Agents',
  // Final copy pending.
  polFeeSwitch: 'The PoL fee switch is currently off.',
  marketplaceFees: 'A 15% fee is taken on payments between AI agents on the Olas Marketplace.',
} as const;

// Token icons for tooltip amount rows. WETH/WXDAI/WMATIC/CELO/WSOL reuse the
// matching chain icon — no dedicated token assets exist yet.
export const TOKEN_ICONS: Record<string, string> = {
  OLAS: '/images/olas-token-logo.svg',
  WETH: '/images/homepage/addresses/eth-color.svg',
  WXDAI: '/images/homepage/addresses/gnosis-color.svg',
  xDAI: '/images/homepage/addresses/gnosis-color.svg',
  WMATIC: '/images/homepage/addresses/polygon-color.svg',
  CELO: '/images/homepage/addresses/celo-color.svg',
  WSOL: '/images/homepage/addresses/solana-color.svg',
  USDC: '/images/accelerator/usdc-icon.png',
};

// Marketplace fee trackers by token, for the "fees collected" tooltip rows.
// Chains mirror USD_PEGGED_FEE_TRACKERS in common-util/api/mech-marketplace-fees.ts.
export const MARKETPLACE_FEE_TOKENS: Array<{ symbol: string; chainIcons: string[] }> = [
  {
    symbol: 'USDC',
    chainIcons: ['eth', 'arbitrum', 'optimism', 'polygon', 'celo'].map(
      (chain) => `/images/homepage/addresses/${chain}-color.svg`
    ),
  },
  { symbol: 'xDAI', chainIcons: ['/images/homepage/addresses/gnosis-color.svg'] },
];

// Static by design — the on-chain fee switches have no data source yet.
export const FEE_SWITCHES: Record<'pol' | 'marketplace', 'ON' | 'OFF'> = {
  pol: 'OFF',
  marketplace: 'ON',
};

type ChainPillConfig = {
  key: PolChainKey;
  label: string;
  icon: string;
  // Position within the PoL panel (545x340).
  style: CSSProperties;
};

const chainIconPath = '/images/homepage/addresses/';

export const CHAIN_PILLS: ChainPillConfig[] = [
  {
    key: 'ethereum',
    label: 'Ethereum',
    icon: `${chainIconPath}eth-color.svg`,
    style: { top: 14, left: '50%', transform: 'translateX(-50%)' },
  },
  {
    key: 'celo',
    label: 'Celo',
    icon: `${chainIconPath}celo-color.svg`,
    style: { top: 78, left: 46 },
  },
  {
    key: 'optimism',
    label: 'Optimism',
    icon: `${chainIconPath}optimism-color.svg`,
    style: { top: 151, left: 8 },
  },
  {
    key: 'polygon',
    label: 'Polygon',
    icon: `${chainIconPath}polygon-color.svg`,
    style: { top: 224, left: 46 },
  },
  {
    key: 'gnosis',
    label: 'Gnosis',
    icon: `${chainIconPath}gnosis-color.svg`,
    style: { top: 78, right: 46 },
  },
  {
    key: 'base',
    label: 'Base',
    icon: `${chainIconPath}base-color.svg`,
    style: { top: 151, right: 8 },
  },
  {
    key: 'arbitrum',
    label: 'Arbitrum',
    icon: `${chainIconPath}arbitrum-color.svg`,
    style: { top: 224, right: 46 },
  },
  {
    key: 'solana',
    label: 'Solana',
    icon: `${chainIconPath}solana-color.svg`,
    style: { bottom: 10, left: '50%', transform: 'translateX(-50%)' },
  },
];

type EconomyPillConfig = {
  slug: string;
  label: string;
  icon: string;
  pillStyle: CSSProperties;
  style: CSSProperties;
};

// Gradient background + gradient border with rounded corners: border-image
// ignores border-radius, so each pill layers backgrounds instead — interior
// gradient clipped to padding-box on top, the two border gradients (alpha
// overlay above the opaque base, as composited in the design) on border-box
// underneath, showing through the transparent 1px border ring.
const pillGradients = (background: string, borderOverlay: string, borderBase: string) => ({
  border: '1px solid transparent',
  background: `${background} padding-box, ${borderOverlay} border-box, ${borderBase} border-box`,
});

const PREDICT_BABYDEGEN_PILL = pillGradients(
  'linear-gradient(119.14deg, #E4E9FB 0%, #FAE4FB 100.04%)',
  'linear-gradient(119.14deg, rgba(255, 255, 255, 0) 29.34%, #EA8FEF 100.04%)',
  'linear-gradient(119.14deg, #95A7EF 0%, #CEDCED 71.17%)'
);

export const ECONOMY_PILLS: EconomyPillConfig[] = [
  {
    slug: 'predict',
    label: 'Predict economy',
    icon: '/images/homepage/activity/predict.png',
    pillStyle: PREDICT_BABYDEGEN_PILL,
    style: { top: 40, left: 27 },
  },
  {
    slug: 'babydegen',
    label: 'BabyDegen economy',
    icon: '/images/homepage/activity/babydegen.png',
    pillStyle: PREDICT_BABYDEGEN_PILL,
    style: { top: 40, right: 26 },
  },
  {
    slug: 'agentsfun',
    label: 'Agents.fun economy',
    icon: '/images/homepage/activity/agentsfun.png',
    pillStyle: pillGradients(
      'linear-gradient(119.14deg, #FBEAD0 0%, #E0EBEB 49.54%, #C7E1FF 100.04%)',
      'linear-gradient(119.14deg, rgba(255, 255, 255, 0) 29.34%, #79A2D3 100.04%)',
      'linear-gradient(119.14deg, #F6CF93 0%, #CEDCED 71.17%)'
    ),
    // Bottom pills bottom-align with the A2A card (the tallest bottom-row card).
    style: { top: 896, left: 27 },
  },
  {
    slug: 'mech',
    label: 'Mech economy',
    icon: '/images/homepage/activity/mech.png',
    pillStyle: pillGradients(
      'linear-gradient(119.14deg, #D4F2F1 0%, #DCF4EE 100.04%)',
      'linear-gradient(119.14deg, #5ECECB 0%, rgba(255, 255, 255, 0) 70.7%)',
      'linear-gradient(119.14deg, #CEDCED 28.87%, #68CFB5 100.04%)'
    ),
    style: { top: 896, right: 26 },
  },
];

// Placeholder set until dedicated avatar assets arrive.
export const DAA_AVATARS = [
  '/images/homepage/modius.png',
  '/images/homepage/optimus.png',
  '/images/homepage/predict.png',
  '/images/homepage/agentsfun.png',
  '/images/homepage/8baller.png',
];
