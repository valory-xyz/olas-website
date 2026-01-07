import { SUB_HEADER_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';
import quotes from 'data/trustedBy.json';
import Link from 'next/link';
import { Trustee } from './Trustee';

export const TrustedBy = () => (
  <SectionWrapper
    id="social-proof"
    customClasses="lg:p-24 px-4 py-20 mt-20"
    backgroundType="NONE"
  >
    <h2 className={`${SUB_HEADER_CLASS} text-center mb-6 lg:mb-14`}>
      Trusted by Leading Web3 Teams and Users
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto mb-10 md:mb-14">
      {quotes.map((quote, index) => (
        <Trustee key={index} quote={quote} />
      ))}
    </div>
    <div className="flex justify-center">
      // @ts-expect-error TS(2304) FIXME: Cannot find name 'children'.
      // @ts-expect-error TS(2322): Type '{ children: Element; variant: string; size: ... Remove this comment to see the full error message
      // @ts-expect-error TS(2322) FIXME: Type '{ children: Element; variant: "outline"; siz... Remove this comment to see the full error message
      <Button variant="outline" size="lg" asChild className="">
        <Link href="/case-studies">Explore Case Studies</Link>
      </Button>
    </div>
  </SectionWrapper>
);
