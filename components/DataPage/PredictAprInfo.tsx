import { SUB_HEADER_LG_CLASS } from 'common-util/classes';
import {
  GNOSIS_STAKING_CONTRACTS,
  STAKING_SUBGRAPH_URLS,
} from 'common-util/constants';
import { stakingContractsQuery } from 'common-util/graphql/queries';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { ExternalLink } from 'components/ui/typography';
import { CodeSnippet } from './CodeSnippet';

export const PredictAprInfo = () => {
  const query = stakingContractsQuery(GNOSIS_STAKING_CONTRACTS);

  return (
    <SectionWrapper id="predict-apr">
      <h2 className={SUB_HEADER_LG_CLASS}>Predict APR (OLAS Staking)</h2>

      <div className="space-y-6 mt-4">
        <p>
          APR is computed from the OLAS staking contracts on Gnosis by querying
          rewards per second, minimum staking deposit, and number of agent
          instances, then taking the maximum APR across contracts.
        </p>

        <p>Subgraph used:</p>
        <ExternalLink href={STAKING_SUBGRAPH_URLS.gnosis}>
          Staking subgraph (Gnosis)
        </ExternalLink>

        <p>Query:</p>
        <CodeSnippet>{query}</CodeSnippet>
      </div>
    </SectionWrapper>
  );
};
