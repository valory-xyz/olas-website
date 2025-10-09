import { SUB_HEADER_LG_CLASS, TEXT_MEDIUM_CLASS } from 'common-util/classes';
import { TOKENOMICS_SUBGRAPH_URLS } from 'common-util/constants';
import { holderCountsQuery } from 'common-util/graphql/queries';
import SectionWrapper from 'components/Layout/SectionWrapper';
import tokens from 'data/tokens.json';
import { useMemo } from 'react';
import { CodeSnippet } from './CodeSnippet';

const TokenHoldersQuerySnippet = () => (
  <CodeSnippet>
    {holderCountsQuery.loc?.source?.body || holderCountsQuery}
  </CodeSnippet>
);

const toNetworkEntry = ({ key, name, address }) =>
  key && address ? { key, name, tokenAddress: address } : null;

const selectTokenHolderNetworks = () =>
  tokens
    .map(toNetworkEntry)
    .filter((entry) => entry?.key && entry?.tokenAddress);

export const TokenHolders = () => {
  const tokenNetworks = useMemo(selectTokenHolderNetworks, []);

  return (
    <SectionWrapper id="token-holders">
      <h2 className={SUB_HEADER_LG_CLASS}>Token Holders</h2>

      <div className="space-y-6 mt-4">
        <p>
          Aggregates the number of unique OLAS token holders across supported
          networks. Each network&apos;s tokenomics subgraph is queried for the
          token holder count, and results are summed to obtain the total holders
          metric shown on the OLAS Token page.
        </p>

        <p className="text-purple-600">
          Subgraph links:{' '}
          {TOKENOMICS_SUBGRAPH_URLS.map(({ key, url }, index) => (
            <a
              key={key}
              href={url}
              className="mr-2"
              rel="noopener noreferrer"
              target="_blank"
            >
              {index + 1}
            </a>
          ))}
        </p>

        <div>
          <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>Token addresses</h3>
          <ul className="list-disc list-inside text-sm text-slate-500">
            {tokenNetworks.map(({ key, tokenAddress, name }) => (
              <li key={key}>
                <span className="font-semibold">{name}</span>:{' '}
                <code>{tokenAddress}</code>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>
            Holder count query (per network)
          </h3>
          <p className="text-sm text-slate-500">
            The same query is executed against each tokenomics subgraph with the
            network&apos;s token address to retrieve the holder count.
          </p>
          <TokenHoldersQuerySnippet />
        </div>
      </div>
    </SectionWrapper>
  );
};
