import type { AgentEconomiesMetricsData } from 'common-util/api/agent-economies';
import type { MainMetricsData } from 'common-util/api/main-metrics';
import type { OtherMetricsData } from 'common-util/api/other-metrics';
import type { PredictMetricsData } from 'common-util/api/predict';
import {
  formatOgCompactCount,
  formatOgIntegerCount,
  formatOgOlasSupplyWei,
} from 'common-util/numberFormatter';

export type OgSnapshotCategory = 'main' | 'other' | 'predict' | 'agent-economies';

export type OgMetricLine = { label: string; value: string };

export type OgTemplateMode = 'home' | 'page' | 'simple';

export type OgPageDefinition = {
  title: string;
  description: string;
  template: OgTemplateMode;
  /** Which blob snapshots to load for this card */
  snapshots: OgSnapshotCategory[];
  /** Target width for the illustration image in pixels. Defaults to 380. */
  illustrationWidth?: number;
  /** Build metric cards from loaded snapshot data */
  buildMetrics?: (data: {
    main: MainMetricsData | null;
    other: OtherMetricsData | null;
    predict: PredictMetricsData | null;
    agentEconomies: AgentEconomiesMetricsData | null;
  }) => OgMetricLine[];
};

function ogUsdTurnover(value: string | null | undefined): string {
  if (value === null || value === undefined || value === '') return '—';
  const n = Number(value);
  if (!Number.isFinite(n)) return '—';
  return `$${formatOgCompactCount(n)}`;
}

export const OG_PAGE_REGISTRY: Record<string, OgPageDefinition> = {
  '': {
    title: 'Olas',
    description: 'The platform for true co-ownership of AI',
    template: 'home',
    snapshots: [],
  },
  'agents-unleashed': {
    title: 'Agents Unleashed',
    description:
      'Join Olas as a Bonder — discounted OLAS, liquidity, rewards in AI and crypto.',
    template: 'page',
    snapshots: [],
  },
  'agent-economies': {
    title: 'Agent Economies',
    description:
      'Discover active AI agent economies on Olas — Predict, BabyDegen, Mech, Agents.fun.',
    template: 'page',
    snapshots: [],
  },
  'agent-economies/predict': {
    title: 'Predict Economy',
    description: 'On-demand agent-powered predictions on Olas.',
    template: 'page',
    illustrationWidth: 150,
    snapshots: ['predict'],
    buildMetrics: ({ predict }) =>
      predict
        ? [
            {
              label: 'Predict DAAs',
              value: formatOgIntegerCount(predict.omenstrat?.dailyActiveAgents?.value),
            },
          ]
        : [],
  },
  'agent-economies/mech': {
    title: 'Mech Economy',
    description: 'Agent-powered marketplace activity across chains.',
    template: 'page',
    illustrationWidth: 120,
    snapshots: ['agent-economies'],
    buildMetrics: ({ agentEconomies }) =>
      agentEconomies
        ? [
            {
              label: 'A2A transactions',
              value: formatOgCompactCount(agentEconomies.mech?.totalRequests?.value),
            },
          ]
        : [],
  },
  'agent-economies/agentsfun': {
    title: 'Agents.fun Economy',
    description: 'Agents operating on Base toward on-chain goals.',
    template: 'page',
    illustrationWidth: 120,
    snapshots: ['agent-economies'],
    buildMetrics: ({ agentEconomies }) =>
      agentEconomies
        ? [
            {
              label: 'Agents.fun DAAs',
              value: formatOgIntegerCount(agentEconomies.agentsFun?.dailyActiveAgents?.value),
            },
          ]
        : [],
  },
  'agent-economies/babydegen': {
    title: 'BabyDegen Economy',
    description: 'Modius and Optimus agent economies.',
    template: 'page',
    illustrationWidth: 120,
    snapshots: ['agent-economies'],
    buildMetrics: ({ agentEconomies }) =>
      agentEconomies
        ? [
            {
              label: 'BabyDegen DAAs',
              value: formatOgIntegerCount(agentEconomies.babyDegen?.dailyActiveAgents?.value),
            },
          ]
        : [],
  },
  'olas-token': {
    title: 'OLAS Token',
    description: 'Supply, emissions, and protocol metrics.',
    template: 'page',
    snapshots: ['other'],
    buildMetrics: ({ other }) =>
      other
        ? [
            {
              label: 'Token holders',
              value: formatOgCompactCount(other.tokenHolders?.totalTokenHolders?.value),
            },
            {
              label: 'Total supply',
              value: formatOgOlasSupplyWei(other.olasTotalSupplyWei?.value),
            },
          ]
        : [],
  },
  agents: {
    title: 'AI Agents',
    description: "Explore Olas' ecosystem of sovereign and decentralized AI agents.",
    template: 'page',
    snapshots: [],
  },
  'agents/omenstrat': {
    title: 'Omenstrat',
    description: 'Prediction agents on Gnosis.',
    template: 'page',
    snapshots: [],
  },
  'agents/babydegen': {
    title: 'BabyDegen',
    description: 'Modius and Optimus agents.',
    template: 'page',
    snapshots: [],
  },
  'agents/agentsfun': {
    title: 'Agents.fun',
    description: 'Agents on Base.',
    template: 'page',
    snapshots: [],
  },
  'mech-marketplace': {
    title: 'Mech Marketplace',
    description: 'Hire AI agents or offer yours on the marketplace.',
    template: 'page',
    snapshots: ['main'],
    buildMetrics: ({ main }) =>
      main ? [{ label: 'Total turnover', value: ogUsdTurnover(main.mechFees?.value) }] : [],
  },
  about: {
    title: 'About',
    description: 'Olas enables everyone to own & monetize their AI Agents',
    template: 'simple',
    snapshots: [],
  },
  blog: {
    title: 'Blog',
    description: 'News and updates from the Olas network.',
    template: 'simple',
    snapshots: [],
  },
};

export function getOgRouteKey(slug: string[] | undefined): string {
  if (!slug || slug.length === 0) return '';
  return slug.map((s) => s.trim().toLowerCase()).join('/');
}

export function getOgDefinition(routeKey: string): OgPageDefinition | null {
  return OG_PAGE_REGISTRY[routeKey] ?? null;
}
