import { Fragment } from 'react';
import Link from 'next/link';

import { Button } from 'components/ui/button';
import {
  SECTION_BOX_CLASS,
  SCREEN_WIDTH_LG,
  SUB_HEADER_CLASS,
} from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';

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
        <a
          href="https://govern.olas.network"
          target="_blank"
          rel="noreferrer"
          className="text-purple-600"
        >
          Govern App ↗
        </a>
        . Simply connect your wallet to start voting.
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
        Use the Govern App to access proposals on platforms like{' '}
        <a
          href="https://snapshot.org/#/autonolas.eth"
          target="_blank"
          rel="noreferrer"
          className="text-purple-600"
        >
          Snapshot ↗
        </a>{' '}
        and{' '}
        <a
          href="https://boardroom.io/autonolas/"
          target="_blank"
          rel="noreferrer"
          className="text-purple-600"
        >
          Boardroom ↗
        </a>
        . Here, you can vote on existing proposals or submit your own, shaping
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
        <Button variant="default" size="xl" asChild className="mt-10">
          <Link href="https://govern.olas.network">Start governing now</Link>
        </Button>
      </div>
    </div>
  </SectionWrapper>
);
