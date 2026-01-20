import { SECTION_BOX_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import SectionHeading from 'components/SectionHeading';
import { Button } from 'components/ui/button';
import { Card } from 'components/ui/card';
import agents from 'data/agents.json';
import Image from 'next/image';
import Link from 'next/link';

const servicePath = (service) => service.path || `/agents/${service.slug}`;

export const DeprecatedUseCases = () => {
  const deprecatedItems = agents.filter((item) => item.deprecated === true);

  return (
    <SectionWrapper backgroundType="NONE" customClasses={`${SECTION_BOX_CLASS} bg-slate-100`}>
      <div className="max-w-4xl mx-auto flex flex-col">
        <div className="text-center mb-14">
          <h1 className="text-3xl lg:text-[40px] mb-6 text-gray-700 font-semibold">
            Deprecated Use Cases
          </h1>
        </div>
        <div className="grid md:grid-cols-2 gap-4 mb-20">
          {deprecatedItems.map((item) => (
            <Link key={item.id} href={servicePath(item)}>
              <Card className="activity-card-opaque h-full flex flex-row hover:bg-white duration-150 hover:cursor-pointer gap-4 p-4">
                <Image
                  src={`/images/agents/${item.iconFilename}`}
                  alt={`${item.name} icon`}
                  width={80}
                  height={80}
                  className="mb-auto"
                />
                <div className="flex flex-col">
                  <p className="text-lg font-semibold">{item.name}</p>
                  <p className="text-slate-600">{item.shortDescription}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
        <div className="flex max-sm:flex-col gap-4 w-fit mx-auto">
          <Button variant="default" size="lg" className="max-sm:w-full w-fit mx-auto" asChild>
            <Link href="/agents">Explore Agents</Link>
          </Button>
          <Button variant="outline" size="lg" className="max-sm:w-full w-fit mx-auto" asChild>
            <Link href="/agent-economies">Explore Agent Economies</Link>
          </Button>
        </div>
      </div>
    </SectionWrapper>
  );
};
