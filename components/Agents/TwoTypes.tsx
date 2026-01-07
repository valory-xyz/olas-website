import { Cross2Icon } from '@radix-ui/react-icons';
import { SUB_HEADER_MEDIUM_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import SectionHeading from 'components/SectionHeading';
import { Card } from 'components/ui/card';
import Image from 'next/image';
import { useState } from 'react';

const types = [
  {
    title: 'Sovereign Agents',
    key: 'sovereign',
    imageUrl: '/images/agents/sovereign-agents.png',
    description:
      'Run by a single operator on a machine they control. Simple to deploy and self-custodied by the user.',
  },
  {
    title: 'Decentralized Agents',
    key: 'decentralized',
    imageUrl: '/images/agents/decentralized-agents.png',
    description: (
      <div>
        <p className="mb-3">
          Run by multiple operators and kept in sync through shared state and
          consensus.
        </p>
        <p>
          Suitable for use-cases where the agent should not be controlled by a
          single party.
        </p>
      </div>
    ),
  },
];

export const TwoTypes = () => {
  const [openModalKey, setOpenModalKey] = useState(null);

  return (
    <SectionWrapper>
      <SectionHeading other="text-center">
        Two Types of Olas Agents
      </SectionHeading>
      <div className="flex flex-col md:flex-row max-lg:gap-10 justify-between max-w-4xl mx-auto">
        {types.map((item) => (
          <div
            key={item.key}
            className="flex flex-col gap-10 w-full md:max-w-[320px] lg:max-w-[396px] mx-auto"
          >
            <h4 className={`text-center ${SUB_HEADER_MEDIUM_CLASS}`}>
              {item.title}
            </h4>
            <Image
              src={item.imageUrl}
              alt={item.title}
              width={396}
              height={200}
            />
            <div>{item.description}</div>

            <a
              className="text-purple-600 cursor-pointer"
              onClick={() => setOpenModalKey(item.key)}
            >
              How it works?
            </a>
          </div>
        ))}
      </div>

      {openModalKey && (
        <>
          <div
            className="fixed w-full h-full z-50 left-0 top-0 bg-black opacity-40"
            onClick={() => setOpenModalKey(null)}
          ></div>
          {/* @ts-expect-error TS(2322) FIXME: Type '{ children: Element[]; className: string; }'... Remove this comment to see the full error message */}
          <Card className="fixed z-50 max-h-[600px] overflow-y-auto m-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mx-auto w-[320px] sm:w-[600px] md:max-w-screen-md bg-white">
            <button
              className="absolute top-4 right-4 cursor-pointer z-10"
              onClick={() => setOpenModalKey(null)}
            >
              <Cross2Icon />
            </button>

            <div className="overflow-auto h-full p-4">
              {openModalKey === 'sovereign' && (
                <>
                  <h2 className={`${SUB_HEADER_MEDIUM_CLASS} mb-3`}>
                    How Sovereign Agents Work
                  </h2>
                  <p className="mb-3">
                    Sovereign agents are lightweight, easy-to-run agents managed
                    by a single individual or entity. They can operate on a
                    personal computer or in the cloud, offering flexibility in
                    deployment.
                  </p>
                  <p className="mb-3">
                    The main advantages of Sovereign agents include low
                    operating cost and simplicity, making them ideal for
                    personal tasks or smaller-scale operations without the need
                    for extensive coordination. In Olas&apos; technical
                    language, sovereign agents are referred to as
                    &quot;autonomous services with a single agent
                    instance&quot;.
                  </p>
                  <p>
                    Sovereign agents can be built with Olas&apos; own or
                    third-party agent frameworks.
                  </p>
                </>
              )}
              {openModalKey === 'decentralized' && (
                <>
                  <h2 className={`${SUB_HEADER_MEDIUM_CLASS} mb-3`}>
                    How Decentralized Agents Work
                  </h2>

                  <Image
                    src="/images/agents/decentralized.png"
                    alt="Decentralized agents"
                    width={640}
                    height={382}
                    className="mb-12"
                  />

                  <p className="mb-3">
                    Decentralized agents are made up of multiple agent
                    instances, each run by different operators. This setup
                    ensures high transparency and robustness due to their
                    open-source code and a consensus mechanism that keeps all
                    agent instances in sync.
                  </p>
                  <p className="mb-3">
                    These agent instances and their operator are well-suited for
                    managing high-value processes and assets, such as governance
                    in DAOs or delivering AI inference on-chain, because they
                    minimize reliance on any single operator.
                  </p>
                  <p className="mb-3">
                    In Olas&apos; technical language, decentralized agents are
                    referred to as &quot;autonomous services with multiple agent
                    instances&quot;.
                  </p>
                  <p>
                    Only Olas&apos; own agent framework enables Builders to
                    create decentralized agents.
                  </p>
                </>
              )}
            </div>
          </Card>
        </>
      )}
    </SectionWrapper>
  );
};
