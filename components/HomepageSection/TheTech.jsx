import Image from 'next/image';
import PropTypes from 'prop-types';

import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';
import { Link, Upcase } from 'components/ui/typography';
import { Card, CardTitle } from 'components/ui/card';
import SectionHeading from '../SectionHeading';

const innovations = [
  {
    title: 'Olas Protocol',
    image: '/images/olas-protocol.png',
    description:
      'The on-chain protocol coordinates, incentivizes and guides different actors towards Olas’ goals.',
    descriptionSubText: 'It’s key components are:',
    descriptionItems: [
      'On-Chain Registries',
      'Tokenomics',
      'Developer Rewards',
    ],
    link: '/protocol',
  },
  {
    title: 'Olas Stack',
    image: '/images/olas-stack.png',
    description:
      'Open-source framework that enables developers to build autonomous agents that:',
    descriptionItems: [
      'run off-chain',
      'can be co-owned',
      'are highly robust and transparent',
      'benefit from modularity',
    ],
    link: '/stack',
  },
];

export const TheTech = ({ hideLearnMoreButton = false }) => (
  <SectionWrapper
    backgroundType="NONE"
    customClasses="text-center py-24 px-4 border-b bg-gradient-to-tl from-[#F5D0FE] to-white to-80%"
  >
    <Upcase>
      <span>THE TECH</span>
    </Upcase>
    <SectionHeading color="text-gray-900" weight="font-bold">
      Enabled by two core innovations
    </SectionHeading>

    <div className="grid md:grid-cols-2 gap-4 max-w-screen-xl mx-auto mb-16">
      {innovations.map((item) => (
        <Card
          className="grid grid-cols-5 gap-6 p-6 bg-white items-start"
          key={item.title}
        >
          <Image
            alt={item.title}
            src={item.image}
            width={275}
            height={200}
            className="object-contain col-span-2 mt-4"
          />
          <div className="col-span-3 text-start">
            <CardTitle className="mb-4 lg:text-3xl">
              <span>{item.title}</span>
            </CardTitle>
            <p className="mb-2">{item.description}</p>
            {item.descriptionSubText && (
              <p className="mb-2">{item.descriptionSubText}</p>
            )}

            {item.descriptionItems && item.descriptionItems.length > 0 && (
              <ul className="list-disc pl-5 mb-4">
                {item.descriptionItems.map((descriptionItem) => (
                  <li key={descriptionItem}>{descriptionItem}</li>
                ))}
              </ul>
            )}
            <Link href={item.link}>Learn more</Link>
          </div>
        </Card>
      ))}
    </div>

    {!hideLearnMoreButton && (
      <Button variant="outline" size="xl" asChild className="mt-auto">
        <Link href="/learn">Learn more</Link>
      </Button>
    )}
  </SectionWrapper>
);

TheTech.propTypes = {
  hideLearnMoreButton: PropTypes.bool,
};

TheTech.defaultProps = {
  hideLearnMoreButton: false,
};
