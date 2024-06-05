import { SCREEN_WIDTH_LG, TEXT_LARGE_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import Image from 'next/image';

export const DecentralizedAgents = () => (
  <SectionWrapper customClasses="lg:p-24 px-4 py-12 border-y" id="rewards">
    <div className={`${SCREEN_WIDTH_LG} gap-5 justify-center`}>
      <Image
        className="mb-8"
        alt="OLAS Utility"
        src="/images/learn/decentralized-agents.png"
        width="200"
        height="265"
      />
      <p className={`${TEXT_LARGE_CLASS} font-bold`}>Decentralized Agents</p>

      <p>
        Sovereign Agents are lightweight, easy-to-run agents managed by a single
        individual or entity. They can operate on a personal computer or in the
        cloud, offering flexibility in deployment.
      </p>

      <p>
        The main advantages of Sovereign Agents include low cost and simplicity,
        making them ideal for personal tasks or smaller-scale operations without
        the need for extensive coordination.
      </p>
    </div>
  </SectionWrapper>
);
