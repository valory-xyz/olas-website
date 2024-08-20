import { Fragment } from 'react';
import Link from 'next/link';

import {
  SECTION_BOX_CLASS,
  SCREEN_WIDTH_LG,
  SUB_HEADER_CLASS,
} from 'common-util/classes';
import { Button } from 'components/ui/button';
import SectionWrapper from 'components/Layout/SectionWrapper';

const steps = [
  {
    title: 'Provide liquidity',
    description: (
      <>
        As a bonder, you exchange your LP tokens for discounted OLAS to help the
        Olas ecosystem operate smoothly and sustainably. Simply deposit your LP
        tokens to your chosen
        {' '}
        <a
          href="https://tokenomics.olas.network/bonding-products"
          className="text-purple-600"
        >
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
      'In return for providing liquidity, Olas bonders receive OLAS tokens at a discounted price.',
  },
  {
    title: 'Support the ecosystem',
    description:
      'The provided liquidity helps grow the Olas network, ensuring sustainable liquidity to enable smooth operation for other network participants, like operators and builders.',
  },
  {
    title: 'Stay informed',
    description:
      'Follow Olas channels and engage with the Olas community to discover resources and say on top of new updates.',
  },
];

export const HowBondingWorks = () => (
  <SectionWrapper customClasses={`${SECTION_BOX_CLASS} lg:pt-32 border-b`}>
    <div className={`${SCREEN_WIDTH_LG} gap-2`}>
      <h2 className={`${SUB_HEADER_CLASS}`}>How bonding works</h2>

      {steps.map(({ title, description }) => (
        <Fragment key={title}>
          <h3 className="text-xl font-semibold mt-4">{title}</h3>
          <p>{description}</p>
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
