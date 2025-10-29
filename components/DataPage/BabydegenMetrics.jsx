import { SUB_HEADER_LG_CLASS, TEXT_MEDIUM_CLASS } from 'common-util/classes';
import {
  dailyBabydegenPopulationMetricsQuery,
  dailyStakingGlobalsSnapshotsQuery,
} from 'common-util/graphql/queries';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { ExternalLink } from 'components/ui/typography';
import { CodeSnippet } from './CodeSnippet';

const docToString = (doc) => {
  if (typeof doc === 'string') return doc;
  return doc?.loc?.source?.body ?? '';
};

const OPTIMISM_POPULATION_QUERY_STRING = docToString(
  dailyBabydegenPopulationMetricsQuery({ first: 10 }),
);

const OPTIMISM_STAKING_QUERY_STRING = docToString(
  dailyStakingGlobalsSnapshotsQuery({ first: 10 }),
);

export const BabydegenMetricsInfo = () => {
  const babydegenSubgraphLinks = [
    process.env.NEXT_PUBLIC_OPTIMISM_BABYDEGEN_SUBGRAPH_URL,
  ].filter(Boolean);

  const stakingSubgraphLinks = [
    process.env.NEXT_PUBLIC_OPTIMISM_STAKING_SUBGRAPH_URL,
  ].filter(Boolean);

  return (
    <SectionWrapper id="babydegen-metrics">
      <h2 className={SUB_HEADER_LG_CLASS}>BabyDegen Optimus Metrics</h2>

      <div className="space-y-6 mt-4">
        <p>
          This API aggregates Optimus agent metrics from the BabyDegen and
          Optimism staking subgraphs. Population metrics (daily APR projections,
          agent age, and funded AUM) are fetched from the BabyDegen subgraph,
          while staking reward snapshots come from the Optimism staking
          subgraph. Together with the live OLAS price, those datasets are used
          to compute the derived staking APR exposed on the BabyDegen economy
          page.
        </p>

        <p>
          The resulting API response populates the Optimus agent economy card
          with three values:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>APR, Relative to USDC – Moving Average 7D</strong> maps to
            the <code>sma7dProjectedUnrealisedPnL</code> field from the
            population metrics query.
          </li>
          <li>
            <strong>APR, Relative to ETH – Moving Average 7D</strong> maps to
            the <code>sma7dEthAdjustedProjectedUnrealisedPnL</code> field in the
            same response.
          </li>
          <li>
            <strong>APR, OLAS – Via OLAS Staking</strong> is derived by
            combining the population metrics with staking deltas from the
            Optimism staking subgraph and the CoinGecko OLAS/USD price feed,
            following the methodology in{' '}
            <code>fetch-babydegen-staking-apr.js</code>.
          </li>
        </ul>

        <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>
          BabyDegen Population Metrics Query
        </h3>
        <p className="text-purple-600">
          Subgraph link{' '}
          {babydegenSubgraphLinks.length > 0 ? (
            babydegenSubgraphLinks.map((link, index) => (
              <ExternalLink key={link} href={link} className="mr-2">
                {index + 1}
              </ExternalLink>
            ))
          ) : (
            <span>Unavailable</span>
          )}
        </p>
        <CodeSnippet>{OPTIMISM_POPULATION_QUERY_STRING}</CodeSnippet>

        <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>
          Optimism Staking Snapshots Query
        </h3>
        <p className="text-purple-600">
          Subgraph link{' '}
          {stakingSubgraphLinks.length > 0 ? (
            stakingSubgraphLinks.map((link, index) => (
              <ExternalLink key={link} href={link} className="mr-2">
                {index + 1}
              </ExternalLink>
            ))
          ) : (
            <span>Unavailable</span>
          )}
        </p>
        <CodeSnippet>{OPTIMISM_STAKING_QUERY_STRING}</CodeSnippet>
      </div>
    </SectionWrapper>
  );
};
