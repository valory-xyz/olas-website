import { SUB_HEADER_CLASS } from 'common-util/classes';
import { ACCELERATOR_APPLY_URL } from 'common-util/constants';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';
import { Hexagon } from 'lucide-react';
import Link from 'next/link';

export const CTA = () => (
  <SectionWrapper backgroundType="SUBTLE_GRADIENT">
    <div className="text-center">
      <h2 className={`${SUB_HEADER_CLASS} font-semibold mb-12`}>
        Ready to Build the Next Big AI Agent?
      </h2>
      <div className="flex flex-col md:flex-row md:divide-x max-sm:text-left max-sm:gap-2 w-fit mx-auto">
        <div className="flex flex-row place-items-center md:px-4">
          <Hexagon className="text-purple-600 mr-4" size={16} strokeWidth={4} />
          <strong>$1M in funding</strong>
        </div>
        <div className="flex flex-row place-items-center md:px-4">
          <Hexagon className="text-purple-600 mr-4" size={16} strokeWidth={4} />
          <strong>Up to $100K per team</strong>
        </div>
        <div className="flex flex-row place-items-center md:px-4">
          <Hexagon className="text-purple-600 mr-4" size={16} strokeWidth={4} />
          <strong>Ongoing OLAS Dev Rewards</strong>
        </div>
      </div>
      <Button variant="default" size="xl" asChild>
        <Link
          href={ACCELERATOR_APPLY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-16"
        >
          Apply now - limited spots!
        </Link>
      </Button>
    </div>
  </SectionWrapper>
);
