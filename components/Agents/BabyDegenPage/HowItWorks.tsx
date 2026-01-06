import { SUB_HEADER_CLASS } from 'common-util/classes';
import { COINGECKO_URL } from 'common-util/constants';

const { default: SectionWrapper } = require('components/Layout/SectionWrapper');
const { ExternalLink } = require('components/ui/typography');
const { default: Image } = require('next/image');

const howItWorksSteps = [
  {
    title: 'Data Gathering',
    description: (
      <>
        BabyDegen pulls in market data from{' '}
        <ExternalLink href={COINGECKO_URL} target="_blank" rel="noreferrer">
          CoinGecko
        </ExternalLink>
        , ensuring it has the latest information at its fingertips.
      </>
    ),
    image: {
      path: '/images/agents/babydegen/data-gathering.png',
      alt: 'Data Gathering',
    },
  },
  {
    title: 'Strategy Selection',
    description: (
      <>
        Thanks to a vast and ever-expanding library of trading strategies from
        ecosystem developers, BabyDegen is adept at learning. It autonomously
        determines which strategies are most effective under various market
        conditions.
      </>
    ),
    image: {
      path: '/images/agents/babydegen/strategy-selection.png',
      alt: 'Data Gathering',
    },
  },
  {
    title: 'Making Moves',
    description: (
      <>
        Based on its accumulated experience and the real-time market data,
        BabyDegen decides whether to buy, sell, or hold specific assets. All
        trading activities are carried out on{' '}
        <ExternalLink href="https://jup.ag/" target="_blank" rel="noreferrer">
          Jupiter Exchange
        </ExternalLink>{' '}
        on Solana.
      </>
    ),
    image: {
      path: '/images/agents/babydegen/making-moves.png',
      alt: 'Making Moves',
    },
  },
];

export const HowItWorks = () => (
  <SectionWrapper id="how-it-works">
    <div className="max-w-screen-lg mx-auto lg:px-50">
      <h2 className={`${SUB_HEADER_CLASS} mb-12 text-center`}>How it works</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {howItWorksSteps.map(({ image }, index) => (
          <div key={index} className="flex flex-col items-center">
            <Image
              src={image.path}
              alt={image.alt}
              width={180}
              height={180}
              className="mx-auto rounded-lg"
            />
          </div>
        ))}
      </div>

      <div className="lg:mx-16">
        <div className="list-decimal mb-6 mt-12 mb-12">
          Once you&apos;ve funded your account and activated BabyDegen,
          there&apos;s nothing more you need to do. But if you&apos;re curious
          about what happens behind the scenes, here&apos;s a closer look:
        </div>

        <div className=" lg:gap-8 xl:gap-0 lg:grid-cols-12 items-center">
          <div className="lg:col-span-6 lg:p-0">
            <ol className="list-decimal mb-6 pl-5">
              {howItWorksSteps.map(({ title, description }, index) => (
                <li key={index} className="mb-4">
                  <span className="font-bold">{title}</span>
                  {': '}
                  {description}
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="text-slate-500">
          BabyDegen is currently in closed Alpha
        </div>
      </div>
    </div>
  </SectionWrapper>
);
