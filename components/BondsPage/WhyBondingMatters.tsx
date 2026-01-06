import { SECTION_BOX_CLASS, SUB_HEADER_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import Image from 'next/image';

export const WhyBondingMatters = () => (
  <SectionWrapper
    id="why-bonding-matters-to-olas"
    customClasses={`${SECTION_BOX_CLASS}`}
    backgroundType="NONE"
    customStyle={{
      background: 'linear-gradient(180deg, #F8F9FC 0%, #E7EAF4 100%)',
    }}
  >
    <div className="mx-auto flex flex-col max-w-[648px] px-0lg:px-12">
      <h2 className={`${SUB_HEADER_CLASS} mb-12`}>
        Why Bonding Matters to Olas
      </h2>

      <Image
        src="/images/bonds-page/bonding-matters.png"
        alt="Why bonding matters"
        height={173}
        width={541}
        className="mb-12 mx-auto"
      />

      <p>
        Bonding provides crucial capital, called protocol-owned liquidity, that
        helps sustain the Olas protocol. This capital generates returns, which
        can eventually reduce or replace the need for new OLAS emissions,
        benefiting all OLAS token holders.
      </p>
    </div>
  </SectionWrapper>
);
