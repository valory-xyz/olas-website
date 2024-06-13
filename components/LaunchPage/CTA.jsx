import Link from 'next/link';

import { LAUNCH_CONTACT_URL } from 'common-util/constants';
import { SUB_HEADER_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';

const CTA = () => (
  <SectionWrapper customClasses="lg:p-24 px-4 py-12 border-y">
    <div className="max-w-4xl mx-auto items-center text-center">
      <h2 className={`${SUB_HEADER_CLASS} mb-6`}>
        Looking to launch an autonomous AI agent or entire agent economy?
      </h2>

      <p className="mb-8">
        This site can connect you with agent developers, versed in developing
        Olas agents and agent economies.
      </p>

      <div className="flex flex-wrap gap-2 justify-center">
        <Button variant="default" size="xl" asChild isExternal>
          <a
            href={LAUNCH_CONTACT_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
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
    </div>
  </SectionWrapper>
);

export default CTA;
