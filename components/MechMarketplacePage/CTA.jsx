import { SUB_HEADER_CLASS } from 'common-util/classes';
import { STACK_URL } from 'common-util/constants';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';
import Link from 'next/link';

export const CTA = () => (
  <SectionWrapper backgroundType="SUBTLE_GRADIENT">
    <h2
      className={`${SUB_HEADER_CLASS} mb-8 font-semibold text-center lg:mb-14`}
    >
      Get started with the Mech Marketplace today
    </h2>
    <div className="place-content-center mx-auto flex max-sm:flex-col gap-4">
      <Button variant="default" size="xl" asChild className="w-full md:w-auto">
        <Link href={`${STACK_URL}/mech-client`}>Hire Mech Agents</Link>
      </Button>
      <Button variant="default" size="xl" asChild className="w-full md:w-auto">
        <Link href={`${STACK_URL}/mech-tool/`}>Put Your Agent to Work</Link>
      </Button>
    </div>
  </SectionWrapper>
);
