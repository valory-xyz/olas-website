import Image from 'next/image';

import { SUB_HEADER_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Card } from 'components/ui/card';

const quotes = [
  {
    projectImage: 'alprina.png',
    projectUrl: 'https://alprina.com/',
    quote:
      " At Alprina, we harness Olas's decentralized infrastructure to develop our AI stock prediction agent, benefiting from its open-source framework and multi-chain protocol for seamless integration and enhanced security. ",
    name: 'Josh Wagenbach',
    nameUrl: 'https://x.com/joshwagenbach',
    title: 'CEO, Alprina',
    builderIcon: 'alprina-avatar.png',
  },
  {
    projectImage: 'alterscope.png',
    projectUrl: 'https://www.alterscope.org/',
    quote:
      ' Olas has solved a longstanding program to bring data to a database in a decentralized, verifiable, and trusted manner. Olas is such a perfect solution that we feel like Olas has been built for us at Alterscope! ',
    name: 'Marijo Radman',
    nameUrl: 'https://x.com/Marijo_Radman',
    title: 'CEO, Alterscope',
    builderIcon: 'alterscope-avatar.png',
  },
  {
    projectImage: '8baller.png',
    projectUrl: '#',
    quote:
      " Olas is under the spotlight, with attention from Vitalik it is clear that not only is the narrative compelling but also the technology is there to back it up. The network numbers only go up everyday a new all time high of daily active agents. This is why I build on Olas, it's the clear leader in AI Agents and will be that way into the foreseeable future. ",
    name: '8 Baller',
    nameUrl: 'https://x.com/8baller11',
    builderIcon: '8baller.png',
  },
  {
    projectImage: 'shutter.png',
    projectUrl: 'https://www.shutter.network/',
    quote:
      " We're excited to be an building on Olas to conduct AI-driven experiments using autonomous agents on Shutter’s encrypted mempool. The potential of Olas agents is massive. Our agents need to be decentralized and co-owned and Olas enables that. ",
    name: 'Luis Bezzenberger',
    nameUrl: 'https://x.com/bezzenberger',
    title: 'Head of Product, Brainbot \nCore Contributor to Shutter',
    builderIcon: 'shutter-avatar.png',
  },
  {
    projectImage: 'creator-bid.png',
    projectUrl: 'https://creator.bid/',
    quote:
      " We're building Creator.bid on the cutting-edge Olas stack to be one the first Olas-powered project en-route to deliver no-code ACA (AI Creator Agents) at scale. The Olas stack has proven to be a fantastic choice for us to run our agents in a decentralized fashion with off-chain consensus at scale. ",
    name: 'Philipp Kothe',
    nameUrl: 'https://x.com/philism_',
    title: 'CEO, Creator.bid',
    builderIcon: 'creator-bid-avatar.png',
  },
  {
    projectImage: 'nevermined.png',
    projectUrl: 'https://nevermined.io/',
    quote:
      " We are building on Olas to allow AI agents to get paid across the different networks that agents are deployed to. Nevermined will work to bring Olas AI agent's to life through R&D and mutual integrations. ",
    name: 'Don Gossen',
    nameUrl: 'https://x.com/dongossen',
    title: 'CEO, Nevermined',
    builderIcon: 'nevermined-avatar.png',
  },
];

export const WhatBuildersAreSaying = () => (
  <SectionWrapper
    customClasses="lg:p-24 px-4 py-20 mt-20 bg-gray-100 border-y"
    backgroundType="NONE"
    customStyle={{
      background: 'linear-gradient(180deg, #F8F9FC 0%, #E7EAF4 100%)',
    }}
  >
    <h2 className={`${SUB_HEADER_CLASS} text-center mb-6 lg:mb-14`}>
      What Builders are saying
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-screen-xl mx-auto">
      {quotes.map((quote, index) => (
        <Card
          key={index}
          className='flex flex-col p-6 border-2 border-white rounded-2xl shadow-sm bg-white gap-4 bg-cover bg-[url("/images/card-bg.png")]'
        >
          <a href={quote.projectUrl} target="_blank">
            <Image
              src={`/images/build-page/${quote.projectImage}`}
              alt="Build"
              width={24}
              height={24}
              className="mx-auto"
            />
          </a>
          <div>
            <span className="text-purple-600 text-lg">&quot; </span>
            {quote.quote}
            <span className="text-purple-600 text-lg"> &quot;</span>
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
                src={`/images/build-page/${quote.builderIcon}`}
                alt="Build"
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