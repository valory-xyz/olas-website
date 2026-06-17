import { SUB_HEADER_LG_CLASS, TEXT_MEDIUM_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import Verify from 'components/Verify';

export const FeesInfo = () => {
  return (
    <SectionWrapper id="protocol-fees">
      <h2 className={SUB_HEADER_LG_CLASS}>Protocol Fees and OLAS Burn</h2>

      <div className="space-y-6 mt-4">
        <p>
          Tracks the amount of protocol fees collected by the Mech Marketplace. A 15% fee is taken
          on agent-to-agent payments and accrues in each chain&apos;s balance tracker contract. The
          &quot;fees collected&quot; figure is read on-chain from the balance trackers&apos;{' '}
          <code>collectedFees</code> (currently counting tokens that are ~= 1 USD — USDC and Gnosis
          xDAI). When the fees are distributed, non-OLAS fees are sent to the Olas Treasury and OLAS
          fees are burned.
        </p>
        <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>
          Verify collected fees (balance tracker <code>collectedFees</code> on each counted chain):
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
        </div>
      </div>
    </SectionWrapper>
  );
};
