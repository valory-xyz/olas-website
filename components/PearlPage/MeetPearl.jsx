import Image from 'next/image';

import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';
import { Card } from 'components/ui/card';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { SECTION_BOX_CLASS, SUB_HEADER_CLASS, TEXT_CLASS } from './utils';

const bgClasses = {
  purple: 'card-purple',
  lime: 'card-lime',
  rose: 'card-rose',
  rainbow: 'card-rainbow',
};

const agents = [
  {
    title: 'Modius agent',
    description:
      'Your personal DeFAI asset manager—built for hands-off asset management.',
    link: '/services/babydegen#modius-agent',
    imgSrc: 'modius.png',
    bgColour: 'lime',
  },
  {
    title: 'Prediction agent',
    description: 'An AI-powered agent for trading in prediction markets.',
    link: '/services/prediction-agents',
    imgSrc: 'prediction-agent.png',
    bgColour: 'purple',
  },
  {
    title: 'Agents.fun agent',
    description:
      'Your autonomous influencer Agent on X — generating content, interacting, and evolving its persona.',
    link: '/services/agentsfun',
    imgSrc: 'agentsfun.png',
    bgColour: 'rainbow',
  },
  {
    title: 'Optimus Agent',
    description:
      'Streamlines your DeFi experience by intelligently managing your assets across the Superchain.',
    link: '/services/babydegen#optimus-agent',
    isComingSoon: true,
    imgSrc: 'optimus.png',
    bgColour: 'rose',
  },
];

const AgentsList = () => (
  <div id="ai-agents">
    <h2
      className={`${SUB_HEADER_CLASS} mb-4 font-semibold text-center mb-14 lg:mb-14`}
    >
      A World of AI Agents in One App
    </h2>
    <div className="max-md:grid-cols-1 grid grid-cols-2 mx-auto max-w-6xl gap-4">
      {agents.map((item, index) => {
        const cardClass =
          bgClasses[item.bgColour] || 'border-slate-200 to-slate-100';

        return (
          <Card
            key={index}
            className={`operate-card flex flex-row gap-4 border p-4 bg-gradient-to-t from-white shadow-none ${cardClass}`}
          >
            <Image
              src={`/images/pearl-page/${item.imgSrc || 'default-agent.png'}`}
              alt={`Agent - ${item.title ? item.title : 'Coming soon'}`}
              width={80}
              height={80}
              className="aspect-square w-[80px] h-[80px]"
            />
            <div className="flex flex-col gap-2 w-full">
              <div className="place-items-center flex flex-row max-sm:flex-col">
                <div className="text-xl font-semibold">
                  {item.title ? (
                    item.title
                  ) : (
                    <div className="bg-slate-500 w-[160px] h-3 rounded-full mt-2 max-sm:w-[100px]" />
                  )}
                </div>
                {item.isComingSoon && (
                  <div className="ml-3 bg-purple-50 px-1 place-items-center text-purple-700 border border-fuchsia-200 rounded-sm text-sm">
                    <p>Coming soon</p>
                  </div>
                )}
              </div>
              <div>
                {item.description ? (
                  item.description
                ) : (
                  <>
                    <div className="bg-slate-200 w-full h-3 rounded-full mt-4" />
                    <div className="bg-slate-200 max-w-[233px] h-3 rounded-full mt-3 max-sm:w-[100px]" />
                  </>
                )}
              </div>

              {item.link && (
                <div className="mt-auto">
                  <Link
                    href={item.link}
                    className="flex gap-1 place-items-center text-purple-600"
                  >
                    Learn more <ChevronRight size={20} />
                  </Link>
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
    <div className="border w-fit rounded-full px-4 py-1 mt-12 mx-auto">
      And more agents launching soon
    </div>
  </div>
);

const ReadyToRun = () => (
  <div className="place-items-center flex flex-col gap-8 bg-slate-100 max-w-6xl mx-auto mt-20 rounded-xl py-12">
    <h3 className="text-3xl tracking-tight font-semibold text-center max-sm:mx-4">
      Ready to run your agent?
    </h3>
    <Button variant="default" size="xl" asChild className="w-auto">
      <Link href="#download">Try Pearl now</Link>
    </Button>
  </div>
);

export const MeetPearlContent = () => (
  <div className="h-[540px] max-w-6xl sm:h-auto mb-20 lg:pl-12 mx-auto lg:items-center flex flex-col lg:flex-row justify-between">
    <div className="mb-6 px-0 lg:max-w-[460px] lg:px-5 lg:text-left lg:mb-12">
      <Image
        style={{ marginLeft: -6 }}
        className="mb-2 lg:mb-4 w-16 lg:w-16"
        alt="Operate Logo"
        src="/images/pearl-page/operate-logo.svg"
        width={48}
        height={48}
      />

      <h2 className={`${SUB_HEADER_CLASS} mb-4 font-semibold lg:mb-6`}>
        Discover Pearl
      </h2>

      <p className={TEXT_CLASS}>
        Pearl brings you the ultimate collection of AI agents in one app. From
        asset managers to custom AI influencers, Pearl has it all. Choose from a
        growing range of Olas agents, stake OLAS, and let them work autonomously
        — earning you potential rewards from your crypto agents&apos; work and
        Olas Staking.
      </p>
    </div>
    <Image
      className="mx-auto max-sm:overflow-hidden block md:mt-8"
      alt="Meet Pearl"
      src="/images/pearl-page/discover-pearl.png"
      width={580}
      height={574}
    />
  </div>
);

export const MeetPearl = () => (
  <SectionWrapper id="about" customClasses={`${SECTION_BOX_CLASS}`}>
    <MeetPearlContent />
    <AgentsList />
    <ReadyToRun />
  </SectionWrapper>
);
