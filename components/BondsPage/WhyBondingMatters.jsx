import { SCREEN_WIDTH_LG, SECTION_BOX_CLASS, SUB_HEADER_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import Image from 'next/image';

export const WhyBondingMatters = () => (
  <SectionWrapper
    customClasses={`${SECTION_BOX_CLASS}`}
    backgroundType="NONE"
    customStyle={{
      background: 'linear-gradient(180deg, #F8F9FC 0%, #E7EAF4 100%)',
    }}
  >
    <div className={`${SCREEN_WIDTH_LG} px-0lg:px-12`}>
      <h2 className={`${SUB_HEADER_CLASS} mb-6`}>
        Why bonding matters to Olas
      </h2>

      <p>
        Bonding provides crucial capital, called protocol-owned liquidity, that
        helps sustain the Olas protocol. This capital generates returns, which
        can eventually reduce or replace the need for new OLAS emissions,
        benefiting both builders and bonders
      </p>
    </div>

    <div className="max-w-screen-lg mx-auto">
      <Image
        src="/images/bonds-page/network-role.svg"
        alt="Network Role"
        width={1200}
        height={300}
        className="mt-12 w-full"
      />
    </div>
  </SectionWrapper>
);
