import { SECTION_BOX_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import SectionHeading from 'components/SectionHeading';
import { Button } from 'components/ui/button';
import { Card } from 'components/ui/card';
import useCases from 'data/useCases.json';
import Image from 'next/image';
import Link from 'next/link';

export const AvailableAgents = () => {
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
      id="agents"
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
              // @ts-expect-error TS(2304) FIXME: Cannot find name 'children'.
              // @ts-expect-error TS(2322): Type '{ children: Element[]; className: string; }'... Remove this comment to see the full error message
              // @ts-expect-error TS(2322) FIXME: Type '{ children: Element[]; className: string; }'... Remove this comment to see the full error message
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
              // @ts-expect-error TS(2304) FIXME: Cannot find name 'children'.
              // @ts-expect-error TS(2322): Type '{ children: Element[]; className: string; }'... Remove this comment to see the full error message
              // @ts-expect-error TS(2322) FIXME: Type '{ children: Element[]; className: string; }'... Remove this comment to see the full error message
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
        <div className="max-sm:flex-col flex gap-4 w-fit mx-auto">
          // @ts-expect-error TS(2304) FIXME: Cannot find name 'children'.
          // @ts-expect-error TS(2322): Type '{ children: Element; variant: string; size: ... Remove this comment to see the full error message
          // @ts-expect-error TS(2322) FIXME: Type '{ children: Element; variant: "default"; siz... Remove this comment to see the full error message
          <Button
            variant="default"
            size="lg"
            className="max-sm:w-full w-fit mx-auto"
            asChild
          >
            <Link href="/agent-economies">Explore Agent Economies</Link>
          </Button>
          // @ts-expect-error TS(2304) FIXME: Cannot find name 'children'.
          // @ts-expect-error TS(2322): Type '{ children: Element; variant: string; size: ... Remove this comment to see the full error message
          // @ts-expect-error TS(2322) FIXME: Type '{ children: Element; variant: "outline"; siz... Remove this comment to see the full error message
          <Button
            variant="outline"
            size="lg"
            className="max-sm:w-full w-fit mx-auto"
            asChild
          >
            <Link href="/deprecated-usecases">
              Explore Deprecated Use Cases
            </Link>
          </Button>
        </div>
      </div>
    </SectionWrapper>
  );
};
