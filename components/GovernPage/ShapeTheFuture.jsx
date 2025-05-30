import {
  SCREEN_WIDTH_LG,
  SECTION_BOX_CLASS,
  SUB_HEADER_CLASS,
} from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';

export const ShapeTheFuture = () => (
  <SectionWrapper
    customClasses={`${SECTION_BOX_CLASS} lg:pb-12`}
    id="about-govern"
  >
    <div className={`${SCREEN_WIDTH_LG} gap-5`}>
      <h2 className={`${SUB_HEADER_CLASS} mb-2`}>
        Shape the future through active governance
      </h2>

      <p>
        With Olas Govern, engage directly in the decentralized decision-making
        process of the Olas ecosystem. As an Olas Governor, you can vote on how
        OLAS emissions are distributed among staking contracts, directly
        affecting the success of agent-driven economies. Beyond emissions, Olas
        Govern also connects you to platforms like{' '}
        <a
          href="https://snapshot.org/#/autonolas.eth"
          target="_blank"
          rel="noreferrer"
          className="text-purple-600"
        >
          Snapshot ↗
        </a>{' '}
        and{' '}
        <a
          href="https://boardroom.io/autonolas/"
          target="_blank"
          rel="noreferrer"
          className="text-purple-600"
        >
          Boardroom ↗
        </a>{' '}
        to engage with broader governance proposals.
      </p>
    </div>
  </SectionWrapper>
);
