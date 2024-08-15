/* eslint-disable jsx-a11y/anchor-is-valid */
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
    title: 'Define your goals and KPIs',
    description: 'Outline your chain ecosystem goals and key performance indicators (KPIs) to address market needs and define agent success criteria.',
  },
  {
    title: 'Design your agent economy',
    description: 'Develop a technical document outlining the design, interactions, and required instances of agents, and translate these specifics into your staking contract.',
  },
  {
    title: 'Engage builders',
    description: 'Partner with builders to develop and test your agents; Valory can help in pairing with suitable developers and overseeing the embedding of KPIs into the staking contracts.',
  },
  {
    title: 'Promote and co-market',
    description: 'Showcase and market your agent economy, engaging the Olas community to maximize outreach and incentivize operator participation.',
  },
  {
    title: 'Watch your metrics grow',
    description: 'Sit back, relax, and celebrate growth as your agents become your daily active users.',
  },
];

const CTA = () => (
  <SectionWrapper
    customClasses={`${SECTION_BOX_CLASS} lg:pt-16 border-b`}
    id="get-started"
  >
    <div className={`${SCREEN_WIDTH_LG} gap-2`}>
      <h2 className={`${SUB_HEADER_CLASS}`}>Create your agent economy</h2>

      {steps.map(({ title, description }) => (
        <Fragment key={title}>
          <h3 className="text-xl font-semibold mt-4">{title}</h3>
          <p>{description}</p>
        </Fragment>
      ))}

      <div className="self-center">
        <Button
          variant="default"
          size="xl"
          asChild
          className="mt-10"
        >
          <Link href="">Get Started</Link>
        </Button>
      </div>
    </div>
  </SectionWrapper>
);
export default CTA;
