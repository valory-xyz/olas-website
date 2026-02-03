import { SUB_HEADER_LG_CLASS, TEXT_MEDIUM_CLASS } from 'common-util/classes';
import { REGISTRY_SUBGRAPH_URLS } from 'common-util/constants';
import { operatorGlobalsQuery } from 'common-util/graphql/queries';
import { getSubgraphExplorerUrl } from 'common-util/subgraph';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { ExternalLink } from 'components/ui/typography';
import { CodeSnippet } from './CodeSnippet';

export const OperatorsInfo = () => {
  return (
    <SectionWrapper id="operators">
      <h2 className={SUB_HEADER_LG_CLASS}>Operators</h2>

      <div className="space-y-6 mt-4">
        <p>
          Tracks the total number of unique operators across all supported networks. This metric
          aggregates operator data from multiple blockchain sources to provide a comprehensive view
          of the autonomous agent operator ecosystem and network participation.
        </p>

        <p>The following query aggregates operators from all chains:</p>

        <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>Operators Query</h3>

        <p className="text-purple-600">
          Subgraph links:{' '}
          {REGISTRY_SUBGRAPH_URLS.map(({ key, url }) => (
            <ExternalLink key={key} href={getSubgraphExplorerUrl(url)} className="mr-2">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </ExternalLink>
          ))}
        </p>
        <CodeSnippet>{operatorGlobalsQuery}</CodeSnippet>
      </div>
    </SectionWrapper>
  );
};
