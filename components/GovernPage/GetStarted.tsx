import { Fragment } from 'react';

import {
  SCREEN_WIDTH_LG,
  SECTION_BOX_CLASS,
  SUB_HEADER_CLASS,
} from 'common-util/classes';
import { GOVERN_URL, SNAPSHOT_URL } from 'common-util/constants';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';
import { SubsiteLink } from 'components/ui/typography';

const steps = [
  {
    title: 'Acquire veOLAS',
    description:
      'Start by locking your OLAS tokens to receive veOLAS, the Olas governance token. This makes you an Olas Governor and grants you the voting power needed to participate actively in the governance of the Olas ecosystem.',
  },
  {
    title: 'Access The Govern App',
    description: (
      <>
        You can do everything governance related on the{' '}
        // @ts-expect-error TS(2304) FIXME: Cannot find name 'childre'.
        // @ts-expect-error TS(2741): Property 'className' is missing in type '{ childre... Remove this comment to see the full error message
        <SubsiteLink href={GOVERN_URL}>Govern App</SubsiteLink>. Simply connect
        your wallet to start voting.
      </>
    ),
  },
  {
    title: 'Direct Emissions',
    description:
      'Browse and vote on staking contracts created by launchers to direct OLAS emissions effectively.',
  },
  {
    title: 'Participate in Proposals',
    description: (
      <>
        Use the Govern App to access on-chain proposals (off-chain proposals can
        be found on{' '}
        <a
          href={SNAPSHOT_URL}
          target="_blank"
          rel="noreferrer"
          className="text-purple-600"
        >
          Snapshot ↗
        </a>
        ). Here, you can vote on existing proposals or submit your own, shaping
        the future direction of Olas.
      </>
    ),
  },
];

export const GetStarted = () => (

  <SectionWrapper
    customClasses={`${SECTION_BOX_CLASS} lg:pt-16 border-b`}
    id="get-started"
  >
    <div className={`${SCREEN_WIDTH_LG} gap-2`}>
      <h2 className={`${SUB_HEADER_CLASS}`}>Get started</h2>

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
        <Button variant="default" size="xl" asChild className="mt-10">
          // @ts-expect-error TS(2304) FIXME: Cannot find name 'childre'.
          // @ts-expect-error TS(2741): Property 'className' is missing in type '{ childre... Remove this comment to see the full error message
          <SubsiteLink href={GOVERN_URL} isInButton>
            Start governing now
          </SubsiteLink>
        </Button>
      </div>
    </div>
  </SectionWrapper>
);
