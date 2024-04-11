import React from 'react';
import Link from 'next/link';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { H1, Lead } from 'components/ui/typography';
import { Button } from 'components/ui/button';
import { LAUNCH_CONTACT_URL } from 'common-util/constants';

const CTA = () => (
  <SectionWrapper customClasses="lg:p-24 px-4 py-12 border-y max-w-4xl mx-auto items-center text-center">
    <H1 className="mb-8">
      Looking for developers to build your agent?
    </H1>
    <Lead className="mb-8">
      This site can connect you with agent developers,
      versed in developing Olas agents and agent economies.
    </Lead>
    <div className="flex flex-wrap gap-2 justify-center">
      <Button variant="default" size="xl" asChild isExternal>
        <a href={LAUNCH_CONTACT_URL} target="_blank" rel="noopener noreferrer">
          Start a discussion
        </a>
      </Button>
      <Button variant="link" size="xl" asChild>
        <Link
          href="/build#opportunities"
          className="block text-primary hover:text-primary-800 transition-colors duration-300"
        >
          See existing opportunities
        </Link>
      </Button>
    </div>
  </SectionWrapper>
);

export default CTA;
