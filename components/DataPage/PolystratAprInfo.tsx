import { SUB_HEADER_LG_CLASS } from 'common-util/classes';
import { stakingContractsQuery } from 'common-util/graphql/queries';
import { getSubgraphExplorerUrl } from 'common-util/subgraph';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { ExternalLink } from 'components/ui/typography';
import { CodeSnippet } from './CodeSnippet';

export const PolystratAprInfo = () => {
  const query = stakingContractsQuery([]);

  return (
    <SectionWrapper id="polystrat-predict-apr">
      <h2 className={SUB_HEADER_LG_CLASS}>Polystrat: Predict APR (OLAS Staking)</h2>

      <div className="space-y-6 mt-4">
        <p>
          APR is computed from the OLAS staking contracts on Polygon by querying rewards per second,
          minimum staking deposit, and number of agent instances, then taking the maximum APR across
          contracts.
        </p>

        <p className="text-purple-600">
          Subgraph link:{' '}
          <ExternalLink
            href={getSubgraphExplorerUrl(process.env.NEXT_PUBLIC_POLYGON_STAKING_SUBGRAPH_URL)}
          >
            Polygon
          </ExternalLink>
        </p>

        <p>Query:</p>
        <CodeSnippet>{query}</CodeSnippet>
      </div>
    </SectionWrapper>
  );
};
