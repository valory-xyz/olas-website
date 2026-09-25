import { MECH_FEES_SQUID_URLS, MECH_FEES_SUBGRAPH_URLS } from 'common-util/indexers';
import { SUB_HEADER_LG_CLASS, TEXT_MEDIUM_CLASS } from 'common-util/classes';
import {
  mechFeesDrainTotalsQuery,
  mechFeesDrainTotalsSquidQuery,
} from 'common-util/graphql/queries';
import SectionWrapper from 'components/Layout/SectionWrapper';
import Verify from 'components/Verify';
import { CodeSnippet } from './CodeSnippet';
import { IndexerLinks } from './IndexerLinks';

export const FeesInfo = () => {
  return (
    <SectionWrapper id="protocol-fees">
      <h2 className={SUB_HEADER_LG_CLASS}>Protocol Fees and OLAS Burn</h2>

      <div className="space-y-6 mt-4">
        <p>
          Tracks the amount of protocol fees collected by the Mech Marketplace. A 15% fee is taken
          on agent-to-agent payments and accrues in each chain&apos;s balance tracker contract until
          the DAO drains it. The &quot;fees collected&quot; figure is the sum of two parts: the
          not-yet-drained balance, read on-chain from each tracker&apos;s <code>collectedFees</code>
          , plus everything already drained, read from the <code>DrainTotals</code> entity of the
          mech fees subgraphs, or the mech fees squid on Robinhood Chain (one row per payment model,
          priced in USD at drain time). Counted trackers: USDC on Ethereum, Arbitrum, Celo,
          Optimism, Polygon and Base; xDAI on Gnosis; ETH on Base and Optimism; POL on Polygon; USDG
          on Robinhood Chain. ETH and POL are valued with the same Chainlink feeds the subgraphs
          use. Not counted: the ETH trackers on Ethereum, Arbitrum and Robinhood Chain, the CELO
          tracker, and OLAS-denominated fees — when fees are distributed, non-OLAS fees are sent to
          the Olas Treasury and OLAS fees are burned. A reading is held back if any token&apos;s
          lifetime amount would fall below the previous snapshot.
        </p>
        <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>
          Verify un-drained fees (balance tracker <code>collectedFees</code> on each counted chain):
        </h3>
        <div className="flex flex-wrap gap-3">
          <Verify
            url="https://gnosisscan.io/address/0x21cE6799A22A3Da84B7c44a814a9c79ab1d2A50D#readContract"
            text="Gnosis (xDAI)"
          />
          <Verify
            url="https://etherscan.io/address/0x897aee2e6F3d37740D334C55Caea2e0caC82aa14#readContract"
            text="Ethereum (USDC)"
          />
          <Verify
            url="https://arbiscan.io/address/0xa987Fe40034AaD2EbB0E01B22DFc57f20C87F949#readContract"
            text="Arbitrum (USDC)"
          />
          <Verify
            url="https://celoscan.io/address/0xA749f605D93B3efcc207C54270d83C6E8fa70fF8#readContract"
            text="Celo (USDC)"
          />
          <Verify
            url="https://optimistic.etherscan.io/address/0xA123748Ce7609F507060F947b70298D0bde621E6#readContract"
            text="Optimism (USDC)"
          />
          <Verify
            url="https://polygonscan.com/address/0x5C50ebc17d002A4484585C8fbf62f51953493c0B#readContract"
            text="Polygon (USDC)"
          />
          <Verify
            url="https://basescan.org/address/0x0443C55e151dBA13fae079518F9dd01ff9c21CB2#readContract"
            text="Base (USDC)"
          />
          <Verify
            url="https://basescan.org/address/0xB3921F8D8215603f0Bd521341Ac45eA8f2d274c1#readContract"
            text="Base (ETH)"
          />
          <Verify
            url="https://optimistic.etherscan.io/address/0x4Cd816ce806FF1003ee459158A093F02AbF042a8#readContract"
            text="Optimism (ETH)"
          />
          {/* Same address as the Olas Tokenomics proxy on Ethereum; a different contract here. */}
          <Verify
            url="https://polygonscan.com/address/0xc096362fa6f4A4B1a9ea68b1043416f3381ce300#readContract"
            text="Polygon (POL)"
          />
          <Verify
            url="https://robinhoodchain.blockscout.com/address/0xEB5638eefE289691EcE01943f768EDBF96258a80?tab=read_contract"
            text="Robinhood Chain (USDG)"
          />
        </div>
        <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>Drained fees query</h3>
        <p className="text-purple-600">
          Subgraph links: <IndexerLinks urls={MECH_FEES_SUBGRAPH_URLS} />
        </p>
        <CodeSnippet>{mechFeesDrainTotalsQuery}</CodeSnippet>
        <p className="text-purple-600">
          Squid links (OpenReader dialect): <IndexerLinks urls={MECH_FEES_SQUID_URLS} />
        </p>
        <CodeSnippet>{mechFeesDrainTotalsSquidQuery}</CodeSnippet>
      </div>
    </SectionWrapper>
  );
};
