import { Fragment } from 'react';

import {
  SCREEN_WIDTH_LG,
  SECTION_BOX_CLASS,
  SUB_HEADER_CLASS,
} from 'common-util/classes';
import { LAUNCH_URL } from 'common-util/constants';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';
import { SubsiteLink } from 'components/ui/typography';

const steps = [
  {
    title: 'Define your goals and KPIs',
    description:
      'Outline your chain ecosystem goals and key performance indicators (KPIs) to address market needs and define agent success criteria.',
  },
  {
    title: 'Design your agent economy',
    description:
      'Develop a technical document outlining the design, interactions, and required instances of agents, and translate these specifics into your staking contract.',
  },
  {
    title: 'Engage builders',
    description:
      'Partner with builders to develop and test your agents; Valory can help in pairing with suitable developers and overseeing the embedding of KPIs into the staking contracts.',
  },
  {
    title: 'Promote and co-market',
    description:
      'Showcase and market your agent economy, engaging the Olas community to maximize outreach and incentivize operator participation.',
  },
  {
    title: 'Watch your metrics grow',
    description:
      'Sit back, relax and celebrate growth as your agents become your daily active users.',
  },
];

export const CreateYourAgentEconomyToday = () => (
  <SectionWrapper
    id="get-started"
    customClasses={`${SECTION_BOX_CLASS} lg:pt-16 border-b`}
  >
    <div className={`${SCREEN_WIDTH_LG} gap-2`}>
      <h2 className={`${SUB_HEADER_CLASS}`}>Create your agent economy today</h2>

      {steps.map(({ title, description }) => (
        <Fragment key={title}>
          <h3 className="text-xl font-semibold mt-4">{title}</h3>
          <p>{description}</p>
        </Fragment>
      ))}

      <div className="self-center">
        {/* @ts-expect-error TS(2322) FIXME: Type '{ children: any[]; variant: "default"; size:... Remove this comment to see the full error message */}{' '}
        <Button variant="default" size="xl" asChild className="mt-4 md:mt-10">
          <SubsiteLink href={LAUNCH_URL} isInButton>
            Get Started
          </SubsiteLink>
        </Button>
      </div>
    </div>
  </SectionWrapper>
);
