import { SECTION_BOX_CLASS, SUB_HEADER_LG_CLASS } from 'common-util/classes';
import { PEARL_YOU_URL_WITH_UTM_SOURCE } from 'common-util/constants';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';
import { H2, SubsiteLink } from 'components/ui/typography';
import Image from 'next/image';

const TaggedItem = ({ item }) => (
  <div className="max-sm:mt-2 rounded-full border py-1 pr-2 max-w-fit inline mr-2">
    <Image
      src={`/images/agents/babydegen/${item.toLowerCase()}.png`}
      alt={item}
      width={30}
      height={30}
      className="inline p-1 pb-2"
    />
    {item}
  </div>
);

const basiusKeyFeatures = [
  'Personalized portfolio management.',
  'Expanding strategy library.',
  <>
    Blockchain network: <TaggedItem item="Base" />
  </>,
  <>
    Financial assets: <TaggedItem item="USDC" />
  </>,
  <>
    Supported protocols: <TaggedItem item="Aerodrome" />
  </>,
  'Active 24/7 when the agent is running.',
  'Fully autonomous and owned locally by you.',
];

const modiusKeyFeatures = [
  'Personalized portfolio management.',
  'Expanding strategy library.',
  <>
    Blockchain network: <TaggedItem item="Mode" />
  </>,
  <>
    Financial assets: <TaggedItem item="USDC" />
    <TaggedItem item="ETH" />
  </>,
  <>
    Supported protocols: <TaggedItem item="Balancer" />
    <TaggedItem item="Sturdy" />
    <TaggedItem item="Velodrome" />
  </>,
  'Active 24/7 when the agent is running.',
  'Fully autonomous and owned locally by you.',
];

const optimusKeyFeatures = [
  'Personalized portfolio management.',
  'Expanding strategy library.',
  <>
    Blockchain networks:
    <TaggedItem item="Optimism" />
  </>,
  <>
    Financial assets: <TaggedItem item="USDC" />
    <TaggedItem item="ETH" />
  </>,
  <>
    Supported protocols: <TaggedItem item="Balancer" />
    <TaggedItem item="Uniswap" />
    <TaggedItem item="Velodrome" />
  </>,
  'Active 24/7 when the agent is running.',
  'Fully autonomous and owned locally by you.',
];

const BasiusAgent = () => (
  <div id="basius-agent" className="flex flex-col md:flex-row gap-4 py-16 max-w-[968px] mx-auto">
    <div className="flex w-[250px] justify-center items-start mb-auto shrink-0">
      <Image
        src="/images/agents/babydegen/basius.png"
        alt="basius agent"
        width={190}
        height={190}
        className="mt-4"
      />
    </div>
    <div className="flex flex-col gap-4">
      <h2 className={SUB_HEADER_LG_CLASS}>Basius agent</h2>
      <p>
        Basius is a personal DeFAI agent that autonomously manages your portfolio on Base. It
        gathers market data, selects optimal trading algorithms, and executes trades seamlessly on
        Base mainnet — delivering intelligent, hands-free asset management.
      </p>
      <div className="text-xl font-semibold">Key features</div>
      <div>
        <ul className="list-disc">
          {basiusKeyFeatures.map((feature, index) => (
            <li key={index} className="mb-4 ml-6">
              {feature}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-wrap gap-4">
        <Button variant="default" size="default" className="max-md:grow w-fit">
          <SubsiteLink
            href={`${PEARL_YOU_URL_WITH_UTM_SOURCE}&utm_campaign=basius&utm_content=basius-button`}
            isInButton
          >
            Run via Pearl
          </SubsiteLink>
        </Button>
      </div>
    </div>
  </div>
);

const ModiusAgent = () => (
  <div id="modius-agent" className="flex flex-col md:flex-row gap-4 py-16 max-w-[968px] mx-auto">
    <Image
      src="/images/agents/babydegen/modius.png"
      alt="modius agent"
      width={250}
      height={300}
      className="mb-auto"
    />
    <div className="flex flex-col gap-4">
      <Image
        src="/images/under-construction.svg"
        alt="Under Construction"
        width={186}
        height={32}
      />
      <h2 className={SUB_HEADER_LG_CLASS}>Modius agent</h2>
      <p>
        Modius is a personal DeFAI agent that autonomously manages your portfolio with cutting-edge
        strategies. It gathers market data, selects optimal trading algorithms, and executes trades
        seamlessly on Mode mainnet — delivering intelligent, hands-free asset management.
      </p>
      <div className="text-xl font-semibold">Key features</div>
      <div>
        <ul className="list-disc">
          {modiusKeyFeatures.map((feature, index) => (
            <li key={index} className="mb-4 ml-6">
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

const OptimusAgent = () => (
  <div id="optimus-agent" className="flex flex-col md:flex-row gap-4 py-16 max-w-[968px] mx-auto">
    <Image
      src="/images/agents/babydegen/optimus.png"
      alt="optimus agent"
      width={250}
      height={300}
      className="mb-auto"
    />
    <div className="flex flex-col gap-4">
      <Image
        src="/images/under-construction.svg"
        alt="Under Construction"
        width={186}
        height={32}
      />
      <h2 className={SUB_HEADER_LG_CLASS}>Optimus agent</h2>
      <p>
        The Optimus Agent is an autonomous AI agent that streamlines your DeFi experience by
        intelligently managing your assets on specific blockchain platforms. Initially focused on
        select DeFi protocols on Mode, Optimism Mainnet and Base, it offers a targeted approach to
        maximizing returns within these ecosystems. Looking ahead, it will expand to support any
        protocol that wishes to integrate.
      </p>
      <div className="text-xl font-semibold">Key features</div>
      <div>
        <ul className="list-disc">
          {optimusKeyFeatures.map((feature, index) => (
            <li key={index} className="mb-4 ml-6">
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

export const MeetTheBabyDegens = () => (
  <SectionWrapper id="agents" customClasses={`${SECTION_BOX_CLASS} lg:py-12 border-b-1.5`}>
    <div className="text-center">
      <H2>
        Meet the{' '}
        <Image
          src="/images/agents/babydegen/babydegen-icon.png"
          alt="Meet the BabyDegens"
          width={70}
          height={80}
          className="inline mt-4"
        />{' '}
        BabyDegens
      </H2>
    </div>
    <BasiusAgent />
    <hr />
    <ModiusAgent />
    <hr />
    <OptimusAgent />
  </SectionWrapper>
);
