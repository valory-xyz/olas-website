import { Button } from 'components/ui/button';
import SectionHeading from '../SectionHeading';
import SectionWrapper from '../Layout/SectionWrapper';
import { CTA_LINK } from './utils';

const Contribute = () => (
  <SectionWrapper backgroundType="SUBTLE_GRADIENT">
    <section>
      <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          <SectionHeading color="text-purple-950" size="text-4xl md:text-6xl lg:text-4xl">
            Start earning points today
          </SectionHeading>

          <Button
            variant="default"
            size="xl"
            asChild
            className="mb-6 w-full md:w-auto"
          >
            <a href={CTA_LINK}>Contribute now</a>
          </Button>
        </div>
      </div>
    </section>
  </SectionWrapper>
);

export default Contribute;
