import SectionWrapper from 'components/Layout/SectionWrapper';
import SectionHeading from 'components/SectionHeading';
import { Link } from 'components/ui/typography';

const incentives = [
  {
    title: 'Builder rewards',
    description:
      'Builder rewards: incentivize Builders (aka developers) proportionally to their code contributions. The protocol as a result receives valuable code and agents;',
  },
  {
    title: 'Bonding emissions',
    description:
      'Bonding emissions: incentivize Bonders to permanently provide liquidity (LP tokens on whitelisted exchanges) to the protocol in exchange for OLAS. The protocol as a result acquires protocol-owned liquidity;',
  },
  {
    title: 'Staking emissions',
    description: (
      <>
        <Link href="staking">Staking emissions</Link>: incentivize Operators to
        run AI agents in dedicated agent economies as defined by Launchers.
        Agents are coordinated and rewarded for their active contributions to
        specific use cases, usually mediated by the Marketplace. The protocol
        benefits through the <Link href="/mech-marketplace">Marketplace</Link>{' '}
        which can collect fees as a percentage of turnover.
      </>
    ),
  },
];

export const OlasProtocol = () => (
  <SectionWrapper id="protocol">
    <div className="flex flex-col max-w-[872px] mx-auto">
      <SectionHeading
        size="max-sm:text-5xl"
        color="text-gray-900"
        weight="font-bold"
        other="mb-12 text-center"
      >
        Olas Protocol
      </SectionHeading>
      <p className="text-xl text-center text-[#4D596A] mb-12">
        The Olas Protocol has a number of core mechanisms that coordinate the
        humans and AI agents using it.
      </p>

      <p className="mb-6">
        The Olas Protocol provides a framework for coordinating and managing{' '}
        <Link href="/agent-economies">AI agent economies</Link>. Each part of
        the protocol is designed to ensure scalability and security.
      </p>

      <p className="mb-3">
        The protocol is centered around a number of on-chain registries that
        track AI agents and the open-source code they are composed of:
      </p>
      <ul className="list-disc ml-6">
        <li className="mb-2">
          Software Registries (Component & Agent Blueprint Registry): Register
          agent systems and the components they are composed from as NFTs.
        </li>
        <li className="mb-2">
          AI Agent Registry: Maintain and secure sovereign and decentralized AI
          agent systems, and coordinate their operators.
        </li>
      </ul>

      <p className="mb-3">
        The protocol provides a number of core incentive mechanisms:
      </p>
      <ul className="list-disc ml-6 mb-6">
        {incentives.map((incentive) => (
          <li key={incentive.title} className="mb-2">
            {incentive.description}
          </li>
        ))}
      </ul>

      <p className="mb-3">
        Collectively, these three mechanisms support the growth of a
        decentralised ecosystem of AI agents.
      </p>
      <p className="mb-3">
        Finally, to coordinate all mechanisms, the protocol is governed via a
        set of governance mechanisms. Governors are those holders of OLAS that
        lock their OLAS in a vote-escrow version of OLAS, called veOLAS.
      </p>
      <p className="mb-3">
        Olas Protocol is currently deployed on multiple blockchains, with plans
        for further expansions.
      </p>
    </div>
  </SectionWrapper>
);
