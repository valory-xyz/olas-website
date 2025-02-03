import { SUB_HEADER_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';
import { Hexagon } from 'lucide-react';
import Link from 'next/link';

export const CTA = () => (
  <SectionWrapper backgroundType="SUBTLE_GRADIENT">
    <div className="text-center">
      <h1 className={`${SUB_HEADER_CLASS} font-semibold mb-12`}>
        Ready to Build the Next Big AI Agent?
      </h1>
      <div className="flex flex-row divide-x w-fit mx-auto">
        <div className="flex flex-row place-items-center px-4">
          <Hexagon className="text-purple-600 mr-4" size={16} strokeWidth={4} />
          <strong>$1M in funding</strong>
        </div>
        <div className="flex flex-row place-items-center px-4">
          <Hexagon className="text-purple-600 mr-4" size={16} strokeWidth={4} />
          <strong>Up to $100K per team</strong>
        </div>
        <div className="flex flex-row place-items-center px-4">
          <Hexagon className="text-purple-600 mr-4" size={16} strokeWidth={4} />
          <strong>Ongoing OLAS Dev Rewards</strong>
        </div>
      </div>
      <Button variant="default" size="xl" asChild>
        <Link
          href="https://docs.google.com/forms/d/1nXIHsfudZzOv7oUGcJ2nvSbgVwziR2g9Mvfhik9t1IA/edit"
          className="mt-16"
        >
          Apply now - limited spots!
        </Link>
      </Button>
    </div>
  </SectionWrapper>
);
