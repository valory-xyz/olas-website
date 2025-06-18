import { SECTION_BOX_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import SectionHeading from 'components/SectionHeading';
import { Button } from 'components/ui/button';
import { Card } from 'components/ui/card';
import useCases from 'data/useCases.json';
import Image from 'next/image';
import Link from 'next/link';

export const AgentEconomies = () => {
  const agentEconomies = useCases.find(
    (item) => item.title === 'Agent Economies',
  );

  return (
    <SectionWrapper
      backgroundType="NONE"
      customClasses={`${SECTION_BOX_CLASS} bg-slate-100`}
    >
      <div className="max-w-4xl mx-auto flex flex-col">
        <div className="text-center mb-14">
          <SectionHeading spacing="mb-6">
            The First Active AI Agent Economies
          </SectionHeading>
          <p className="text-lg text-slate-600">
            Many specialized agents interacting autonomously towards a
            predefined goal.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 mb-20">
          {agentEconomies.services.map((item) => (
            <Link key={item.title} href={item.link} className="w-full h-full">
              <Card
                className="agent-economy-card p-10 flex flex-col gap-y-8 place-items-center text-center hover:bg-white duration-150 w-full h-full"
                style={{ '--gradient-color': item.gradientColor }}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  width={64}
                  height={64}
                />
                <div className="flex flex-col">
                  <h5 className="font-semibold text-xl mb-2">{item.title}</h5>
                  <p className="text-slate-600">{item.description}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
        <Button variant="default" size="lg" className="w-fit mx-auto" asChild>
          <Link href="/agents">Explore Agents</Link>
        </Button>
      </div>
    </SectionWrapper>
  );
};
