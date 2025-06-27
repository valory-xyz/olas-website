import { SECTION_BOX_CLASS } from 'common-util/classes';
import { REGISTRY_URL } from 'common-util/constants';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { ExternalLink } from 'components/ui/typography';
import Link from 'next/link';

export const OlasAgents = () => (
  <SectionWrapper customClasses={`max-w-[648px] mx-auto ${SECTION_BOX_CLASS}`}>
    <h1 className="text-4xl text-center md:text-[40px] text-gray-700 mb-12 font-bold font-black">
      Olas Agents
    </h1>

    <div className="flex flex-col gap-20 text-lg">
      <div className="gap-8 flex flex-col">
        <h4 className="text-2xl font-semibold">What is an AI Agent?</h4>
        <p>
          An AI agent is a software system that perceives its environment, makes
          decisions, and takes actions autonomously — without continuous human
          input — to achieve specific goals.
        </p>
      </div>
      <div className="flex flex-col gap-8">
        <h4 className="text-2xl font-semibold">
          What Makes Olas&apos; AI Agents Unique?
        </h4>
        <p>
          Olas agents are autonomous AI agents that satisfy these additional
          characteristics:
        </p>
        <ol className="ml-6 list-decimal">
          <li className="font-medium mb-3">
            <p className="mb-3">
              They self-custody resources via a financial account. Olas agents
              use account abstraction (via{' '}
              <ExternalLink href="https://app.safe.global/welcome">
                Safe
              </ExternalLink>
              ):
            </p>
            <ul className="ml-6 list-disc font-normal text-base mb-3">
              <li className="mb-3">
                Enables to autonomously pay for services and receive payments
                on-chain.
              </li>
              <li>
                Developers and users can set budget limits and guardrails.
              </li>
            </ul>
          </li>
          <li className="font-medium mb-3">
            <p className="mb-3">
              They are listed on a global agent directory called{' '}
              <ExternalLink href={REGISTRY_URL}>Olas Registry</ExternalLink>:
            </p>
            <ul className="ml-6 list-disc font-normal text-base mb-3">
              <li className="mb-3">Enables agents to list their services.</li>
              <li>
                Enables agents to be discovered on{' '}
                <Link href="/mech-marketplace" className="text-purple-700">
                  Mech Marketplace
                </Link>
                , the AI Agent Bazaar.
              </li>
            </ul>
          </li>
          <li className="font-medium mb-3">
            <p className="mb-3">
              They optionally earn rewards via{' '}
              <ExternalLink href="https://staking.olas.network/">
                Olas Staking
              </ExternalLink>
              :
            </p>
            <ul className="ml-6 list-disc font-normal text-base mb-3">
              <li>
                Proof of Active Agent, offers a mechanism to reward use-case
                specific useful on-chain agent activity.
              </li>
            </ul>
          </li>
          <li className="font-medium mb-3">
            <p className="mb-3">
              They optionally are made accessible to end-users via{' '}
              <Link href="/pearl" className="text-purple-700">
                Pearl
              </Link>
              , the AI Agent App Store.
            </p>
          </li>
        </ol>
      </div>
      <div className="gap-8 flex flex-col">
        <h4 className="text-2xl font-semibold">
          Is There a Specific Stack for Olas Agents?
        </h4>
        <p>
          Any agent that satisfies the above characteristics is an Olas agent.
          Developers can choose their preferred AI agent stack to implement
          their agent.
        </p>
        <p>
          Olas offers the{' '}
          <ExternalLink href="https://docs.olas.network/">
            Olas Stack
          </ExternalLink>{' '}
          which allows developers to build agents easily.
        </p>
      </div>
      <div className="gap-8 flex flex-col">
        <h4 className="text-2xl font-semibold">
          What Agent Types Does the Olas Stack Support?
        </h4>
        <div>
          <p className="font-medium">Sovereign agents</p>
          <p>
            Run by a single operator on a machine they control. Simple to deploy
            and self-custodied by the user.
          </p>
        </div>
        <div>
          <p className="font-medium">Decentralized agents</p>
          <p>
            Run by multiple operators and kept in sync through shared state and
            consensus. Suitable for use-cases where the agent should not be
            controlled by a single party.
          </p>
        </div>
      </div>
    </div>
  </SectionWrapper>
);
