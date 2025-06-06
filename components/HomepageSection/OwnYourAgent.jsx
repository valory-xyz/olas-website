import SectionWrapper from 'components/Layout/SectionWrapper';
import SectionHeading from 'components/SectionHeading';
import { Button } from 'components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export const OwnYourAgent = () => (
  <SectionWrapper
    id="pearl"
    customClasses="py-12 px-4 md:px-8 lg:p-24 bg-gradient-to-t from-slate-200 to-slate-50 border-y-1.5"
  >
    <div className="text-center max-w-[900px] mx-auto">
      <SectionHeading
        size="max-sm:text-5xl"
        color="text-gray-900"
        weight="font-bold"
        other="mb-12"
      >
        Own Your Agent With Pearl:
        <br /> The &quot;Agent App-Store&quot;
      </SectionHeading>
      <p className="text-xl text-slate-600 mb-12">
        Pearl is the ultimate collection of AI agents. Choose from a variety of
        AI agents to benefit from their capabilities while earning potential
        rewards from OLAS staking.
      </p>
    </div>

    <Image
      src="/images/homepage/own-your-agent.png"
      alt="Pearl Diagram"
      width={860}
      height={422}
      className="mx-auto py-4"
    />

    <div className="w-fit mt-12 mx-auto">
      <Button variant="default" size="xl" asChild>
        <Link href="/pearl">Own Your Agent</Link>
      </Button>
    </div>
  </SectionWrapper>
);
