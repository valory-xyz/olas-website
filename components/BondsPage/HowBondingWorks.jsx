import Link from 'next/link';
import { Fragment } from 'react';

import {
  SCREEN_WIDTH_LG,
  SECTION_BOX_CLASS,
  SUB_HEADER_CLASS,
} from 'common-util/classes';
import { BONDING_PROGRAMS_URL } from 'common-util/constants';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';
import { ExternalLink } from 'components/ui/typography';

const steps = [
  {
    title: 'Provide liquidity',
    description: (
      <>
        As a Bonder, you exchange your LP tokens for discounted OLAS to help the
        Olas ecosystem operate smoothly and sustainably. Simply deposit your LP
        tokens to your chosen{' '}
        <a href={BONDING_PROGRAMS_URL} className="text-purple-600">
          bonding program
        </a>
        , exchanging your LP tokens for discounted OLAS, available after the
        predetermined vesting period.
      </>
    ),
  },
  {
    title: 'Receive benefits',
    description:
      'In return for providing liquidity, Olas Bonders receive OLAS tokens at a discounted price.',
  },
  {
    title: 'Support the ecosystem',
    description:
      'The provided liquidity helps grow the Olas network, ensuring sustainable liquidity to enable smooth operation for other network participants, like Operators and Builders.',
  },
  {
    title: 'Stay informed',
    description: (
      <>
        Follow Olas{' '}
        <ExternalLink href="https://twitter.com/autonolas">
          channels
        </ExternalLink>{' '}
        and{' '}
        <ExternalLink href="https://discord.gg/BQzYqhjGjQ">
          engage with the Olas community
        </ExternalLink>{' '}
        to discover resources and say on top of new updates.
      </>
    ),
  },
];

export const HowBondingWorks = () => (
  <SectionWrapper customClasses={`${SECTION_BOX_CLASS} lg:pt-32 border-b`}>
    <div className={`${SCREEN_WIDTH_LG} gap-2`}>
      <h2 className={`${SUB_HEADER_CLASS}`}>How bonding works</h2>

      {steps.map(({ title, description }) => (
        <Fragment key={title}>
          <h3 className="text-xl font-semibold mt-4">{title}</h3>
          <div>{description}</div>
        </Fragment>
      ))}

      <div className="self-center">
        <Button variant="default" size="xl" asChild className="mt-4 md:mt-10">
          <Link href="https://bond.olas.network/">Start bonding now</Link>
        </Button>
      </div>
    </div>
  </SectionWrapper>
);
