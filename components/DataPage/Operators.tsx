import { REGISTRY_SQUID_URLS, REGISTRY_SUBGRAPH_URLS } from 'common-util/indexers';
import { SUB_HEADER_LG_CLASS, TEXT_MEDIUM_CLASS } from 'common-util/classes';

import { operatorGlobalsQuery, operatorGlobalsSquidQuery } from 'common-util/graphql/queries';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { IndexerLinks } from './IndexerLinks';
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
          Subgraph links: <IndexerLinks urls={REGISTRY_SUBGRAPH_URLS} />
        </p>
        <CodeSnippet>{operatorGlobalsQuery}</CodeSnippet>
        <p className="text-purple-600">
          Squid links (OpenReader dialect): <IndexerLinks urls={REGISTRY_SQUID_URLS} />
        </p>
        <CodeSnippet>{operatorGlobalsSquidQuery}</CodeSnippet>
      </div>
    </SectionWrapper>
  );
};
