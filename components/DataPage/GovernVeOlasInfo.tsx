import { SUB_HEADER_LG_CLASS, TEXT_MEDIUM_CLASS } from 'common-util/classes';
import { TOKENOMICS_SUBGRAPH_URLS } from 'common-util/constants';
import {
  getActiveVeOlasDepositorsQuery,
  veOlasLockedBalanceQuery,
} from 'common-util/graphql/queries';
import { getSubgraphExplorerUrl } from 'common-util/subgraph';
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
          Counts the number of wallets with an active veOLAS lock on Ethereum. The metric sums all
          veOLAS depositors where <code>unlockTimestamp</code> is in the future, using the
          tokenomics subgraph.
        </p>

        <p>The following queries power the veOLAS metrics shown on the Govern page:</p>

        <div className="space-y-6 mt-4">
          <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>1) Active veOLAS depositors query</h3>
          <p>
            Used for counting wallets with active veOLAS locks where
            <code className="mx-1">unlockTimestamp</code> is in the future.
          </p>

          <p className="text-purple-600">
            Subgraph links:{' '}
            {TOKENOMICS_SUBGRAPH_URLS.map(({ key, url }) => (
              <ExternalLink key={key} href={getSubgraphExplorerUrl(url)} className="mr-2">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </ExternalLink>
            ))}
          </p>

          <CodeSnippet>{sampleQuery}</CodeSnippet>
        </div>

        <div className="space-y-6 mt-4">
          <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>2) veOLAS token balance</h3>
          <p>
            Reads the locked OLAS amount directly from the veOLAS token entry in the same subgraph.
          </p>

          <p className="text-purple-600">
            Subgraph links:{' '}
            {TOKENOMICS_SUBGRAPH_URLS.map(({ key, url }) => (
              <ExternalLink key={key} href={getSubgraphExplorerUrl(url)} className="mr-2">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </ExternalLink>
            ))}
          </p>

          <CodeSnippet>{veOlasLockedBalanceQuery}</CodeSnippet>
        </div>
      </div>
    </SectionWrapper>
  );
};
