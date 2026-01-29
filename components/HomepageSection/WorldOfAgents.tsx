import SectionWrapper from 'components/Layout/SectionWrapper';
import SectionHeading from 'components/SectionHeading';
import { Button } from 'components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

const list = [
  'optimus.png',
  'modius.png',
  'agentsfun.png',
  'governatooorr.png',
  'predict.png',
  'pettbro.png',
  'contribute.png',
  'more-agents.png',
];

const AutoScrollCarousel = () => {
  const duplicatedList = [...list, ...list];

  return (
    <div className="relative w-full overflow-hidden max-w-[1440px] mx-auto">
      <div className="flex animate-scroll">
        {duplicatedList.map((image, index) => (
          <div key={index} className="flex-shrink-0 w-[224px] h-[224px] mx-2">
            <Image
              src={`/images/homepage/${image}`}
              alt={`Agent ${index + 1}`}
              width={224}
              height={224}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export const WorldOfAgents = () => {
  return (
    <SectionWrapper id="explore" customClasses="py-12 lg:py-24">
      <div className="flex flex-col items-center justify-center w-full gap-8">
        <SectionHeading
          color="text-gray-900"
          weight="font-bold"
          other="mb-6 z-10 text-center max-sm:mx-4"
        >
          An Entire World of AI Agents — One Token
        </SectionHeading>

        <p className="text-xl text-slate-600 mb-14 max-sm:text-center max-sm:mx-4 z-10">
          Access your autonomous AI agents for diverse use cases with OLAS.
        </p>
        <AutoScrollCarousel />
      </div>

      <div className="w-fit mt-14 mx-auto">
        <Button variant="outline" size="xl" asChild>
          <Link href="/agents">Explore Agents</Link>
        </Button>
      </div>
    </SectionWrapper>
  );
};
