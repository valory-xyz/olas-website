import { PEARL_YOU_URL } from 'common-util/constants';
import { Card } from 'components/ui/card';
import { SubsiteLink } from 'components/ui/typography';
import Image from 'next/image';
import Link from 'next/link';

const InfoBlock = ({ imgSrc, title, className, children }) => (
  <div
    className={`flex flex-col max-sm:place-items-center lg:max-w-[250px] ${className}`}
  >
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

const OlasToken = () => (
  <div className="flex flex-col place-items-center mt-auto gap-4">
    <Image
      src="/images/roadmap-page/olas-token-logo.png"
      alt="OLAS token"
      width={70}
      height={78}
    />
    <p className="text-xl font-semibold">OLAS Token</p>
    // @ts-expect-error TS(2304) FIXME: Cannot find name 'children'.
    // @ts-expect-error TS(2322): Type '{ children: (string | Element)[]; className:... Remove this comment to see the full error message
    // @ts-expect-error TS(2322) FIXME: Type '{ children: (string | Element)[]; className:... Remove this comment to see the full error message
    <Card className="activity-card-opaque p-4 w-[326px] text-center">
      OLAS bootstraps the{' '}
      <Link
        href="/#agent-economies"
        className="text-purple-700 hover:text-purple-800"
      >
        flywheel between Pearl and Mech Marketplace
      </Link>
    </Card>
  </div>
);

export const MMPearlDiagram = () => (
  <div className="mt-12">
    <div className="max-md:hidden lg:hidden mb-12 bg-[url('/images/roadmap-page/roadmap-bg.webp')] bg-cover bg-center h-[500px]">
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
          // @ts-expect-error TS(2304) FIXME: Cannot find name 'childre'.
          // @ts-expect-error TS(2741): Property 'className' is missing in type '{ childre... Remove this comment to see the full error message
          <SubsiteLink href={PEARL_YOU_URL}>Pearl</SubsiteLink> today is a world
          of AI agents owned by you — in one app.
        </p>
        <p className="mb-3">
          The next stage, powered by the{' '}
          <Link
            className="text-purple-700 hover:text-purple-800"
            href="/accelerator"
          >
            Olas Accelerator
          </Link>
          , brings deeper utility and a wider range of specialized agents, all
          composable within a single experience.
        </p>
        <p className="max-sm:mb-12">
          Looking ahead, Pearl keeps its non-custodial core while adopting a
          convenient WEB2 UX: seamless onboarding via fiat on-ramping, a
          stunning interface that feels personally tailored, and continuous
          security hardening.
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
          <Link
            className="text-purple-700 hover:text-purple-800"
            href="/mech-marketplace"
          >
            Mech Marketplace
          </Link>{' '}
          offers a shared bazaar where businesses can monetize their AI agent by
          offering its services — or hire other agents&apos; services to power
          their own software.
        </p>
        <p className="mb-3">
          In the next stage, dynamic fee charging and the x/h402 standard
          streamline those exchanges and expand composability.
        </p>
        <p>
          Mid-term, any agent should reach on-chain or off-chain capabilities
          with a single signature, supported by simplified onboarding, MCP
          integration and other tooling that keeps the bazaar open to all.
        </p>
      </InfoBlock>
    </div>
    <div className="md:hidden bg-[url('/images/roadmap-page/mobile-bg.webp')] bg-cover bg-center w-full h-[1420px] border border-t-1.5 bg-no-repeat relative">
      <div className="mb-12 absolute mx-auto w-fit bottom-28 left-1/2 transform -translate-x-1/2">
        <OlasToken />
      </div>
    </div>
  </div>
);
