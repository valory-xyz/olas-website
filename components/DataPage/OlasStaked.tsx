import { SUB_HEADER_LG_CLASS, TEXT_MEDIUM_CLASS } from 'common-util/classes';
import { STAKING_SUBGRAPH_URLS } from 'common-util/constants';
import { stakingGlobalsQuery } from 'common-util/graphql/queries';
import { getSubgraphExplorerUrl } from 'common-util/subgraph';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { ExternalLink } from 'components/ui/typography';
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
          Subgraph links:{' '}
          {STAKING_SUBGRAPH_URLS.map(({ key, url }) => (
            <ExternalLink key={key} href={getSubgraphExplorerUrl(url)} className="mr-2">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </ExternalLink>
          ))}
        </p>
        <CodeSnippet>{stakingGlobalsQuery}</CodeSnippet>
      </div>
    </SectionWrapper>
  );
};
