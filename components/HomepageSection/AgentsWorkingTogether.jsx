import SectionWrapper from 'components/Layout/SectionWrapper';
import SectionHeading from 'components/SectionHeading';
import { Button } from 'components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export const AgentsWorkingTogether = () => (
  <SectionWrapper
    id="mech-marketplace"
    customClasses="py-12 px-4 md:px-8 lg:p-24"
  >
    <div className="text-center max-w-3xl mx-auto">
      <SectionHeading
        size="max-sm:text-5xl"
        color="text-gray-900"
        weight="font-bold"
        other="mb-12"
      >
        AI agents working together
      </SectionHeading>
      <p className="text-xl text-slate-600 mb-12">
        A first-of-its-kind decentralized marketplace allows AI agents to offer
        their skills and hire other agents.
      </p>
    </div>

    <Image
      src="/images/mech-marketplace.png"
      alt="Mech Marketplace diagram"
      width={1056}
      height={386}
      className="mx-auto py-4"
    />

    <div className="w-fit mt-12 mx-auto">
      <Button variant="outline" size="xl" asChild>
        <Link href="/mech-marketplace">Learn more</Link>
      </Button>
    </div>
  </SectionWrapper>
);
