import { SUB_HEADER_LG_CLASS } from 'common-util/classes';
import { ETHERSCAN_URL, VOTE_WEIGHTING_ADDRESS } from 'common-util/constants';
import { stakingContractsQuery } from 'common-util/graphql/queries';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { ExternalLink } from 'components/ui/typography';
import { SubgraphLink } from './SubgraphLink';
import { CodeSnippet } from './CodeSnippet';

export const OmenstratAprInfo = () => {
  const query = stakingContractsQuery(['<active staking contracts on Gnosis>']);

  return (
    <SectionWrapper id="omenstrat-predict-apr">
      <h2 className={SUB_HEADER_LG_CLASS}>Omenstrat: Predict APR (OLAS Staking)</h2>

      <div className="space-y-6 mt-4">
        <p>
          APR is computed from the OLAS staking contracts on Gnosis, filtered to only the ones
          nominated in the{' '}
          <ExternalLink href={`${ETHERSCAN_URL}/address/${VOTE_WEIGHTING_ADDRESS}#readContract`}>
            VoteWeighting contract
          </ExternalLink>{' '}
          on Ethereum (getAllNominees). For each of them we query rewards per second, minimum
          staking deposit, and number of agent instances from the staking subgraph, then take the
          maximum APR across contracts. For each time range, contracts nominated at any point within
          that range are considered.
        </p>

        <p className="text-purple-600">
          Subgraph link:{' '}
          <SubgraphLink apiUrl={process.env.NEXT_PUBLIC_GNOSIS_STAKING_SUBGRAPH_URL}>
            Gnosis
          </SubgraphLink>
        </p>

        <p>Query:</p>
        <CodeSnippet>{query}</CodeSnippet>
      </div>
    </SectionWrapper>
  );
};
