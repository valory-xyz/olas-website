import { SUB_HEADER_LG_CLASS, TEXT_MEDIUM_CLASS } from 'common-util/classes';
import { operatorGlobalsQuery } from 'common-util/graphql/queries';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { ExternalLink } from 'components/ui/typography';
import { CodeSnippet } from './CodeSnippet';

export const OperatorsInfo = () => {
  return (
    <SectionWrapper id="operators">
      <h2 className={SUB_HEADER_LG_CLASS}>Operators</h2>

      <div className="space-y-6 mt-4">
        <p>
          Tracks the total number of unique operators across all supported
          networks. This metric aggregates operator data from multiple
          blockchain sources to provide a comprehensive view of the autonomous
          agent operator ecosystem and network participation.
        </p>

        <p>The following query aggregates operators from all chains:</p>

        <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>Operators Query</h3>

        <p className="text-purple-600">
          Subgraph links:{' '}
          <ExternalLink
            href={process.env.NEXT_PUBLIC_GNOSIS_REGISTRY_SUBGRAPH_URL}
            className="mr-2"
          >
            Gnosis
          </ExternalLink>
          <ExternalLink
            href={process.env.NEXT_PUBLIC_BASE_REGISTRY_SUBGRAPH_URL}
            className="mr-2"
          >
            Base
          </ExternalLink>
          <ExternalLink
            href={process.env.NEXT_PUBLIC_MODE_REGISTRY_SUBGRAPH_URL}
            className="mr-2"
          >
            Mode
          </ExternalLink>
          <ExternalLink
            href={process.env.NEXT_PUBLIC_OPTIMISM_REGISTRY_SUBGRAPH_URL}
            className="mr-2"
          >
            Optimism
          </ExternalLink>
          <ExternalLink
            href={process.env.NEXT_PUBLIC_CELO_REGISTRY_SUBGRAPH_URL}
            className="mr-2"
          >
            Celo
          </ExternalLink>
          <ExternalLink
            href={process.env.NEXT_PUBLIC_ETHEREUM_REGISTRY_SUBGRAPH_URL}
            className="mr-2"
          >
            Ethereum
          </ExternalLink>
          <ExternalLink
            href={process.env.NEXT_PUBLIC_POLYGON_REGISTRY_SUBGRAPH_URL}
            className="mr-2"
          >
            Polygon
          </ExternalLink>
          <ExternalLink
            href={process.env.NEXT_PUBLIC_ARBITRUM_REGISTRY_SUBGRAPH_URL}
          >
            Arbitrum
          </ExternalLink>
        </p>
        <CodeSnippet>{operatorGlobalsQuery}</CodeSnippet>
      </div>
    </SectionWrapper>
  );
};
