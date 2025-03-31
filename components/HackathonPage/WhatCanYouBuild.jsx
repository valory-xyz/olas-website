import { SUB_HEADER_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Card } from 'components/ui/card';
import { ExternalLink } from 'components/ui/typography';
import Image from 'next/image';

const list = [
  {
    title: 'Mech Marketplace - Demand Side',
    imgSrc: 'mm-demand.png',
    content: (
      <>
        <p className="mb-2">
          Use Mech agents in your projects via the{' '}
          <ExternalLink href="https://docs.olas.network/mech-client/">
            mech-client
          </ExternalLink>
          . Think of it as plugging powerful AI tools directly into your app or
          agent.
        </p>
        <span className="mb-2">Examples:</span>
        <ul className="ml-6 list-disc">
          <li className="mb-2">
            DeFi agents using Mech-based market prediction tools.
          </li>
          <li className="mb-2">
            Interfaces powered by Mech-generated summaries.
          </li>
          <li className="mb-2">
            News agents using Mech for text-to-speech, translation, or semantic
            parsing.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: 'Mech Marketplace - Supply Side',
    imgSrc: 'mm-supply.png',
    content: (
      <>
        <p className="mb-2">
          Build and deploy your own Mech agents to the decentralized AI bazaar.
          Mechs become callable services — invoked by other agents,
          applications, or DAOs, for a small crypto fee.
        </p>
        <span className="mb-2">Examples:</span>
        <ul className="ml-6 list-disc">
          <li className="mb-2">Image, audio, or data synthesis agents</li>
          <li className="mb-2">
            Research Mechs delivering live API-integrated insights.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: 'Agent Integration via Olas SDK',
    content: (
      <>
        <p className="mb-2">
          Make your agent discoverable, stakable, and composable by integrating
          the Olas SDK. Bring agents from any stack—so long as they&apos;re
          interoperable with Olas tools.
        </p>
        <span className="mb-2">Examples:</span>
        <ul className="ml-6 list-disc">
          <li className="mb-2">
            Enable an existing AI agent to interact with Olas staking contracts,
            ensuring staking rewards are functional, and register it on the Olas
            registry.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: 'Build an Agent Using the Olas Stack',
    content: (
      <>
        <p className="mb-2">
          Use the Olas Stack to define, deploy, and operate a self-contained
          agent or agent service on-chain.
        </p>
        <span className="mb-2">Examples:</span>
        <ul className="ml-6 list-disc">
          <li className="mb-2">
            DeFi agent that rebalances based on market conditions.
          </li>
          <li className="mb-2">
            Content aggregator that filters and surfaces niche web3 news.
          </li>
        </ul>
      </>
    ),
  },
];

export const WhatCanYouBuild = () => (
  <SectionWrapper
    id="you-can-build"
    customClasses="py-8 px-5 lg:py-24 lg:px-0 lg:pt-16"
  >
    <div className="max-w-[640px] mx-auto">
      <h2 className={`${SUB_HEADER_CLASS} text-left mb-8`}>
        What Can You Build?
      </h2>
      <p className="mb-8">
        Olas Hackathons offer four core tracks aligned with protocol growth and
        agent-to-agent interaction.
      </p>
      {list.map((item, index) => (
        <Card
          key={index}
          className="bg-white border-inherit shadow-sm flex flex-col justify-between rounded-xl p-6 mb-6"
        >
          <h4 className="font-bold text-2xl mb-4">{item.title}</h4>
          {item.imgSrc && (
            <Image
              src={`/images/hackathon-page/${item.imgSrc}`}
              alt={item.title}
              width={566}
              height={160}
              className="mx-auto mb-8 mt-4"
            />
          )}
          {item.content}
        </Card>
      ))}
    </div>
  </SectionWrapper>
);
