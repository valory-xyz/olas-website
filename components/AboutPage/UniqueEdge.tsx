import { SUB_HEADER_MEDIUM_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Tag } from 'components/ui/tag';
import Image from 'next/image';

export const UniqueEdge = () => (
  <SectionWrapper id="unique-edge">
    <div className="max-w-[1096px] mx-auto">
      <div className="gap-6 flex flex-col items-center lg:flex-row lg:items-start justify-between">
        <div className="md:max-w-[536px] flex flex-col gap-6">
          <Tag variant="primary" className="w-max">
            Unique Edge
          </Tag>
          <h2 className={SUB_HEADER_MEDIUM_CLASS}>
            Olas allows users to own their AI agents rather than renting them — by aligning
            incentives between users and businesses through a unique token model
          </h2>
          <p>
            Users run AI agents via Pearl, the Agent App Store, and benefit directly from their use.
          </p>
          <p>
            Businesses list their AI agents on Mech Marketplace, earning when their agents help
            user-owned AI agents achieve goals.
          </p>
          <p>
            As more users adopt agents via Pearl, demand for services on the Mech Marketplace grows
            — incentivizing businesses to create better, more useful agents.
          </p>
          <p>
            This drives a healthy flywheel between Pearl and Mech Marketplace adoption. Both users
            and businesses require the utility token OLAS to access the products and benefit from
            this flywheel. That&apos;s how Olas helps create sustainable, user-owned AI at scale.
          </p>
        </div>
        <Image
          src="/images/about/unique-edge.png"
          alt="Unique Edge"
          width={500}
          height={273}
          className="mb-6"
        />
      </div>
    </div>
  </SectionWrapper>
);
