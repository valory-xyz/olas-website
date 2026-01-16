import { SUB_HEADER_LG_CLASS, TEXT_MEDIUM_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import Verify from 'components/Verify';

export const FeesInfo = () => {
  return (
    <SectionWrapper id="protocol-fees">
      <h2 className={SUB_HEADER_LG_CLASS}>Protocol Fees and OLAS Burn</h2>

      <div className="space-y-6 mt-4">
        <p>
          Tracks the amount of protocol fees collected and their conversion into OLAS for burning.
          Currently, protocol fees are set to 0% , which means no fees are generated, no tokens are
          converted into OLAS, and therefore no OLAS are burned at this time.
        </p>
        <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>Verify on-chain:</h3>
        <div className="flex gap-2">
          <Verify
            url="https://gnosisscan.io/address/0x735faab1c4ec41128c367afb5c3bac73509f70bb#readProxyContract#F8"
            text="1"
          />
          <Verify
            url="https://basescan.org/address/0xf24eE42edA0fc9b33B7D41B06Ee8ccD2Ef7C5020#readProxyContract#F8"
            text="2"
          />
        </div>
      </div>
    </SectionWrapper>
  );
};
