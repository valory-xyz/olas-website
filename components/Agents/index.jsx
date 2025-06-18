import { SECTION_BOX_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import SectionHeading from 'components/SectionHeading';
import { Button } from 'components/ui/button';
import { Card } from 'components/ui/card';
import useCases from 'data/useCases.json';
import Image from 'next/image';
import Link from 'next/link';

export const Agents = () => {
  const sovereignAgents = useCases.find(
    (item) => item.title === 'Sovereign Agents',
  );
  const decentralizedAgents = useCases.find(
    (item) => item.title === 'Decentralized Agents',
  );

  return (
    <SectionWrapper
      backgroundType="NONE"
      customClasses={`${SECTION_BOX_CLASS} bg-slate-100`}
    >
      <div className="max-w-4xl mx-auto flex flex-col">
        <div className="text-center mb-14">
          <SectionHeading spacing="mb-6">Sovereign AI Agents</SectionHeading>
          <p className="text-lg text-slate-600">
            Lightweight agents that anybody can run locally or in the cloud.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-4 mb-[120px]">
          {sovereignAgents.services.map((agent) => (
            <Link key={agent.title} href={agent.link}>
              <Card className="activity-card-opaque flex flex-row hover:bg-white duration-150 hover:cursor-pointer gap-4 p-4">
                <Image
                  src={agent.image}
                  alt={agent.title}
                  width={80}
                  height={80}
                />
                <div className="flex flex-col">
                  <p className="text-lg font-semibold">{agent.title}</p>
                  <p className="text-slate-600">{agent.description}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mb-14">
          <SectionHeading spacing="mb-6">
            Decentralized AI Agents
          </SectionHeading>
          <p className="text-lg text-slate-600">
            Highly transparent and robust through consensus, run by multiple
            separate operators.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-4 mb-20">
          {decentralizedAgents.services.map((agent) => (
            <Link key={agent.title} href={agent.link}>
              <Card className="activity-card-opaque flex flex-row hover:bg-white duration-150 hover:cursor-pointer gap-4 p-4">
                <Image
                  src={agent.image}
                  alt={agent.title}
                  width={80}
                  height={80}
                />
                <div className="flex flex-col">
                  <p className="text-lg font-semibold">{agent.title}</p>
                  <p className="text-slate-600">{agent.description}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
        <Button variant="default" size="lg" className="w-fit mx-auto" asChild>
          <Link href="/agent-economies">Explore Agent Economies</Link>
        </Button>
      </div>
    </SectionWrapper>
  );
};
