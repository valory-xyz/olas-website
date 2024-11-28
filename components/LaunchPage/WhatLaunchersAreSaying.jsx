import { SUB_HEADER_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Card } from 'components/ui/card';
import { ExternalLink } from 'components/ui/typography';
import Image from 'next/image';
import Link from 'next/link';

const quotes = [
  {
    projectImage: 'mode.png',
    projectUrl: 'https://www.mode.network/',
    quote: (
      <span>
        AI Agents are a core part of our DeFi mass adoption strategy here at
        Mode. We are thrilled to be building on the number one AI Agent network,
        launching Olas Modius with{' '}
        <ExternalLink href="https://x.com/valoryag" hideArrow>
          @ValoryAG
        </ExternalLink>
        , core contributors to{' '}
        <ExternalLink href="https://x.com/autonolas" hideArrow>
          @Autonolas
        </ExternalLink>
        . Olas Modius is an autonomous multi-agent system on Mode focused on
        intelligently managing your assets. You will soon be able to taste the
        future of AI agent-powered trading on Mode, leveraging the top DeFi
        protocols across our ecosystem.
      </span>
    ),
    name: 'James Ross',
    nameUrl: 'https://x.com/JRossTreacher',
    title: 'CEO, Mode',
    launcherIcon: 'mode-avatar.png',
  },
  {
    projectImage: 'gnosis.png',
    projectUrl: 'https://www.gnosis.io/',
    quote:
      'Olas-powered AI Agents trading on prediction markets have become a large user of Gnosis Chain, bringing Gnosis back into the prediction market game with Olas and Safe. On many days these agents make over 75% of Safe transactions on Gnosis Chain.',
    name: 'Martin Köppelmann',
    nameUrl: 'https://x.com/koeppelmann',
    title: 'Co-founder, Gnosis',
    launcherIcon: 'gnosis-avatar.png',
    blogUrl:
      '/blog/how-gnosis-used-olas-predict-to-build-the-largest-on-chain-prediction-market-economy',
  },
];

export const WhatLaunchersAreSaying = () => (
  <SectionWrapper
    customClasses="lg:p-24 px-4 py-20 mt-20 border-y bg-gradient-to-t from-[#E7EAF4] to-gray-50"
    backgroundType="NONE"
  >
    <h2 className={`${SUB_HEADER_CLASS} text-center mb-6 lg:mb-14`}>
      What Launchers are saying
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[800px] mx-auto">
      {quotes.map((quote, index) => (
        <Card
          key={index}
          className='flex flex-col p-6 border-2 border-white rounded-2xl shadow-sm bg-white gap-4 mx-auto bg-cover bg-[url("/images/card-bg.png")]'
        >
          <a href={quote.projectUrl} target="_blank">
            <Image
              src={`/images/launch-page/${quote.projectImage}`}
              alt="Launch"
              width={24}
              height={24}
              className="mx-auto"
            />
          </a>
          <div className="text-purple-600">
            &quot;
            <span className="text-black">{quote.quote}</span>
            &quot;
            {quote.blogUrl && (
              <div className="mt-4 font-semibold">
                <Link href={quote.blogUrl}>Read more</Link>
              </div>
            )}
          </div>
          <div className="mt-auto flex flex-row justify-between">
            <div className="flex flex-col w-2/3">
              <a href={quote.nameUrl} target="_blank" className="font-semibold">
                {quote.name}
              </a>
              <p className="text-slate-500 text-sm">{quote.title}</p>
            </div>

            <div className="aspect-square mt-auto">
              <Image
                src={`/images/launch-page/${quote.launcherIcon}`}
                alt="Launch"
                width={48}
                height={48}
              />
            </div>
          </div>
        </Card>
      ))}
    </div>
  </SectionWrapper>
);
