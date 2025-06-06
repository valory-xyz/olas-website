import Link from 'next/link';
import { Fragment } from 'react';

import { SCREEN_WIDTH_LG, TEXT_LARGE_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';

const keyFeatures = [
  {
    title: 'Modular Architecture',
    subList: [
      'Olas Stack’s modular design allows for flexible and scalable solutions, enabling developers to integrate various components seamlessly.',
    ],
  },
  {
    title: 'Decentralized Governance',
    subList: [
      'Empower your applications with decentralized governance mechanisms, ensuring transparency and security in operations.',
    ],
  },
  {
    title: 'Interoperability',
    subList: [
      'Built to support interoperability, Olas Stack ensures smooth interaction between different autonomous agents and systems.',
    ],
  },
  {
    title: 'Comprehensive Documentation',
    subList: [
      'Access in-depth guides, tutorials, and API references to get started quickly and efficiently.',
    ],
  },
];

const gettingStarted = [
  {
    title: 'Installation',
    subList: [
      'Begin by installing the core components of Olas Stack. Follow our detailed installation guide to set up your development environment.',
    ],
  },
  {
    title: 'Development',
    subList: [
      'Utilize our comprehensive framework and development tools to create your autonomous services. Leverage pre-built modules to expedite your development process.',
    ],
  },
  {
    title: 'Deployment',
    subList: [
      <div key="3">
        Deploy your agents on the{' '}
        <Link href="/protocol" className="text-purple-600">
          Olas Protocol
        </Link>{' '}
        to benefit from its different mechanisms. Our deployment guides provide
        step-by-step instructions for seamless integration.
      </div>,
    ],
  },
];

const mainList = [
  { mainTitle: 'Key Features', anchor: 'key-features', list: keyFeatures },
  {
    mainTitle: 'Getting Started with Olas Stack',
    anchor: 'get-started',
    list: gettingStarted,
  },
];

export const StackKeyFeatures = () => (
  <SectionWrapper customClasses="lg:p-24 px-4 py-12 border-y" id="key-features">
    <div className={`${SCREEN_WIDTH_LG} gap-5`}>
      <p>
        The Olas Stack is a comprehensive framework built to optimize the
        creation, deployment, and management of{' '}
        <Link href="/learn" className="text-purple-600">
          autonomous agent systems
        </Link>
        . Leveraging advanced decentralized technologies, Olas Stack offers a
        robust infrastructure for developing complex autonomous applications
        with ease and efficiency.
      </p>

      {mainList.map(({ mainTitle, anchor, list }) => (
        <div id={anchor} key={mainTitle}>
          <p className={`${TEXT_LARGE_CLASS} font-bold`}>{mainTitle}</p>

          <ul className="list-disc ml-4">
            {list.map(({ title, subList }) => (
              <li key={title} className="mb-4">
                <strong className="mb-2">{`${title}: `}</strong>
                {subList.map((subTitle, index) => (
                  <Fragment key={index}>{subTitle}</Fragment>
                ))}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </SectionWrapper>
);
