import { SUB_HEADER_CLASS } from 'common-util/classes';
import { STACK_URL } from 'common-util/constants';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';

export const ProtocolCta = () => (
  <SectionWrapper
    customClasses="lg:p-24 px-4 py-12 border-y"
    backgroundType="SUBTLE_GRADIENT"
  >
    <div className="max-w-4xl mx-auto items-center text-center">
      <h2 className={`${SUB_HEADER_CLASS} mb-6`}>
        Learn more about Olas Protocol today
      </h2>

      <div className="flex flex-wrap gap-2 justify-center">
        <Button variant="default" size="xl" asChild>
          <a
            href={`${STACK_URL}/protocol`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Check out documentation
          </a>
        </Button>
      </div>
    </div>
  </SectionWrapper>
);
