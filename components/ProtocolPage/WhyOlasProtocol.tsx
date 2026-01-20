import { SCREEN_WIDTH_LG, SUB_HEADER_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';

export const WhyOlasProtocol = () => (
  <SectionWrapper
    customClasses="lg:p-24 px-4 py-12"
    id="why-olas-protocol"
    backgroundType="SUBTLE_GRADIENT"
  >
    <div className={`${SCREEN_WIDTH_LG} gap-5`}>
      <h2 className={`${SUB_HEADER_CLASS} mb-2`}>Why Olas Protocol?</h2>

      <p>
        Open-source developers often struggle with fair remuneration. Olas Protocol addresses this
        by minting software packages as NFTs, enabling their composition into agents and services.
        This model ensures developers are rewarded for their contributions, fostering a sustainable,
        decentralised ecosystem.
      </p>
    </div>
  </SectionWrapper>
);
