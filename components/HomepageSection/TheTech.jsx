import Image from 'next/image';
import PropTypes from 'prop-types';

import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';
import { Card, CardTitle } from 'components/ui/card';
import { ExternalLink, Link } from 'components/ui/typography';
import SectionHeading from '../SectionHeading';

const innovations = [
  {
    title: 'Olas Protocol',
    image: {
      src: '/images/olas-protocol.png',
      height: 160,
      width: 222,
    },
    description: (
      <>
        The multi-chain protocol coordinates, incentivizes and guides its
        participants towards Olas&apos; goals. Anyone can{' '}
        <Link href="#choose-your-role">get involved</Link> through a role-based
        system and and be rewarded for their useful contributions.
      </>
    ),
    descriptionSubText: 'Its key components are:',
    descriptionItems: [
      'Developer Rewards mechanism to incentivise agent code contributions.',
      <>
        <ExternalLink href="https://staking.olas.network/" hideArrow>
          Staking mechanism
        </ExternalLink>{' '}
        to incentivise active agent contributions.
      </>,
      'Bonding mechanism to incentivise liquidity provision.',
    ],
    link: '/protocol',
  },
  {
    title: 'Olas Stack',
    image: {
      src: '/images/olas-stack.png',
      height: 160,
      width: 160,
    },
    description:
      'Open-source framework that enables developers to build autonomous agents that:',
    descriptionItems: [
      'Run off-chain.',
      'Are secured on-chain.',
      'Can be co-owned (i.e Decentralized Agents).',
      'Are highly robust and transparent.',
      'Benefit from modularity.',
    ],
    link: '/stack',
  },
];

// TODO: to be moved to docs.olas.network landing page
export const TheTech = ({ hideLearnMoreButton = false }) => (
  <SectionWrapper
    backgroundType="NONE"
    customClasses="text-center py-16 md:py-24 px-4 border-b bg-[linear-gradient(180deg,_#FFF_0%,_#F9E5FF_100%)]"
    id="tech"
  >
    <SectionHeading
      size="max-sm:text-5xl"
      color="text-gray-900"
      weight="font-bold"
    >
      Underpinned By Two Core Innovations
    </SectionHeading>

    <div className="grid md:grid-cols-2 gap-x-10 gap-y-4 max-w-5xl mx-auto mb-16">
      {innovations.map((item) => (
        <Card
          className="flex flex-col gap-6 p-6 bg-white rounded-2xl border-0"
          key={item.title}
        >
          <Image
            alt={item.title}
            src={item.image.src}
            width={item.image.width}
            height={item.image.height}
            className="object-contain self-center"
          />
          <div className="text-start">
            <CardTitle className="mb-4">
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
