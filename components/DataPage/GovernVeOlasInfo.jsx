import { SUB_HEADER_LG_CLASS, TEXT_MEDIUM_CLASS } from 'common-util/classes';
import { TOKENOMICS_SUBGRAPH_URLS } from 'common-util/constants';
import {
  getActiveVeOlasDepositorsQuery,
  veOlasLockedBalanceQuery,
} from 'common-util/graphql/queries';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { ExternalLink } from 'components/ui/typography';
import { CodeSnippet } from './CodeSnippet';

export const GovernVeOlasInfo = () => {
  const sampleQuery = getActiveVeOlasDepositorsQuery({
    first: 1000,
    skip: 0,
    pages: 5,
    unlockAfter: '$unlockAfter',
  });

  return (
    <SectionWrapper id="govern-veolas">
      <h2 className={SUB_HEADER_LG_CLASS}>veOLAS Holders (Active)</h2>

      <div className="space-y-6 mt-4">
        <p>
          Counts the number of wallets with an active veOLAS lock on Ethereum.
          The metric sums all veOLAS depositors where{' '}
          <code>unlockTimestamp</code> is in the future, using the tokenomics
          subgraph.
        </p>

        <div>
          <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>Subgraph</h3>
          <p className="text-purple-600">
            <ExternalLink
              href={
                TOKENOMICS_SUBGRAPH_URLS.find((s) => s.key === 'ethereum')?.url
              }
            >
              Ethereum tokenomics subgraph
            </ExternalLink>
          </p>
        </div>

        <div>
          <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>
            Active veOLAS depositors query
          </h3>
          <p className="text-sm text-slate-500">
            Fetches multiple pages (5 pages of 1000 records = 5,000 per request)
            in a single GraphQL request for optimal performance. The{' '}
            <code>$unlockAfter</code> variable is set to the current UTC
            timestamp (seconds). Note: subgraph limits skip to 5000 max.
          </p>
          <CodeSnippet>{sampleQuery.loc.source.body}</CodeSnippet>

          <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>
            veOLAS token balance
          </h3>
          <p className="text-sm text-slate-500">
            The locked OLAS amount is read directly from the veOLAS token entry
            in the same subgraph.
          </p>
          <CodeSnippet>{veOlasLockedBalanceQuery.loc.source.body}</CodeSnippet>
        </div>
      </div>
    </SectionWrapper>
  );
};
