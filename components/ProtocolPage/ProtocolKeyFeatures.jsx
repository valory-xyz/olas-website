import { Fragment } from 'react';

import { TEXT_LARGE_CLASS, SCREEN_WIDTH_LG } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';

const onChainRegistries = [
  {
    title: 'Autonomous Services & Agents',
    subList: ['Register services and components as NFTs.'],
  },
  {
    title: 'Software Composability',
    subList: ['Combine components into agents and services.'],
  },
];

const tokenomics = [
  {
    title: 'OLAS Token',
    subList: ['Facilitates pairing capital with code.'],
  },
  {
    title: 'Decentralised Services',
    subList: ['Operated by a DAO and ecosystem actors.'],
  },
  {
    title: 'Incentives',
    subList: ['Rewarding software composability and utility.'],
  },
];

const governance = [
  {
    title: 'Decentralised Management',
    subList: [' DAO steers protocol developments'],
  },
];

const mainList = [
  { mainTitle: 'Key Components', list: [] },
  { mainTitle: 'On-Chain Registries', list: onChainRegistries },
  { mainTitle: 'Tokenomics', list: tokenomics },
  { mainTitle: 'Governance', list: governance },
];

export const ProtocolKeyFeatures = () => (
  <SectionWrapper customClasses="lg:p-24 px-4 py-12 border-y" id="key-features">
    <div className={`${SCREEN_WIDTH_LG} gap-5`}>
      <p>
        Olas Protocol is a comprehensive solution for coordinating, securing,
        and managing software code on public blockchains. It provides a
        mechanism to incentivise developers proportionally to their
        contributions, supporting the growth of a decentralised ecosystem. Built
        with the Open Autonomy framework, Olas Protocol is currently deployed on
        multiple blockchains, with plans for further expansions.
      </p>

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
