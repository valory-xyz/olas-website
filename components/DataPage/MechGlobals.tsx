import { SUB_HEADER_LG_CLASS, TEXT_MEDIUM_CLASS } from 'common-util/classes';
import { mechMarketplaceTotalRequestsQuery } from 'common-util/graphql/queries';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { ExternalLink } from 'components/ui/typography';
import { CodeSnippet } from './CodeSnippet';

export const MechGlobalsInfo = () => {
  return (
    <SectionWrapper id="mech-globals">
      <h2 className={SUB_HEADER_LG_CLASS}>Mech Globals</h2>

      <div className="space-y-6 mt-4">
        <p>
          Total requests and deliveries are aggregated from Mech Marketplace subgraphs on Gnosis and
          Base.
        </p>

        <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>Mech Marketplace Globals Query</h3>
        <p className="text-purple-600">
          Subgraph links:{' '}
          <ExternalLink
            href={process.env.NEXT_PUBLIC_GNOSIS_MARKETPLACE_SUBGRAPH_URL}
            className="mr-2"
          >
            Gnosis Marketplace
          </ExternalLink>
          <ExternalLink href={process.env.NEXT_PUBLIC_BASE_MARKETPLACE_SUBGRAPH_URL}>
            Base Marketplace
          </ExternalLink>
        </p>
        <CodeSnippet>{mechMarketplaceTotalRequestsQuery}</CodeSnippet>
      </div>
    </SectionWrapper>
  );
};
