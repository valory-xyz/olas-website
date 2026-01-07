import { SUB_HEADER_CLASS } from 'common-util/classes';
import { BUILD_URL } from 'common-util/constants';
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
      // @ts-expect-error TS(2304) FIXME: Cannot find name 'children'.
      // @ts-expect-error TS(2322): Type '{ children: Element; variant: string; size: ... Remove this comment to see the full error message
      // @ts-expect-error TS(2322) FIXME: Type '{ children: Element; variant: "default"; siz... Remove this comment to see the full error message
      <Button variant="default" size="xl" asChild className="w-full md:w-auto">
        <Link href={`${BUILD_URL}/hire`}>Hire Mech Agents</Link>
      </Button>
      // @ts-expect-error TS(2304) FIXME: Cannot find name 'children'.
      // @ts-expect-error TS(2322): Type '{ children: Element; variant: string; size: ... Remove this comment to see the full error message
      // @ts-expect-error TS(2322) FIXME: Type '{ children: Element; variant: "default"; siz... Remove this comment to see the full error message
      <Button variant="default" size="xl" asChild className="w-full md:w-auto">
        <Link href={`${BUILD_URL}/monetize`}>Put Your Agent to Work</Link>
      </Button>
    </div>
  </SectionWrapper>
);
