import {
  SECTION_BOX_CLASS,
  SUB_HEADER_LG_CLASS,
  TEXT_MEDIUM_LIGHT_CLASS,
} from 'common-util/classes';

const { default: SectionWrapper } = require('components/Layout/SectionWrapper');
const { Button } = require('components/ui/button');
const { H1 } = require('components/ui/typography');
const { default: Image } = require('next/image');

const TaggedItem = ({ item }) => (
  <div className="max-sm:mt-2 rounded-full border py-1 pr-2 max-w-fit inline mr-2">
    <Image
      src={`/images/services/babydegen/${item.toLowerCase()}.png`}
      alt={item}
      width={30}
      height={30}
      className="inline p-1 pb-2"
    />
    {item}
  </div>
);

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
  </>,
  'Active 24/7 when the agent is running.',
  'Fully autonomous and owned locally by you.',
];

const optimusKeyFeatures = [
  'Personalized portfolio management.',
  'Expanding strategy library.',
  <>
    Blockchain networks: <TaggedItem item="Mode" />
    <TaggedItem item="Optimism" /> <TaggedItem item="Base" />
  </>,
  <>
    Financial assets: <TaggedItem item="USDC" />
    <TaggedItem item="ETH" />
  </>,
  <>
    Supported protocols: <TaggedItem item="Balancer" />
    <TaggedItem item="Sturdy" />
    <TaggedItem item="Uniswap" />
  </>,
  'Active 24/7 when the agent is running.',
  'Fully autonomous and owned locally by you.',
];

const ModiusAgent = () => (
  <div
    id="modius-agent"
    className="flex flex-row gap-4 py-16 max-w-[968px] mx-auto"
  >
    <Image
      src="/images/services/babydegen/modius.png"
      alt="modius agent"
      width={250}
      height={300}
      className="mb-auto"
    />
    <div className="flex flex-col gap-4">
      <div className={TEXT_MEDIUM_LIGHT_CLASS}>MODIUS AGENT</div>
      <h2 className={SUB_HEADER_LG_CLASS}>
        Your Personal AI Portfolio Manager
      </h2>
      <p>
        Modius is a personal DeFAI agent that autonomously manages your
        portfolio with cutting-edge strategies. It gathers market data, selects
        optimal trading algorithms, and executes trades seamlessly on Mode
        mainnet — delivering intelligent, hands-free asset management.
      </p>
      <div className="text-xl font-semibold">Key features</div>
      <div>
        <ul className="list-disc">
          {modiusKeyFeatures.map((feature) => (
            <li key={feature} className="mb-4 ml-6">
              {feature}
            </li>
          ))}
        </ul>
      </div>
      <p className="text-slate-500">
        Modius is currently available on Quickstart.
      </p>
      <Button variant="default" size="xl" className="w-fit">
        <a href="https://github.com/valory-xyz/modius-quickstart">
          Run Modius via Quickstart
        </a>
      </Button>
    </div>
  </div>
);

const OptimusAgent = () => (
  <div
    id="optimus-agent"
    className="flex flex-row gap-4 py-16 max-w-[968px] mx-auto"
  >
    <Image
      src="/images/services/babydegen/optimus.png"
      alt="optimus agent"
      width={250}
      height={300}
      className="mb-auto"
    />
    <div className="flex flex-col gap-4">
      <div className={TEXT_MEDIUM_LIGHT_CLASS}>OPTIMUS AGENT</div>
      <h2 className={SUB_HEADER_LG_CLASS}>
        Your Personal AI Portfolio Manager
      </h2>
      <p>
        The Optimus Agent is an autonomous AI agent that streamlines your DeFi
        experience by intelligently managing your assets on specific blockchain
        platforms. Initially focused on select DeFi protocols on Mode, Optimism
        Mainnet and Base, it offers a targeted approach to maximizing returns
        within these ecosystems. Looking ahead, it will expand to support any
        protocol that wishes to integrate.
      </p>
      <div className="text-xl font-semibold">Key features</div>
      <div>
        <ul className="list-disc">
          {optimusKeyFeatures.map((feature) => (
            <li key={feature} className="mb-4 ml-6">
              {feature}
            </li>
          ))}
        </ul>
      </div>
      <p className="text-slate-500">
        Optimus is currently available on Quickstart.
      </p>
      <Button variant="default" size="xl" className="w-fit">
        <a href="https://github.com/valory-xyz/optimus-quickstart">
          Run Optimus via Quickstart
        </a>
      </Button>
    </div>
  </div>
);

export const MeetTheBabyDegens = () => (
  <SectionWrapper
    id="meet-the-babydegens"
    customClasses={`${SECTION_BOX_CLASS} lg:py-12 border-b-1.5`}
  >
    <div className="text-center">
      <H1>
        Meet the{' '}
        <Image
          src="/images/services/babydegen/babydegen-icon.png"
          alt="Meet the BabyDegens"
          width={70}
          height={80}
          className="inline mt-4"
        />{' '}
        BabyDegens
      </H1>
    </div>
    <ModiusAgent />
    <hr />
    <OptimusAgent />
  </SectionWrapper>
);
