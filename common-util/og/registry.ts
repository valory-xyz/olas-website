import type { AgentEconomiesMetricsData } from 'common-util/api/agent-economies';
import type { MainMetricsData } from 'common-util/api/main-metrics';
import type { OtherMetricsData } from 'common-util/api/other-metrics';
import type { PredictMetricsData } from 'common-util/api/predict';
import { formatWeiNumber } from 'common-util/numberFormatter';

export type OgSnapshotCategory = 'main' | 'other' | 'predict' | 'agent-economies';

export type OgMetricLine = { label: string; value: string };

export type OgTemplateMode = 'rich' | 'simple';

export type OgPageDefinition = {
  title: string;
  description: string;
  template: OgTemplateMode;
  /** Which blob snapshots to load for this card */
  snapshots: OgSnapshotCategory[];
  /** Build metric rows from loaded snapshot data */
  buildMetrics?: (data: {
    main: MainMetricsData | null;
    other: OtherMetricsData | null;
    predict: PredictMetricsData | null;
    agentEconomies: AgentEconomiesMetricsData | null;
  }) => OgMetricLine[];
};

const m = (value: unknown, suffix = ''): string => {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'number' && Number.isFinite(value)) {
    return `${new Intl.NumberFormat('en', { maximumFractionDigits: value >= 100 ? 0 : 2 }).format(value)}${suffix}`;
  }
  return `${value}${suffix}`;
};

const fromMain =
  (main: MainMetricsData | null): OgMetricLine[] =>
    main
      ? [
          {
            label: 'Avg. daily active agents (7d)',
            value: m(main.dailyActiveAgents?.value),
          },
          {
            label: 'OLAS staked',
            value: main.olasStaked?.value ? `${formatWeiNumber(main.olasStaked.value)} OLAS` : '—',
          },
          {
            label: 'Mech fees (USD)',
            value: m(main.mechFees?.value, main.mechFees?.value ? ' USD' : ''),
          },
        ]
      : [];

export const OG_PAGE_REGISTRY: Record<string, OgPageDefinition> = {
  '': {
    title: 'Olas',
    description: 'Olas enables everyone to own and monetize their AI agents.',
    template: 'rich',
    snapshots: ['main'],
    buildMetrics: ({ main }) => fromMain(main),
  },
  'agents-unleashed': {
    title: 'Agents Unleashed',
    description:
      'Join Olas as a Bonder — discounted OLAS, liquidity, rewards in AI and crypto.',
    template: 'rich',
    snapshots: ['main'],
    buildMetrics: ({ main }) => fromMain(main),
  },
  'agent-economies': {
    title: 'Agent Economies',
    description:
      'Discover active AI agent economies on Olas — Predict, BabyDegen, Mech, Agents.fun.',
    template: 'rich',
    snapshots: ['agent-economies'],
    buildMetrics: ({ agentEconomies }) =>
      agentEconomies
        ? [
            {
              label: 'Agents.fun DAA (7d avg)',
              value: m(agentEconomies.agentsFun?.dailyActiveAgents?.value),
            },
            {
              label: 'Mech marketplace requests',
              value: m(agentEconomies.mech?.totalRequests?.value),
            },
            {
              label: 'BabyDegen DAA (7d avg)',
              value: m(agentEconomies.babyDegen?.dailyActiveAgents?.value),
            },
          ]
        : [],
  },
  'agent-economies/predict': {
    title: 'Predict',
    description: 'On-demand agent-powered predictions on Olas.',
    template: 'rich',
    snapshots: ['predict'],
    buildMetrics: ({ predict }) =>
      predict
        ? [
            {
              label: 'Omenstrat DAA (7d avg)',
              value: m(predict.omenstrat?.dailyActiveAgents?.value),
            },
            {
              label: 'Omenstrat max APR',
              value: predict.omenstrat?.apr?.value != null ? `${predict.omenstrat.apr.value}%` : '—',
            },
            {
              label: 'Omenstrat success rate',
              value:
                predict.omenstrat?.successRate?.value != null
                  ? `${predict.omenstrat.successRate.value}%`
                  : '—',
            },
          ]
        : [],
  },
  'agent-economies/mech': {
    title: 'Mech economy',
    description: 'Agent-powered marketplace activity across chains.',
    template: 'rich',
    snapshots: ['agent-economies'],
    buildMetrics: ({ agentEconomies }) =>
      agentEconomies
        ? [
            {
              label: 'Mech DAA (7d avg)',
              value: m(agentEconomies.mech?.dailyActiveAgents?.value),
            },
            {
              label: 'Total requests',
              value: m(agentEconomies.mech?.totalRequests?.value),
            },
            {
              label: 'Total deliveries',
              value: m(agentEconomies.mech?.totalDeliveries?.value),
            },
          ]
        : [],
  },
  'agent-economies/agentsfun': {
    title: 'Agents.fun economy',
    description: 'Agents operating on Base toward on-chain goals.',
    template: 'rich',
    snapshots: ['agent-economies'],
    buildMetrics: ({ agentEconomies }) =>
      agentEconomies
        ? [
            {
              label: 'DAA (7d avg)',
              value: m(agentEconomies.agentsFun?.dailyActiveAgents?.value),
            },
          ]
        : [],
  },
  'agent-economies/babydegen': {
    title: 'BabyDegen economy',
    description: 'Modius and Optimus agent economies.',
    template: 'rich',
    snapshots: ['agent-economies'],
    buildMetrics: ({ agentEconomies }) =>
      agentEconomies
        ? [
            {
              label: 'DAA (7d avg)',
              value: m(agentEconomies.babyDegen?.dailyActiveAgents?.value),
            },
            {
              label: 'Optimus max OLAS APR',
              value:
                agentEconomies.babyDegen?.optimus?.value?.maxOlasApr != null
                  ? `${agentEconomies.babyDegen.optimus.value.maxOlasApr}%`
                  : '—',
            },
            {
              label: 'Modius max OLAS APR',
              value:
                agentEconomies.babyDegen?.modius?.value?.maxOlasApr != null
                  ? `${agentEconomies.babyDegen.modius.value.maxOlasApr}%`
                  : '—',
            },
          ]
        : [],
  },
  'olas-token': {
    title: 'OLAS Token',
    description: 'Supply, emissions, and protocol metrics.',
    template: 'rich',
    snapshots: ['other'],
    buildMetrics: ({ other }) =>
      other
        ? [
            {
              label: 'Protocol owned liquidity (USD)',
              value: m(other.protocol?.totalProtocolOwnedLiquidity?.value),
            },
            {
              label: 'Cumulative protocol revenue',
              value: m(other.protocol?.totalProtocolRevenue?.value),
            },
            {
              label: 'Token holders (all chains)',
              value: m(other.tokenHolders?.totalTokenHolders?.value),
            },
          ]
        : [],
  },
  agents: {
    title: 'Agents',
    description: "Explore Olas' ecosystem of sovereign and decentralized AI agents.",
    template: 'rich',
    snapshots: ['main'],
    buildMetrics: ({ main }) => fromMain(main),
  },
  'agents/omenstrat': {
    title: 'Omenstrat',
    description: 'Prediction agents on Gnosis.',
    template: 'rich',
    snapshots: ['predict'],
    buildMetrics: ({ predict }) =>
      predict
        ? [
            {
              label: 'DAA (7d avg)',
              value: m(predict.omenstrat?.dailyActiveAgents?.value),
            },
            {
              label: 'Max APR',
              value: predict.omenstrat?.apr?.value != null ? `${predict.omenstrat.apr.value}%` : '—',
            },
            {
              label: 'Success rate',
              value:
                predict.omenstrat?.successRate?.value != null
                  ? `${predict.omenstrat.successRate.value}%`
                  : '—',
            },
          ]
        : [],
  },
  'agents/babydegen': {
    title: 'BabyDegen',
    description: 'Modius and Optimus agents.',
    template: 'rich',
    snapshots: ['agent-economies'],
    buildMetrics: ({ agentEconomies }) =>
      agentEconomies
        ? [
            {
              label: 'DAA (7d avg)',
              value: m(agentEconomies.babyDegen?.dailyActiveAgents?.value),
            },
            {
              label: 'Optimus max OLAS APR',
              value:
                agentEconomies.babyDegen?.optimus?.value?.maxOlasApr != null
                  ? `${agentEconomies.babyDegen.optimus.value.maxOlasApr}%`
                  : '—',
            },
          ]
        : [],
  },
  'agents/agentsfun': {
    title: 'Agents.fun',
    description: 'Agents on Base.',
    template: 'rich',
    snapshots: ['agent-economies'],
    buildMetrics: ({ agentEconomies }) =>
      agentEconomies
        ? [
            {
              label: 'DAA (7d avg)',
              value: m(agentEconomies.agentsFun?.dailyActiveAgents?.value),
            },
          ]
        : [],
  },
  'mech-marketplace': {
    title: 'Mech Marketplace',
    description: 'Hire AI agents or offer yours on the marketplace.',
    template: 'rich',
    snapshots: ['main'],
    buildMetrics: ({ main }) =>
      main
        ? [
            {
              label: 'Avg. daily active agents (7d)',
              value: m(main.dailyActiveAgents?.value),
            },
            {
              label: 'Mech fees (USD)',
              value: m(main.mechFees?.value, main.mechFees?.value ? ' USD' : ''),
            },
            {
              label: 'Total operators',
              value: m(main.totalOperators?.value),
            },
          ]
        : [],
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
