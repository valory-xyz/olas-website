import { PEARL_YOU_URL } from 'common-util/constants';
import { SubsiteLink } from 'components/ui/typography';
import Image from 'next/image';
import Link from 'next/link';
import { OlasToken } from './OlasToken';

const InfoBlock = ({ imgSrc, title, className, children }) => (
  <div className={`flex flex-col max-sm:place-items-center lg:max-w-[250px] ${className}`}>
    <Image
      src={`/images/roadmap-page/${imgSrc}`}
      alt={title}
      width={78}
      height={78}
      className="mb-6"
    />
    <h5 className="mb-4 text-lg font-semibold">{title}</h5>
    <div>{children}</div>
  </div>
);

export const MMPearlDiagram = () => (
  <div className="mt-12">
    <div className="max-md:hidden lg:hidden mb-12 bg-[url('/images/roadmap-page/roadmap.webp')] bg-cover bg-center h-[500px]">
      <div className="translate-y-[300px]">
        <OlasToken />
      </div>
    </div>
    <div className="max-w-[1320px] max-xl:gap-12 w-full mx-auto flex max-md:flex-col flex-row justify-between mb-12 max-sm:px-6">
      <InfoBlock
        imgSrc="pearl.png"
        title="Pearl — The “AI Agent App Store”"
        className="md:max-xl:ml-12"
      >
        <p className="mb-3">
          <SubsiteLink href={PEARL_YOU_URL}>Pearl</SubsiteLink> today is a world of AI agents owned
          by you — in one app store — with a simplified UX, human-like utility, and a no-code,
          open-source experience.
        </p>
        <p className="mb-3">
          Pearl’s non-custodial core and convenient Web2 UX bring seamless onboarding via fiat
          on-ramping, a clean interface that feels personally tailored, and ongoing security
          enhancements. From here, Pearl will continue evolving toward state-of-the-art UX and an
          even wider range of specialized agents, all composable and offered within the app store.
        </p>
        <p className="max-sm:mb-12">
          Looking ahead, Pearl will expand its deeper, cutting-edge utility — broadening what our
          agents can do for users while keeping the experience accessible.
        </p>
      </InfoBlock>

      <div className="max-lg:hidden absolute z-20 w-fit h-fit -bottom-28 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <OlasToken />
      </div>

      <InfoBlock
        imgSrc="mech-marketplace.png"
        title="Mech Marketplace — The “AI Agent Bazaar”"
        className="md:max-xl:mr-12"
      >
        <p className="mb-3">
          <Link className="text-purple-700 hover:text-purple-800" href="/mech-marketplace">
            Mech Marketplace
          </Link>{' '}
          offers a two-sided bazaar where businesses can monetize their AI agent by offering their
          services — or hire other agents’ services — to power their own software.
        </p>
        <p className="mb-3">
          Support for ERC-8004: Trustless Agents and x402 helps agents access low-latency off-chain
          services, including services outside the Olas ecosystem. Next up, native x402 support and
          dynamic fees further streamline those exchanges and expand composability.
        </p>
        <p>
          Mid-term, any agent will be able to access on-chain or off-chain capabilities with a
          single signature, supported by MCP integration and other tooling that keeps the bazaar
          open to all.
        </p>
      </InfoBlock>
    </div>
  </div>
);
