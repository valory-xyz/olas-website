import React from 'react';
import Link from 'next/link';
import { Button } from 'components/Button';

const ideaGroups = [
  {
    id: 'internal-dao-operations',
    title: 'Internal DAO Operations',
    ideas: [
      {
        id: 'meta-yield-hunter',
        title: 'Meta Yield Hunter',
        description:
          'Use machine learning to track yield opportunities across chains and protocols. Autonomously move positions to optimize yield.',
      },
      {
        id: 'asset-whitelisting',
        title: 'Asset Whitelisting',
        description:
          'Dynamically evaluates assets based on diverse datasets to add and remove from whitelists.',
      },
      {
        id: 'contribution-coordinator',
        title: 'Contribution Coordinator',
        description:
          'Watch for contributions on Github, Twitter etc and adjust on-chain rewards & permissions accordingly.',
      },
    ],
  },
  {
    id: 'new-services',
    title: 'New Services',
    ideas: [
      {
        id: 'web3-native-recommender',
        title: 'Web3-native Recommender',
        description:
          'Build the first co-owned and operated engines to track opportunities and make personalized recommendations to crypto users.',
      },
      {
        id: 'nft-collector',
        title: 'NFT Collector',
        description:
          'Allow users to passively build exposure to quality baskets of NFTs.',
      },
      {
        id: 'fund-manager',
        title: 'Fund Manager',
        description:
          'Overcome the legal and trust challenges of running a decentralized fund.',
      },
    ],
  },
  {
    id: 'customizable-app-infra',
    title: 'Customizable App Infra',
    ideas: [
      {
        id: 'oracles',
        title: '*Oracles (On-chain Data Reporter)',
        description:
          'Build future-proof oracles that are totally customizable, without permission, and owned by you.',
      },
      {
        id: 'keeper',
        title: 'Keepers',
        description:
          'Build robust keeper systems that you can extend to maintain any on-chain data, based on a rich set of criteria which you define.',
      },
      {
        id: 'bridges',
        title: 'Bridges (Cross-chain Messenger)',
        description:
          'Spin up your own bridges to sync any type of data across chains and infrastructure. Combine with your oracles and keepers to build rich new services.',
      },
    ],
  },
];

const WhatCouldYouBuild = () => (
  <section
    className="section section-what-could-you-build py-12"
    id="what-could-you-build"
  >
    <div className="header text-6xl font-bold text-center mb-8">
      What could&nbsp;
      <span className="sub-text">you</span>
      &nbsp;build?
    </div>

    <div className="flex justify-center items-center mb-16">
      <Link href="/#kits" passHref>
        <Button className="mr-4">Explore Kits</Button>
      </Link>
      <Link href="/#services" passHref>
        <Button>Explore Services</Button>
      </Link>
    </div>

    <div className="header text-3xl font-bold text-center mb-8">
      More ideas
    </div>

    {ideaGroups.map((ideaGroup) => {
      const { id, ideas, title } = ideaGroup;

      return (
        <div key={id} className="mt-8">
          <h2 className="text-2xl font-bold group-title">{title}</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {ideas.map((idea) => (
              <div key={idea.id} className="idea">
                <h3 className="text-xl font-semibold idea-title">
                  {idea.title}
                </h3>
                <p className="text-lg idea-text">{idea.description}</p>
              </div>
            ))}
          </div>
        </div>
      );
    })}

  </section>
);

export default WhatCouldYouBuild;
