import {
  MARKETPLACE_CHAIN_SCOPE,
  MARKETPLACE_SQUID_URLS,
  MARKETPLACE_SUBGRAPH_URLS,
} from 'common-util/indexers';
import { SUB_HEADER_LG_CLASS, TEXT_MEDIUM_CLASS } from 'common-util/classes';
import { ataTransactionsQuery, ataTransactionsSquidQuery } from 'common-util/graphql/queries';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { CodeSnippet } from './CodeSnippet';
import { IndexerLinks } from './IndexerLinks';

export const AtaTransactionsInfo = () => {
  return (
    <SectionWrapper id="ata-transactions">
      <h2 className={SUB_HEADER_LG_CLASS}>ATA Transactions</h2>

      <div className="space-y-6 mt-4">
        <p>
          Tracks agent-to-agent transactions across {MARKETPLACE_CHAIN_SCOPE} from multiple subgraph
          and squid sources. This metric aggregates transaction data from Mech Marketplace and
          Legacy Mech subgraphs to provide a comprehensive view of autonomous agent interaction
          volume and cross-chain activity.
        </p>

        <p>The following query aggregates ATA transactions from all sources:</p>

        <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>ATA Transactions Query</h3>

        <p className="text-purple-600">
          Subgraph links: <IndexerLinks urls={MARKETPLACE_SUBGRAPH_URLS} />
        </p>
        <CodeSnippet>{ataTransactionsQuery}</CodeSnippet>
        <p className="text-purple-600">
          Squid links (OpenReader dialect): <IndexerLinks urls={MARKETPLACE_SQUID_URLS} />
        </p>
        <CodeSnippet>{ataTransactionsSquidQuery}</CodeSnippet>
      </div>
    </SectionWrapper>
  );
};
