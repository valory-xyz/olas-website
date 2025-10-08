import { TOKEN_HOLDER_NETWORKS } from 'common-util/api/tokenomics';
import { SUB_HEADER_LG_CLASS, TEXT_MEDIUM_CLASS } from 'common-util/classes';
import { TOKENOMICS_SUBGRAPH_URLS } from 'common-util/constants';
import { holderCountsQuery } from 'common-util/graphql/queries';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { CodeSnippet } from './CodeSnippet';

const TokenHoldersQuerySnippet = () => (
  <CodeSnippet>
    {holderCountsQuery.loc?.source?.body || holderCountsQuery}
  </CodeSnippet>
);

export const TokenHoldersInfo = () => (
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
        {TOKENOMICS_SUBGRAPH_URLS.filter(Boolean).map((link, index) => (
          <a
            key={link}
            href={link}
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
          {TOKEN_HOLDER_NETWORKS.map(({ key, token }) => (
            <li key={key}>
              <span className="font-semibold capitalize">{key}</span>:{' '}
              <code>{token}</code>
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
          network&apos;s token address (lowercase) to retrieve the holder count.
        </p>
        <TokenHoldersQuerySnippet />
      </div>
    </div>
  </SectionWrapper>
);
