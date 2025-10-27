import { SECTION_BOX_CLASS, SUB_HEADER_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Card } from 'components/ui/card';
import Image from 'next/image';

const benefits = [
  {
    imgSrc: '/images/pearl-page/buy-with-fiat.png',
    label: 'Buy with Fiat – Fast, Easy Setup',
    description:
      'No crypto needed. Fund your agent instantly using a credit/debit card via built-in onramp and get started quickly and easily.',
  },
  {
    imgSrc: '/images/pearl-page/earn-while-you-sleep.png',
    label: 'Earn While You Sleep',
    description:
      'Stake OLAS, let your agent run autonomously for you and collect potential rewards without lifting a finger.',
  },
  {
    imgSrc: '/images/pearl-page/app-store.png',
    imgHeight: 822,
    label: 'Many Agents, One App Store',
    description:
      'From DeFi to prediction markets — browse, launch, and manage multiple AI agents, all in one place.',
    rowClass: 'row-span-2',
  },
  {
    imgSrc: '/images/pearl-page/modes.png',
    imgWidth: '872',
    label: 'Co-Pilot Mode <-> Autonomous Mode',
    description: "Define your agent's goals, then let it operate autonomously.",
    colClass: 'col-span-2',
  },
];

export const Benefits = () => (
  <SectionWrapper
    customClasses={`${SECTION_BOX_CLASS} justify-center text-center`}
  >
    <h2 className={`${SUB_HEADER_CLASS} mb-14`}>
      Ease of Web2 UX, <span className="text-purple-700">Benefits of Web3</span>
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-3 max-w-[1320px] mx-h-[1016px] mx-auto gap-6">
      {benefits.map((benefit, index) => {
        const colClass = benefit.colClass ? benefit.colClass : 'col-span-1';
        const rowClass = benefit.rowClass ? benefit.rowClass : 'row-span-1';

        return (
          <Card
            key={`benefit-${index}`}
            className={`md:${rowClass} md:${colClass} text-left overflow-hidden`}
          >
            <Image
              src={benefit.imgSrc}
              alt={benefit.label}
              width={benefit.imgWidth ? benefit.imgWidth : 424}
              height={benefit.imgHeight ? benefit.imgHeight : 350}
              className="border-b-1.5"
            />
            <div className="benefit-card-bg p-6 pt-4 h-full">
              <p className="text-lg font-bold mb-[6px]">{benefit.label}</p>
              <p className="text-slate-600">{benefit.description}</p>
            </div>
          </Card>
        );
      })}
    </div>
  </SectionWrapper>
);
