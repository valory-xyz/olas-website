import { SUB_HEADER_LG_CLASS, TEXT_MEDIUM_CLASS } from 'common-util/classes';
import { stakingGlobalsQuery } from 'common-util/graphql/queries';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { ExternalLink } from 'components/ui/typography';
import { CodeSnippet } from './CodeSnippet';

export const OlasStakedInfo = () => {
  return (
    <SectionWrapper id="olas-staked">
      <h2 className={SUB_HEADER_LG_CLASS}>OLAS Staked</h2>

      <div className="space-y-6 mt-4">
        <p>
          Tracks the total amount of OLAS tokens currently staked across all
          agents in the ecosystem. This metric provides insight into the overall
          economic security and commitment level across all supported networks.
        </p>

        <p>The following query is used to compute total OLAS staked:</p>

        <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>
          Staking Globals query
        </h3>

        <p className="text-purple-600">
          Subgraph links:{' '}
          {[
            process.env.NEXT_PUBLIC_GNOSIS_REGISTRY_SUBGRAPH_URL,
            process.env.NEXT_PUBLIC_BASE_REGISTRY_SUBGRAPH_URL,
            process.env.NEXT_PUBLIC_MODE_REGISTRY_SUBGRAPH_URL,
            process.env.NEXT_PUBLIC_OPTIMISM_REGISTRY_SUBGRAPH_URL,
          ].map((link, index) => (
            <ExternalLink key={index} href={link} className="mr-2">
              {index + 1}
            </ExternalLink>
          ))}
        </p>
        <CodeSnippet>{stakingGlobalsQuery}</CodeSnippet>
      </div>
    </SectionWrapper>
  );
};
