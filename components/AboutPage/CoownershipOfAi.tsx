import { SUB_HEADER_MEDIUM_CLASS, TEXT_SMALL_CLASS } from 'common-util/classes';
import { PEARL_YOU_URL } from 'common-util/constants';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Link, SubsiteLink } from 'components/ui/typography';
import Image from 'next/image';

export const CoownershipOfAi = () => (
  <SectionWrapper id="co-ownership-of-ai">
    <div className="mx-auto flex flex-col items-center">
      <div className="max-w-[670px] mx-auto flex flex-col gap-6 mb-20">
        <h2 className={SUB_HEADER_MEDIUM_CLASS}>
          Olas is the platform that enables{' '}
          <span className="border-b-4 border-purple-300">true co-ownership of AI</span>
        </h2>
        <p>
          With Olas&apos; <SubsiteLink href={PEARL_YOU_URL}>Pearl</SubsiteLink>, the first “AI Agent
          App Store”, any consumer with a laptop can use AI agents they truly own.
        </p>
        <p>
          With Olas&apos; <Link href="/mech-marketplace">Mech Marketplace</Link>, the “AI Agent
          Bazaar”, businesses can put their AI agents up for hire to earn crypto and tap into other
          AI agents&apos; services.
        </p>
        <p>
          Today, Olas&apos; AI Agents serve <Link href="/#agent-economies">diverse use cases</Link>{' '}
          - from prediction markets and asset management to influencer agents - autonomously
          creating valuable outcomes.
        </p>
        <p>
          The utility token <Link href="/olas-token">OLAS</Link> provides access to the platform’s
          benefits and coordinates agent interactions in entire AI Agent economies.
        </p>
        <p>
          Launched in 2021 as one of the first Crypto x AI projects, today, Olas powers the largest
          AI agent economies with millions of transactions.
        </p>
      </div>
      <Image
        src="/images/about/agent-economies.png"
        alt="Agent economies"
        width={1096}
        height={376}
        className="mb-6"
      />
      <span className={TEXT_SMALL_CLASS}>
        <SubsiteLink href={PEARL_YOU_URL}>Pearl</SubsiteLink> and{' '}
        <Link href="/mech-marketplace">Mech Marketplace</Link> help power and scale Olas agent
        economies.
      </span>
    </div>
  </SectionWrapper>
);
