import { DOCS_BASE_URL } from 'common-util/constants';
import { SUB_HEADER_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';

export const StackCta = () => (
  <SectionWrapper customClasses="lg:p-24 px-4 py-12 border-y">
    <div className="max-w-4xl mx-auto items-center text-center">
      <h2 className={`${SUB_HEADER_CLASS} mb-6`}>Explore Olas Stack Today</h2>

      <p className="mb-8">
        Dive into the world of autonomous services with Olas Stack. Our
        extensive resources and community support are here to guide you every
        step of the way. Start building the future of autonomous technology
        today.
      </p>

      <div className="flex flex-wrap gap-2 justify-center">
        <Button variant="default" size="xl" asChild isExternal>
          <a
            href={`${DOCS_BASE_URL}/open-autonomy`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Get Started with Olas Stack
          </a>
        </Button>
      </div>
    </div>
  </SectionWrapper>
);
