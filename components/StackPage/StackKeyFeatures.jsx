import { Fragment } from 'react';

import {
  TEXT_LARGE_CLASS,
  SCREEN_WIDTH_LG,
  SUB_HEADER_CLASS,
} from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';

const childUlClass = 'ml-4 mt-1 list-disc list-inside';

const keyFeatures = [
  {
    title: 'Modular Architecture',
    subList: [
      'Olas Stack’s modular design allows for flexible and scalable solutions, enabling developers to integrate various components seamlessly.',
    ],
  },
  {
    title: 'Decentralised Governance',
    subList: [
      'Empower your applications with decentralised governance mechanisms, ensuring transparency and security in operations.',
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
      'Utilize our comprehensive SDK and development tools to create your autonomous services. Leverage pre-built modules to expedite your development process.',
    ],
  },
  {
    title: 'Deployment',
    subList: [
      'Deploy your services on a decentralised network, ensuring high availability and resilience. Our deployment guides provide step-by-step instructions for seamless integration.',
    ],
  },
  {
    title: 'Management',
    subList: [
      'Monitor and manage your services using our intuitive dashboard and management tools. Ensure optimal performance and scalability with real-time insights.',
    ],
  },
];

const benefits = [
  {
    mainTitle: 'Key Features',
    list: keyFeatures,
  },
  {
    mainTitle: 'Getting Started with Olas Stack',
    list: gettingStarted,
  },
];

export const StackKeyFeatures = () => (
  <SectionWrapper customClasses="lg:p-24 px-4 py-12 border-y" id="rewards">
    <div className={`${SCREEN_WIDTH_LG} gap-5`}>
      <h2 className={`${SUB_HEADER_CLASS} mb-2`}>
        Welcome to Olas Stack: Pioneering Autonomous Solutions
      </h2>

      <p>
        Olas Stack is a comprehensive framework designed to facilitate the
        creation, deployment, and management of autonomous services and agents.
        Leveraging advanced decentralised technologies, Olas Stack offers a
        robust infrastructure for developing complex autonomous applications
        with ease and efficiency.
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
