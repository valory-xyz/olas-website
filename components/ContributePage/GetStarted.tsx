import { Fragment } from 'react';

import {
  SCREEN_WIDTH_LG,
  SECTION_BOX_CLASS,
  SUB_HEADER_CLASS,
} from 'common-util/classes';
import { CONTRIBUTE_URL } from 'common-util/constants';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';
import { SubsiteLink } from 'components/ui/typography';

const steps = [
  {
    title: 'Sign up to the Contribute app',
    description: (
      <>
        Go to the{' '}
        // @ts-expect-error TS(2304) FIXME: Cannot find name 'childre'.
        // @ts-expect-error TS(2741): Property 'className' is missing in type '{ childre... Remove this comment to see the full error message
        <SubsiteLink href={CONTRIBUTE_URL}>Contribute App</SubsiteLink>
        . <br />
        Link your crypto wallet to get started with Contribute.
      </>
    ),
  },
  {
    title: 'Link your X account',
    description:
      'Connect your X profile to the Contribute App in just a few clicks.',
  },
  {
    title: 'Stake OLAS',
    description: 'Stake your OLAS tokens to start participating.',
  },
  {
    title: 'Join a campaign',
    description:
      'Participate in supported campaigns, and post quality content about Olas on X.',
  },
  {
    title: 'Earn rewards for quality posts',
    description:
      'Collect potential OLAS rewards for high-quality posts and build your influence.',
  },
  {
    title: 'Climb the rankings',
    description:
      'Rise on the leaderboard, collect dynamic NFT badges, and showcase your contributions to the community.',
  },
];

export const GetStarted = () => (

  <SectionWrapper
    id="get-started"
    customClasses={`${SECTION_BOX_CLASS} lg:pt-32 border-b`}
  >
    <div className={`${SCREEN_WIDTH_LG} gap-2`}>
      <h2 className={`${SUB_HEADER_CLASS}`}>
        Get started as an Olas Contributor
      </h2>

      {steps.map(({ title, description }) => (
        <Fragment key={title}>
          <h3 className="text-xl font-semibold mt-4">{title}</h3>
          <p>{description}</p>
        </Fragment>
      ))}

      <div className="self-center">
        // @ts-expect-error TS(2304) FIXME: Cannot find name 'children'.
        // @ts-expect-error TS(2322): Type '{ children: Element; variant: string; size: ... Remove this comment to see the full error message
        // @ts-expect-error TS(2322) FIXME: Type '{ children: any[]; variant: "default"; size:... Remove this comment to see the full error message
        <Button variant="default" size="xl" asChild className="mt-4 md:mt-10">
          // @ts-expect-error TS(2304) FIXME: Cannot find name 'childre'.
          // @ts-expect-error TS(2741): Property 'className' is missing in type '{ childre... Remove this comment to see the full error message
          <SubsiteLink href={CONTRIBUTE_URL} isInButton>
            Get started
          </SubsiteLink>
        </Button>
      </div>
    </div>
  </SectionWrapper>
);
