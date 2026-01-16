import SectionWrapper from 'components/Layout/SectionWrapper';
import SectionHeading from 'components/SectionHeading';
import { Card } from 'components/ui/card';
import { Link } from 'components/ui/typography';
import Image from 'next/image';

const incentives = [
  {
    title: 'Builder Rewards',
    imgSrc: `builders.png`,
    description:
      'Incentivize Builders (aka developers) proportionally to their code contributions. The protocol as a result receives valuable code and agents.',
    link: '/build',
    linkText: 'Explore Builder role',
  },
  {
    title: 'Bonding Emissions',
    imgSrc: `bonders.png`,
    description:
      'Incentivize Bonders to permanently provide liquidity (LP tokens on whitelisted exchanges) to the protocol in exchange for OLAS. The protocol as a result acquires protocol-owned liquidity.',
    link: '/bond',
    linkText: 'Explore Bonder role',
  },
  {
    title: 'Staking Emissions',
    imgSrc: `stakers.png`,
    description: (
      <>
        Incentivize Operators to run AI agents in dedicated agent economies as defined by Launchers.
        Agents are coordinated and rewarded for their active contributions to specific use cases,
        usually mediated by the <Link href="/mech-marketplace">Marketplace</Link>. The protocol
        benefits through the Marketplace which can collect fees as a percentage of turnover.
      </>
    ),
    link: '/staking',
    linkText: 'How staking works',
    secondaryLink: '/operate',
    secondaryLinkText: 'Explore Operator role',
  },
];

export const OlasProtocol = () => (
  <SectionWrapper id="protocol">
    <div className="flex flex-col max-w-[648px] mx-auto gap-20 text-lg">
      <div>
        <SectionHeading
          size="max-sm:text-5xl"
          color="text-gray-900"
          weight="font-semibold"
          other="mb-8 text-center"
        >
          Olas Protocol
        </SectionHeading>
        <p className="text-xl text-center text-[#4D596A]">
          The Olas Protocol has a number of core mechanisms that coordinate the humans and AI agents
          using it.
        </p>
      </div>

      <p>
        The Olas Protocol provides a framework for coordinating and managing{' '}
        <Link href="/agent-economies">AI agent economies</Link>.
      </p>

      <div>
        <Image
          src="/images/olas-token-page/olas-protocol.png"
          alt="Olas Protocol"
          width={648}
          height={420}
          className="mb-8"
        />

        <p className="mb-3">
          The protocol is centered around a number of on-chain registries that track AI agents and
          the open-source code they are composed of:
        </p>
        <ul className="list-disc ml-6">
          <li className="mb-3">
            <strong>Software Registries (Component & Agent Blueprint Registry)</strong> <br />
            Register agent software and the software components they are made up from as ERC-721
            NFTs.
          </li>
          <li>
            <strong>AI Agent Registry</strong>
            <br />
            Maintain and secure sovereign and decentralized <Link href="/agents">
              AI agents
            </Link>{' '}
            registered as ERC-721 NFTs, and coordinate their operators.
          </li>
        </ul>
      </div>

      <div className="flex flex-col gap-4">
        <p>The protocol provides a number of core incentive mechanisms:</p>
        <div className="grid md:grid-cols-2 gap-4">
          {incentives.map((item, index) => (
            <Card
              key={item.title}
              className={`p-6 ${incentives.length % 2 !== 0 && index === incentives.length - 1 ? 'md:col-span-2' : ''}`}
            >
              <Image
                src={`/images/olas-token-page/${item.imgSrc}`}
                alt={item.title}
                width={181}
                height={48}
                className="mb-6"
              />
              <p className="text-lg font-medium mb-3">{item.title}</p>
              <p className="mb-4 text-[#4D596A]">{item.description}</p>
              <div className="flex max-md:flex-col gap-2">
                <Link href={item.link}>{item.linkText}</Link>
                {item.secondaryLink && (
                  <span>
                    {' '}
                    · <Link href={item.secondaryLink}>{item.secondaryLinkText}</Link>
                  </span>
                )}
              </div>
            </Card>
          ))}
        </div>
        <p>
          Collectively, these three mechanisms support the growth of a decentralised ecosystem of AI
          agents.
        </p>
      </div>

      <div>
        <Image
          src="/images/olas-token-page/governance-mechanism.png"
          alt="Protocol diagram"
          width={648}
          height={173}
          className="mb-10"
        />
        <p className="mb-3">
          Finally, to coordinate all mechanisms, the protocol is governed via a set of governance
          mechanisms. <Link href="/govern">Governors</Link> are those holders of OLAS that lock
          their OLAS in a vote-escrow version of OLAS, called veOLAS.
        </p>
        <p className="mb-3">
          Olas Protocol is currently deployed on multiple blockchains, with plans for further
          expansions.
        </p>
      </div>
    </div>
  </SectionWrapper>
);
