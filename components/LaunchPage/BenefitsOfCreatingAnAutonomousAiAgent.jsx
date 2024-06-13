import { Fragment } from 'react';

import {
  TEXT_LARGE_CLASS,
  SCREEN_WIDTH_LG,
  SUB_HEADER_CLASS,
} from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';

const childUlClass = 'ml-4 mt-1 list-disc list-inside';

const benefitsOfDevelopingAndOfTheOlasStack = [
  {
    title: 'Progressive decentralization',
    subList: [
      'Effortlessly move between centralized and decentralized deployment modes.',
      'Offers autonomy, trustlessness, and more security.',
    ],
  },
  {
    title: 'Ease of building agents',
    subList: [
      'Build agents in the Olas framework with Lego-like composability.',
      'Olas abstracts the complexities of building decentralized apps.',
      'All popular agent frameworks will be composable with Olas including LangChain and AutoGen.',
    ],
  },
  {
    title: 'Ease of running agents',
    subList: [
      'Enjoy the benefits of thousands of people running your agent.',
      'Agents can easily be run by your users with a native downloadable application called Pearl which can be white-labeled with your own brand.',
      'Agents are also run by professional operators en masse.',
    ],
  },
  {
    title: 'Interoperability',
    subList: [
      'Unlike other agents, Olas agents can seamlessly take actions off-chain and on-chain.',
      'Olas has out-of-the-box multi-agent messaging support with other agents.',
    ],
  },
  {
    title: 'Account and gas abstraction',
    subList: [
      'Olas agents have native account abstraction and gas abstraction, e.g. on-chain Safe wallet and service and an off-chain set of keys.',
    ],
  },
  {
    title: 'Co-ownability',
    subList: [
      'Agent services are represented in Web3 as tokens or NFTs and can therefore be co-owned by DAOs.',
    ],
  },
];

const benefitsOfRunningAStakingEconomy = [
  {
    title: 'Agents can be your DAUs',
    subList: [
      'Agents will be productive DAUs doing whatever tasks you define via staking to coordinate and incentivize participation at scale.',
      'Incentivize agent activity to boost your chain, protocol or app activity.',
    ],
  },
  {
    title: 'Interdependence of agents',
    subList: [
      'Agent interdependence creates defensibility and fee capture mechanisms.',
      'Multi-agent systems, i.e. agents being composable and the ability to seamlessly interact with other agents and purchase from other agents.',
      'Agents can then run their own businesses autonomously, e.g. Mechs agents selling information to trader agents.',
    ],
  },
  {
    title: 'Attract and enable your agent operators to get paid',
    subList: ['Access to OLAS emissions to bootstrap your agent economy.'],
  },
  {
    title: 'Attract developers',
    subList: ['Tap into the thriving ecosystem of Olas agent developers.'],
  },
  {
    title: 'Bring utility to your own token',
    subList: ['Stake your own token to secure your agent networks.'],
  },
];

const benefits = [
  {
    mainTitle: 'Benefits of the Olas Stack',
    list: benefitsOfDevelopingAndOfTheOlasStack,
  },
  {
    mainTitle: 'Benefits of running an autonomous AI agent economy',
    list: benefitsOfRunningAStakingEconomy,
  },
];

export const BenefitsOfCreatingAnAutonomousAiAgent = () => (
  <SectionWrapper customClasses="lg:p-24 px-4 py-12 border-y" id="rewards">
    <div className={`${SCREEN_WIDTH_LG} gap-5`}>
      <h2 className={`${SUB_HEADER_CLASS} mb-2`}>
        Benefits of creating an autonomous AI agent economy on Olas
      </h2>

      <p>
        Olas is the foremost autonomous AI agent project with significant
        production deployments that have generated hundreds of thousands of
        transactions.
      </p>

      {benefits.map(({ mainTitle, list }) => (
        <Fragment key={mainTitle}>
          <p className={`${TEXT_LARGE_CLASS} font-bold`}>{mainTitle}</p>

          <ul className="list-outside">
            {list.map(({ title, subList }) => (
              <li key={title} className="mb-6">
                <strong className="mb-2">{title}</strong>
                <ul className={childUlClass}>
                  {subList.map((subTitle) => (
                    <li key={subTitle} className="mb-1">
                      {subTitle}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </Fragment>
      ))}
    </div>
  </SectionWrapper>
);
