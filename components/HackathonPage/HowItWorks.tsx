import Link from 'next/link';
import { Fragment } from 'react';

import { SUB_HEADER_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';

const steps = [
  {
    title: 'Choose a Track',
    description:
      'Select from Mech Demand, Mech Supply, Olas SDK, or Stack-based builds.',
  },
  {
    title: 'Register for a Hackathon',
    description: 'Pick an upcoming hackathon and register.',
  },
  {
    title: 'Build Autonomously',
    description:
      'Use the Olas docs, starter templates, and community support to get building.',
  },
  {
    title: 'Submit and Demo',
    description: 'Open-source your agent and present it for review.',
  },
  {
    title: 'Contribute Long-Term',
    description:
      'Hackathon agents can evolve into production services, incentivized through Olas staking or PoAA rewards.',
  },
];

export const HowItWorks = () => (

  <SectionWrapper id="how-it-works" customClasses="py-8 px-5 lg:px-0">
    <div className="max-w-[640px] gap-2 mx-auto">
      <h2 className={`${SUB_HEADER_CLASS}`}>How It Works</h2>

      {steps.map(({ title, description }) => (
        <Fragment key={title}>
          <h3 className="text-xl font-semibold mt-4">{title}</h3>
          <p>{description}</p>
        </Fragment>
      ))}

      <div className="flex flex-col md:flex-row gap-3">
        // @ts-expect-error TS(2304) FIXME: Cannot find name 'children'.
        // @ts-expect-error TS(2322): Type '{ children: Element; variant: string; size: ... Remove this comment to see the full error message
        // @ts-expect-error TS(2322) FIXME: Type '{ children: Element; variant: "default"; siz... Remove this comment to see the full error message
        <Button variant="default" size="lg" asChild className="mt-4 md:mt-10">
          <Link href="#events">Get Involved</Link>
        </Button>
        // @ts-expect-error TS(2304) FIXME: Cannot find name 'children'.
        // @ts-expect-error TS(2322): Type '{ children: Element; variant: string; size: ... Remove this comment to see the full error message
        // @ts-expect-error TS(2322) FIXME: Type '{ children: Element; variant: "outline"; siz... Remove this comment to see the full error message
        <Button variant="outline" size="lg" asChild className="mt-4 md:mt-10">
          <Link href="/build">Learn to Build</Link>
        </Button>
      </div>
    </div>
  </SectionWrapper>
);
