import { SUB_HEADER_LG_CLASS } from 'common-util/classes';
import { GNOSIS_STAKING_CONTRACTS } from 'common-util/constants';
import { stakingContractsQuery } from 'common-util/graphql/queries';
import { getSubgraphExplorerUrl } from 'common-util/subgraph';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { ExternalLink } from 'components/ui/typography';
import { CodeSnippet } from './CodeSnippet';

export const OmenstratAprInfo = () => {
  const query = stakingContractsQuery(GNOSIS_STAKING_CONTRACTS);

  return (
    <SectionWrapper id="omenstrat-predict-apr">
      <h2 className={SUB_HEADER_LG_CLASS}>Omenstrat: Predict APR (OLAS Staking)</h2>

      <div className="space-y-6 mt-4">
        <p>
          APR is computed from the OLAS staking contracts on Gnosis by querying rewards per second,
          minimum staking deposit, and number of agent instances, then taking the maximum APR across
          contracts.
        </p>

        <p className="text-purple-600">
          Subgraph link:{' '}
          <ExternalLink
            href={getSubgraphExplorerUrl(process.env.NEXT_PUBLIC_GNOSIS_STAKING_SUBGRAPH_URL)}
          >
            Gnosis
          </ExternalLink>
        </p>

        <p>Query:</p>
        <CodeSnippet>{query}</CodeSnippet>
      </div>
    </SectionWrapper>
  );
};
