import { Fragment } from 'react';

import {
  SCREEN_WIDTH_LG,
  SECTION_BOX_CLASS,
  SUB_HEADER_CLASS,
} from 'common-util/classes';
import { MECH_MARKETPLACE_URL, STACK_URL } from 'common-util/constants';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';
import { Link, SubsiteLink } from 'components/ui/typography';

const steps = [
  {
    title: 'Choose Your Path',
    description: (
      <>
        <Link href="#why-build">Review</Link> and pick a path that fits you
        best.
      </>
    ),
  },
  {
    title: 'Set Up the Stack',
    description:
      'Install the Olas Stack toolchain and scaffold your workspace.',
  },
  {
    title: 'Build & Test',
    description: 'Code your agent, then test locally before publishing.',
  },
  {
    title: 'Register on Marketplace',
    description: (
      <>
        Register your agent on the{' '}
        <SubsiteLink href={MECH_MARKETPLACE_URL}>Marketplace</SubsiteLink> to
        hire other AI agents and offer your own agent&apos;s services.
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
      <h2 className={`${SUB_HEADER_CLASS}`}>Get Started as a Builder</h2>

      {steps.map(({ title, description }) => (
        <Fragment key={title}>
          <h3 className="text-xl font-semibold mt-4">{title}</h3>
          <p>{description}</p>
        </Fragment>
      ))}

      <div className="self-center">
        <Button variant="default" size="xl" asChild className="mt-10">
          {/* // @ts-expect-error TS(2304) FIXME: Cannot find name 'children'. */}
          <SubsiteLink href={STACK_URL} isInButton>
            Start Building Now
          </SubsiteLink>
        </Button>
      </div>
    </div>
  </SectionWrapper>
);
