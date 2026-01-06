import { Fragment } from 'react';

import {
  SCREEN_WIDTH_LG,
  SUB_HEADER_CLASS,
  TEXT_LARGE_CLASS,
} from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import Link from 'next/link';

const onChainRegistries = [
  {
    title: 'Software registry',
    subList: [
      'Register agent systems and the components they are composed from as NFTs.',
    ],
  },
  {
    title: 'Secure & Manage',
    subList: [
      'Maintain agent systems, secure them and coordinate their operators.',
    ],
  },
];

const tokenomics = [
  {
    title: 'Developer Rewards',
    subList: [
      'Permissionless system to reward developers for their code contributions.',
    ],
  },
  {
    title: 'Bonding',
    subList: [
      'Permissionless system to allow the DAO to acquire protocol-owned liquidity',
    ],
  },
  {
    title: 'Staking',
    subList: [
      'Coordinate and reward agents for their active contributions to specific use cases.',
    ],
  },
];

const governance = [
  {
    title: 'Decentralised Management',
    subList: [' DAO steers protocol developments'],
  },
];

const mainList = [
  { mainTitle: 'On-Chain Registries', list: onChainRegistries },
  { mainTitle: 'Tokenomics', list: tokenomics },
  { mainTitle: 'Governance', list: governance },
];

export const ProtocolKeyFeatures = () => (
  <SectionWrapper
    id="key-components"
    customClasses="lg:p-24 px-4 py-12 border-y"
  >
    <div className={`${SCREEN_WIDTH_LG} gap-5`}>
      <div>
        The Olas Protocol provides a framework for coordinating and managing{' '}
        <Link href="/learn" className="text-purple-600">
          autonomous agent systems
        </Link>
        . Each part of the Protocol is designed to ensure scalability and
        security. It provides a mechanism to: one, incentivize developers
        proportionally to their contributions, two, incentivize operators to run
        agent systems, and three, incentivize bonders to provide liquidity,
        collectively supporting the growth of a decentralised ecosystem. Olas
        Protocol is currently deployed on multiple blockchains, with plans for
        further expansions.
      </div>

      <h2 className={`${SUB_HEADER_CLASS} mb-2`}>Key Components</h2>

      {mainList.map(({ mainTitle, list }) => (
        <Fragment key={mainTitle}>
          <p className={`${TEXT_LARGE_CLASS} font-bold`}>{mainTitle}</p>

          <ul className="list-disc ml-4">
            {list.map(({ title, subList }) => (
              <li key={title} className="mb-4">
                <strong className="mb-2">{`${title}: `}</strong>
                {subList.map((subTitle) => (
                  <Fragment key={subTitle}>{subTitle}</Fragment>
                ))}
              </li>
            ))}
          </ul>
        </Fragment>
      ))}
    </div>
  </SectionWrapper>
);
