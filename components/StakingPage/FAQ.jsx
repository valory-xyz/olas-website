import { Accordion } from 'common-util/Accordion';
import { SECTION_BOX_CLASS, SUB_HEADER_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Link } from 'components/ui/typography';
import Image from 'next/image';

const faq = [
  {
    title: 'How do the pieces fit together?',
    desc: (
      <>
        <Image
          src="/images/staking-page/pieces-fit-diagram.png"
          alt="How do the pieces fit together?"
          width={616}
          height={316}
          className="mb-3"
        />
        <p>
          For full technical detail, check the{' '}
          <Link href="/documents/whitepaper/PoAA Whitepaper.pdf">
            whitepaper
          </Link>
          .
        </p>
      </>
    ),
  },
  {
    title: 'Where will these emissions come from?',
    desc: (
      <p>
        They come directly from the Olas protocol. The DAO through on-chain
        voting manages how much OLAS is emitted into the various staking
        contracts. For more details, check out{' '}
        <Link href="/olas-token">Olas tokenomics</Link>.
      </p>
    ),
  },
  {
    title: 'What is Olas Staking?',
    desc: 'Olas Staking is a system where users stake OLAS tokens to support autonomous agents. Rewards are distributed based on agent activity and performance, not just token lockup.',
  },
  {
    title: 'What is PoAA (Proof-of-Active-Agent)?',
    desc: (
      <p>
        PoAA is a new staking model that blends Proof-of-Stake and
        Proof-of-Work. It rewards agents — and the users who run them — for
        doing useful, verifiable work like making on-chain calls or meeting KPI
        targets. For more details, check out{' '}
        <Link href="/documents/whitepaper/PoAA Whitepaper.pdf">
          PoAA Whitepaper
        </Link>
        .
      </p>
    ),
  },
  {
    title: 'Who can participate in staking?',
    desc: 'Anyone. You can stake OLAS to run an agent or support a specific staking program.',
  },
  {
    title: 'Can I create my own staking contract?',
    desc: 'Yes. Builders, DAOs, and protocols can launch their own staking programs by defining KPIs and deploying a staking contract. This helps attract agents aligned with your goals.',
  },
];

export const FAQ = () => (
  <SectionWrapper
    id="faq"
    customClasses={`${SECTION_BOX_CLASS} max-w-2xl mx-auto`}
  >
    <h2 className={`${SUB_HEADER_CLASS} mb-14`}>Frequently Asked Questions</h2>
    {faq.map((eachFaq, index) => (
      <div className="py-2" key={index}>
        <Accordion
          label={eachFaq.title}
          customClass="p-0 bg-white"
          defaultOpen={false}
        >
          {eachFaq.desc}
        </Accordion>
      </div>
    ))}
  </SectionWrapper>
);
