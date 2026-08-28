import { VALORY_GIT_URL } from 'common-util/constants';
import { ExternalLink } from 'components/ui/typography';

// Shared content of the OFF (PoL fee switch) tooltip, used by the desktop
// connectors and the mobile PoL section.
export const PolFeeSwitchTooltip = () => (
  <>
    <strong>Fees collected from PoL</strong> can be turned on or off by the Governors of the Olas
    Protocol. Currently, fees are turned off and stay in the pools; turning them on is subject to
    the implementation of AIP-7, which is designed to burn OLAS and send the rest of the tokens to
    the Olas Treasury.
    <ExternalLink
      href={`${VALORY_GIT_URL}/autonolas-aip/blob/main/content/aips/aip-7/core-aip-ultrasound-pol.md`}
      className="mt-2 cursor-pointer"
    >
      More about Mech Marketplace fees in AIP-7
    </ExternalLink>
  </>
);
