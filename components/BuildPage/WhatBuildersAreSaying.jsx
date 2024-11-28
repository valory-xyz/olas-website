import Image from 'next/image';

import { SUB_HEADER_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Card } from 'components/ui/card';
import Link from 'next/link';

const quotes = [
  {
    projectImage: '8baller.png',
    quote:
      "Olas is under the spotlight. With attention from Vitalik, it is clear that not only is the narrative compelling but also the technology is there to back it up. The network numbers only go up: everyday is a new all-time high of daily active agents. This is why I build on Olas, it's the clear leader in AI Agents and will be that way into the foreseeable future.",
    name: '8 Baller',
    nameUrl: 'https://x.com/8baller11',
    builderIcon: '8baller.png',
    blogUrl:
      '/blog/how-8-baller-earned-over-1-2-m-olas-in-a-year-by-building-for-the-olas-ecosystem',
  },
  {
    projectImage: 'shutter.png',
    projectUrl: 'https://www.shutter.network/',
    quote:
      'Isotropic and Shutter DAO 0x36 are building on Olas to conduct AI-driven experiments using autonomous agents on Shutter’s encrypted mempool which is integrated into Gnosis Chain. The potential of Olas agents for economic simulations and stress testing like this is massive. The agents need to be decentralized and co-owned and Olas enables that.',
    name: 'Luis Bezzenberger',
    nameUrl: 'https://x.com/bezzenberger',
    title: (
      <>
        Head of Product, Brainbot <br />
        Core Contributor to Shutter
      </>
    ),
    builderIcon: 'shutter-avatar.png',
    blogUrl:
      '/blog/how-peaq-optimized-energy-management-with-ai-agents-built-on-olas',
  },
  {
    projectImage: 'alterscope.png',
    projectUrl: 'https://www.alterscope.org/',
    quote:
      'Olas has solved a longstanding program to bring data to a database in a decentralized, verifiable, and trusted manner. Olas is such a perfect solution that we feel like Olas has been built for us at Alterscope!',
    name: 'Marijo Radman',
    nameUrl: 'https://x.com/Marijo_Radman',
    title: 'CEO, Alterscope',
    builderIcon: 'alterscope-avatar.png',
  },
  {
    projectImage: 'creator-bid.png',
    projectUrl: 'https://creator.bid/',
    quote:
      "We're building Creator.bid on the cutting-edge Olas Stack to be one the first Olas-powered project en-route to deliver no-code ACA (AI Creator Agents) at scale. The Olas Stack has proven to be a fantastic choice for us to run our agents in a decentralized fashion with off-chain consensus at scale.",
    name: 'Philipp Kothe',
    nameUrl: 'https://x.com/philism_',
    title: 'CEO, Creator.bid',
    builderIcon: 'creator-bid-avatar.png',
  },
  {
    projectImage: 'alprina.png',
    projectUrl: 'https://alprina.com/',
    quote:
      "As the founder of Alprina, an AI agent designed to predict stock movements, I chose Olas for its robust decentralized infrastructure. Olas's open-source framework and multi-chain protocol offer the flexibility and scalability essential for developing sophisticated agent economies. By leveraging Olas, we seamlessly integrate off-chain AI services with on-chain security, fostering innovation in a co-owned and decentralized environment.",
    name: 'Josh Wagenbach',
    nameUrl: 'https://x.com/joshwagenbach',
    title: 'CEO, Alprina',
    builderIcon: 'alprina-avatar.png',
    blogUrl:
      '/blog/how-alprina-built-a-multi-agent-ai-system-on-a-startup-budget-with-olas',
  },
  {
    projectImage: 'nevermined.png',
    projectUrl: 'https://nevermined.io/',
    quote:
      'We are building on Olas to allow AI agents to get paid across the different networks that agents are deployed to. Nevermined will work to bring Olas AI agents to life through R&D and mutual integrations. The Olas Stack enables all agents to be interoperable and composable with one another so that our payment mechanism can work seamlessly.',
    name: 'Don Gossen',
    nameUrl: 'https://x.com/dongossen',
    title: 'CEO, Nevermined',
    builderIcon: 'nevermined-avatar.png',
  },
];

export const WhatBuildersAreSaying = () => (
  <SectionWrapper
    customClasses="lg:p-24 px-4 py-20 mt-20 border-y bg-gradient-to-t from-[#E7EAF4] to-gray-50"
    backgroundType="NONE"
  >
    <h2 className={`${SUB_HEADER_CLASS} text-center mb-6 lg:mb-14`}>
      What Builders are saying
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-screen-xl mx-auto">
      {quotes.map((quote, index) => {
        const LinkTag = quote.projectUrl ? 'a' : 'div';
        const LinkProps = quote.projectUrl
          ? { href: quote.projectUrl, target: '_blank' }
          : {};
        return (
          <Card
            key={index}
            className='flex flex-col p-6 border-2 border-white rounded-2xl shadow-sm bg-white gap-4 bg-cover bg-[url("/images/card-bg.png")]'
          >
            <LinkTag {...LinkProps}>
              <Image
                src={`/images/build-page/${quote.projectImage}`}
                alt="Build"
                width={24}
                height={24}
                className="mx-auto"
              />
            </LinkTag>
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
                <a
                  href={quote.nameUrl}
                  target="_blank"
                  className="font-semibold"
                >
                  {quote.name}
                </a>
                <p className="text-slate-500 text-sm">{quote.title}</p>
              </div>

              <div className="aspect-square mt-auto">
                <Image
                  src={`/images/build-page/${quote.builderIcon}`}
                  alt="Build"
                  width={48}
                  height={48}
                />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  </SectionWrapper>
);
