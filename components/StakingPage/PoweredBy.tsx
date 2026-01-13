import { SECTION_BOX_CLASS, SUB_HEADER_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Link } from 'components/ui/typography';

export const PoweredBy = () => (
  <SectionWrapper
    id="PoAA"
    backgroundType="NONE"
    customClasses={`${SECTION_BOX_CLASS} bg-slate-100`}
  >
    <div className="max-w-2xl mx-auto">
      <h2 className={`${SUB_HEADER_CLASS} text-center mb-6`}>💥 🦾 💥 </h2>
      <h2 className={`${SUB_HEADER_CLASS} text-center mb-10`}>
        Powered by Proof-of-Active-Agent (PoAA)
      </h2>
      <div className="flex flex-col gap-6">
        <p>
          Olas Staking is based on{' '}
          <Link href="/documents/whitepaper/PoAA Whitepaper.pdf">Proof-of-Active-Agent (PoAA)</Link>{' '}
          — a mechanism that rewards real AI agent activity, not passive token lockup.
        </p>
        <p>
          PoAA combines the strengths of Proof-of-Stake and Proof-of-Work, but shifts rewards to
          agents that deliver useful, verifiable outcomes — like executing on-chain actions or
          meeting KPIs.
        </p>
        <p>
          This aligns incentives across the ecosystem and ensures that value flows to meaningful
          contributions.
        </p>
      </div>
    </div>
  </SectionWrapper>
);
