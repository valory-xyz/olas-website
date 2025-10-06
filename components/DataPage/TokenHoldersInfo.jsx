import { SUB_HEADER_LG_CLASS, TEXT_MEDIUM_CLASS } from 'common-util/classes';
import { holderCountsQuery } from 'common-util/graphql/queries';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { CodeSnippet } from './CodeSnippet';

const TOKEN_ADDRESSES = {
  ethereum: '0x0001A500A6B18995B03f44bb040A5fFc28E45CB0',
  arbitrum: '0x064F8B858C2A603e1b106a2039F5446D32dc81c1',
  base: '0x54330d28ca3357F294334BDC454a032e7f353416',
  celo: '0xaCFfAe8e57Ec6E394Eb1b41939A8CF7892DbDc51',
  gnosis: '0xcE11e14225575945b8E6Dc0D4F2dD4C570f79d9f',
  optimism: '0xFC2E6e6BCbd49ccf3A5f029c79984372DcBFE527',
  polygon: '0xFEF5d947472e72Efbb2E388c730B7428406F2F95',
};

const TOKENOMICS_SUBGRAPHS = [
  process.env.NEXT_PUBLIC_GRAPH_ENDPOINT_MAINNET,
  process.env.NEXT_PUBLIC_TOKENOMICS_ARBITRUM_SUBGRAPH_URL,
  process.env.NEXT_PUBLIC_TOKENOMICS_BASE_SUBGRAPH_URL,
  process.env.NEXT_PUBLIC_TOKENOMICS_CELO_SUBGRAPH_URL,
  process.env.NEXT_PUBLIC_TOKENOMICS_GNOSIS_SUBGRAPH_URL,
  process.env.NEXT_PUBLIC_TOKENOMICS_OPTIMISM_SUBGRAPH_URL,
  process.env.NEXT_PUBLIC_TOKENOMICS_POLYGON_SUBGRAPH_URL,
];

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
        {TOKENOMICS_SUBGRAPHS.filter(Boolean).map((link, index) => (
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
          {Object.entries(TOKEN_ADDRESSES).map(([chain, address]) => (
            <li key={chain}>
              <span className="font-semibold capitalize">{chain}</span>:{' '}
              <code>{address}</code>
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
