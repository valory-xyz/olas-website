import { SUB_HEADER_LG_CLASS } from 'common-util/classes';
import { ETHERSCAN_URL, VOTE_WEIGHTING_ADDRESS } from 'common-util/constants';
import { stakingContractsSquidQuery } from 'common-util/graphql/queries';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { ExternalLink } from 'components/ui/typography';
import { SubgraphLink } from './SubgraphLink';
import { CodeSnippet } from './CodeSnippet';

export const PolystratAprInfo = () => {
  const query = stakingContractsSquidQuery(['<active staking contracts on Polygon>']);

  return (
    <SectionWrapper id="polystrat-predict-apr">
      <h2 className={SUB_HEADER_LG_CLASS}>Polystrat: Predict APR (OLAS Staking)</h2>

      <div className="space-y-6 mt-4">
        <p>
          APR is computed from the OLAS staking contracts on Polygon, filtered to only the ones
          nominated in the{' '}
          <ExternalLink href={`${ETHERSCAN_URL}/address/${VOTE_WEIGHTING_ADDRESS}#readContract`}>
            VoteWeighting contract
          </ExternalLink>{' '}
          on Ethereum (getAllNominees). For each of them we query rewards per second, minimum
          staking deposit, and number of agent instances from the staking squid, then take the
          maximum APR across contracts. For each time range, contracts nominated at any point within
          that range are considered.
        </p>

        <p className="text-purple-600">
          Squid link:{' '}
          <SubgraphLink apiUrl={process.env.NEXT_PUBLIC_STAKING_POLYGON_SQUID_URL}>
            Polygon
          </SubgraphLink>
        </p>

        <p>Query:</p>
        <CodeSnippet>{query}</CodeSnippet>
      </div>
    </SectionWrapper>
  );
};
