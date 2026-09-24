import { STAKING_SUBGRAPH_URLS } from 'common-util/indexers';
import { SUB_HEADER_LG_CLASS, TEXT_MEDIUM_CLASS } from 'common-util/classes';

import { stakingGlobalsQuery } from 'common-util/graphql/queries';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { IndexerLinks } from './IndexerLinks';
import { CodeSnippet } from './CodeSnippet';

export const OlasStakedInfo = () => {
  return (
    <SectionWrapper id="olas-staked">
      <h2 className={SUB_HEADER_LG_CLASS}>OLAS Staked</h2>

      <div className="space-y-6 mt-4">
        <p>
          Tracks the total amount of OLAS tokens currently staked across all agents in the
          ecosystem. This metric provides insight into the overall economic security and commitment
          level across all supported networks.
        </p>

        <p>The following query is used to compute total OLAS staked:</p>

        <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>Staking Globals query</h3>

        <p className="text-purple-600">
          Subgraph links: <IndexerLinks urls={STAKING_SUBGRAPH_URLS} />
        </p>
        <CodeSnippet>{stakingGlobalsQuery}</CodeSnippet>
      </div>
    </SectionWrapper>
  );
};
