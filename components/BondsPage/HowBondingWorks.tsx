import { Fragment } from 'react';

import {
  SCREEN_WIDTH_LG,
  SECTION_BOX_CLASS,
  SUB_HEADER_CLASS,
} from 'common-util/classes';
import {
  BOND_URL,
  BONDING_PROGRAMS_URL,
  DISCORD_INVITE_URL,
  X_OLAS_URL,
} from 'common-util/constants';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';
import { ExternalLink, SubsiteLink } from 'components/ui/typography';

const steps = [
  {
    title: 'Provide liquidity',
    description: (
      <>
        As a Bonder, you exchange your LP tokens for discounted OLAS to help the
        Olas ecosystem operate smoothly and sustainably. Simply deposit your LP
        tokens to your chosen{' '}
        <SubsiteLink href={BONDING_PROGRAMS_URL}>bonding program</SubsiteLink>,
        exchanging your LP tokens for discounted OLAS, available after the
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
        Follow Olas <ExternalLink href={X_OLAS_URL}>channels</ExternalLink> and{' '}
        <ExternalLink href={DISCORD_INVITE_URL}>
          engage with the Olas community
        </ExternalLink>{' '}
        to discover resources and say on top of new updates.
      </>
    ),
  },
];

export const HowBondingWorks = () => (
  <SectionWrapper
    id="how-it-works"
    customClasses={`${SECTION_BOX_CLASS} lg:pt-32 border-b`}
  >
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
          <SubsiteLink href={BOND_URL} isInButton>
            Start bonding now
          </SubsiteLink>
        </Button>
      </div>
    </div>
  </SectionWrapper>
);
