import { SUB_HEADER_LG_CLASS, TEXT_MEDIUM_CLASS } from 'common-util/classes';
import { MODIUS_FIXED_END_DATE_UTC } from 'common-util/constants';
import {
  dailyBabydegenPopulationMetricsQuery,
  dailyStakingGlobalsSnapshotsQuery,
} from 'common-util/graphql/queries';
import { getSubgraphExplorerUrl } from 'common-util/subgraph';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { ExternalLink } from 'components/ui/typography';
import { CodeSnippet } from './CodeSnippet';

const MODIUS_FIXED_END_TIMESTAMP = Math.floor(new Date(MODIUS_FIXED_END_DATE_UTC).getTime() / 1000);

export const BabydegenMetricsInfo = () => {
  return (
    <SectionWrapper id="babydegen-metrics">
      <h2 className={SUB_HEADER_LG_CLASS}>BabyDegen Metrics</h2>

      <div className="space-y-6 mt-4">
        <p>
          This API aggregates BabyDegen agent metrics from the BabyDegen and staking subgraphs.
          Population metrics (daily APR projections, agent age, and funded AUM) are fetched from the
          BabyDegen subgraph, while staking reward snapshots come from the staking subgraphs.
          Together with the live OLAS price, those datasets are used to compute the derived APR
          exposed on the BabyDegen economy page.
        </p>

        <p>
          The resulting API response populates the Optimus agent economy card with three values:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>APR, Relative to USDC - Moving Average 7D</strong> maps to the{' '}
            <code>sma7dProjectedUnrealisedPnL</code> field from the population metrics query.
          </li>
          <li>
            <strong>APR, Relative to ETH - Moving Average 7D</strong> maps to the{' '}
            <code>sma7dEthAdjustedProjectedUnrealisedPnL</code> field in the same response.
          </li>
          <li>
            <strong>APR, OLAS - Via OLAS Staking</strong> is derived by combining the population
            metrics with staking deltas from the Optimism staking subgraph and the CoinGecko
            OLAS/USD price feed, following the methodology in{' '}
            <code>fetch-babydegen-staking-apr.js</code>.
          </li>
        </ul>

        <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>BabyDegen Population Metrics Query</h3>
        <p className="text-purple-600">
          Subgraph link{' '}
          <ExternalLink
            href={getSubgraphExplorerUrl(process.env.NEXT_PUBLIC_OPTIMISM_BABYDEGEN_SUBGRAPH_URL)}
          >
            Optimism BabyDegen
          </ExternalLink>
        </p>
        <CodeSnippet>{dailyBabydegenPopulationMetricsQuery({ first: 10 })}</CodeSnippet>

        <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>Optimism Staking Snapshots Query</h3>
        <p className="text-purple-600">
          Subgraph link{' '}
          <ExternalLink
            href={getSubgraphExplorerUrl(process.env.NEXT_PUBLIC_OPTIMISM_STAKING_SUBGRAPH_URL)}
          >
            Optimism Staking
          </ExternalLink>
        </p>
        <CodeSnippet>{dailyStakingGlobalsSnapshotsQuery({ first: 10 })}</CodeSnippet>

        <h3 className={`${TEXT_MEDIUM_CLASS} font-bold mt-10`}>Modius Population Metrics Query</h3>
        <p className="text-purple-600">
          Subgraph link{' '}
          <ExternalLink
            href={getSubgraphExplorerUrl(process.env.NEXT_PUBLIC_MODE_BABYDEGEN_SUBGRAPH_URL)}
          >
            Mode BabyDegen
          </ExternalLink>
        </p>
        <CodeSnippet>
          {dailyBabydegenPopulationMetricsQuery({
            first: 7,
            timestampLte: MODIUS_FIXED_END_TIMESTAMP,
          })}
        </CodeSnippet>

        <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>Modius Staking Snapshots Query</h3>
        <p className="text-purple-600">
          Subgraph link{' '}
          <ExternalLink href={process.env.NEXT_PUBLIC_MODE_STAKING_SUBGRAPH_URL}>
            Mode Staking
          </ExternalLink>
        </p>
        <CodeSnippet>
          {dailyStakingGlobalsSnapshotsQuery({
            first: 7,
            timestampLte: MODIUS_FIXED_END_TIMESTAMP,
          })}
        </CodeSnippet>
      </div>
    </SectionWrapper>
  );
};
