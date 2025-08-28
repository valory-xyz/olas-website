import { SUB_HEADER_LG_CLASS, TEXT_MEDIUM_CLASS } from 'common-util/classes';
import { ataTransactionsQuery } from 'common-util/graphql/queries';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { ExternalLink } from 'components/ui/typography';
import { CodeSnippet } from './CodeSnippet';

export const AtaTransactionsInfo = () => {
  return (
    <SectionWrapper id="ata-transactions">
      <h2 className={SUB_HEADER_LG_CLASS}>ATA Transactions</h2>

      <div className="space-y-6 mt-4">
        <p>
          Tracks agent-to-agent transactions across Gnosis and Base networks.
          This metric aggregates transaction data from multiple blockchain
          sources to provide a comprehensive view of autonomous agent
          interaction volume and cross-chain activity.
        </p>

        <p>The following query aggregates ATA transactions from both chains:</p>

        <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>
          ATA Transactions Query
        </h3>

        <p className="text-purple-600">
          Subgraph links:{' '}
          <ExternalLink
            href={process.env.NEXT_PUBLIC_GNOSIS_ATA_SUBGRAPH_URL}
            className="mr-2"
          >
            Gnosis
          </ExternalLink>
          <ExternalLink href={process.env.NEXT_PUBLIC_BASE_ATA_SUBGRAPH_URL}>
            Base
          </ExternalLink>
        </p>
        <CodeSnippet>{ataTransactionsQuery}</CodeSnippet>
      </div>
    </SectionWrapper>
  );
};
