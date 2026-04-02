import { SUB_HEADER_LG_CLASS, TEXT_MEDIUM_CLASS } from 'common-util/classes';
import { DUNE_TOTAL_PROTOCOL_REVENUE_URL, LIQUIDITY_SUBGRAPH_URLS } from 'common-util/constants';
import { liquidityEthQuery, liquidityL2Query } from 'common-util/graphql/queries';
import { getSubgraphExplorerUrl } from 'common-util/subgraph';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { ExternalLink } from 'components/ui/typography';
import { CodeSnippet } from './CodeSnippet';

export const ProtocolOwnedLiquidityInfo = () => {
  return (
    <SectionWrapper id="protocol-owned-liquidity">
      <h2 className={SUB_HEADER_LG_CLASS}>Total Protocol-owned Liquidity</h2>

      <div className="space-y-6 mt-4">
        <p>
          Tracks the total USD value of LP tokens held by the Olas Treasury across all chains. The
          Treasury acquires LP tokens permanently through the bonding mechanism, where participants
          deposit LP tokens in exchange for discounted OLAS.
        </p>

        <p>
          Total POL is computed by summing the Treasury&apos;s proportional share of each
          pool&apos;s value across 8 chains: Ethereum (OLAS-WETH, Uniswap V2), Gnosis (OLAS-WXDAI,
          Balancer), Polygon (OLAS-WMATIC, Balancer), Arbitrum (OLAS-WETH, Balancer), Optimism
          (WETH-OLAS, Balancer), Base (OLAS-USDC, Balancer), Celo (CELO-OLAS, Ubeswap), and Solana
          (WSOL-OLAS, Orca). All USD prices come from Chainlink oracles.
        </p>

        <p>
          For each pool: <code>Pool TVL = 2 &times; paired_token_reserves &times; price</code>, then{' '}
          <code>Treasury POL = Pool TVL &times; (bridged_LP_balance / total_supply)</code>. The
          Ethereum subgraph pre-computes <code>protocolOwnedLiquidityUsd</code> directly and also
          provides Chainlink prices (ETH/USD, MATIC/USD, SOL/USD) used for other chains.
        </p>

        <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>Ethereum Liquidity query</h3>
        <p className="text-purple-600">
          Subgraph links:{' '}
          {LIQUIDITY_SUBGRAPH_URLS.map(({ key, url }) => (
            <ExternalLink key={key} href={getSubgraphExplorerUrl(url)} className="mr-2">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </ExternalLink>
          ))}
        </p>
        <CodeSnippet>{liquidityEthQuery}</CodeSnippet>

        <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>L2 Pool Metrics query</h3>
        <p>
          Queried on each L2 chain (Gnosis, Polygon, Arbitrum, Optimism, Base, Celo) to get pool
          reserves and BPT total supply. Combined with bridged LP balances from the Ethereum
          subgraph to compute Treasury&apos;s share.
        </p>
        <CodeSnippet>{liquidityL2Query}</CodeSnippet>
      </div>
    </SectionWrapper>
  );
};

export const ProtocolFeesInfo = () => {
  return (
    <SectionWrapper id="protocol-liquidity-fees">
      <h2 className={SUB_HEADER_LG_CLASS}>Fees from Protocol-owned Liquidity</h2>

      <div className="space-y-6 mt-4">
        <p>
          Tracks the cumulative swap fees earned by the Treasury&apos;s LP positions across all
          chains. As swaps occur in each pool, a portion of each trade is distributed to LP holders
          proportionally. Since the Treasury holds the vast majority of LP tokens in each pool, it
          accrues the majority of fees.
        </p>

        <p>
          This metric is currently sourced from{' '}
          <ExternalLink href={DUNE_TOTAL_PROTOCOL_REVENUE_URL}>Dune Analytics</ExternalLink>.
        </p>
      </div>
    </SectionWrapper>
  );
};
