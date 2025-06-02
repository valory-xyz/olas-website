import { SUB_HEADER_CLASS } from 'common-util/classes';
import { ACCELERATOR_APPLY_URL } from 'common-util/constants';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { ExternalLink } from 'components/ui/typography';
import Link from 'next/link';

const list = [
  {
    title: 'Apply with your agent idea',
    description: (
      <>
        <ExternalLink href={ACCELERATOR_APPLY_URL}>
          Submit a proposal
        </ExternalLink>{' '}
        detailing your AI agent&apos;s purpose, product strategy, adoption
        strategy, and alignment with the accelerator program.
      </>
    ),
  },
  {
    title: 'Get selected & receive $5,000',
    description:
      'Awarded to the teams with the highest potential and impactful proposals.',
  },
  {
    title:
      '$5,000 on delivery and approval of the design, specification and technical plan of the MVP within the first 2 weeks from the project start date. ',
  },
  {
    title:
      '$40,000 for delivering agent MVP on Pearl within 90 days from the project start date',
    description:
      'The Agent MVP must be usable, meet integration requirements, and pass quality assurance checks.',
  },
  {
    title:
      'Reach 100 DAA milestone within 90 days from the MVP delivery & unlock $10K',
    description:
      'Awarded on achieving 100 users of this agent, this is measured as 100 Daily Active Agents per Olas Staking.',
  },
  {
    title:
      'Reach 1,000 DAAs within 90 days from the previous milestone, and unlock $40K',
    description:
      'Awarded on achieving 1,000 active users of this agent, this is measured as 1,000 Daily Active Agents per Olas Staking.',
  },
  {
    title: 'Earn additional OLAS rewards',
    description: (
      <>
        Teams that register their agent code in the Olas Protocol can also
        receive ongoing OLAS Dev Rewards. Top developers are already earning
        thousands of OLAS each month.{' '}
        <Link className="text-purple-600" href="https://olas.network/build">
          Learn more
        </Link>
        .
      </>
    ),
  },
];

export const HowDoesAcceleratorWork = () => (
  <SectionWrapper customClasses="py-12 mb-12 max-sm:mx-4">
    <div className="max-w-[720px] mx-auto">
      <h2 className={`${SUB_HEADER_CLASS} font-semibold mb-12`}>
        How does the Olas Accelerator work?
      </h2>
      <div className="grid grid-cols-1 rounded-xl border-1.5">
        {list.map((item, index) => {
          let borderClass = '';
          index == 0 ? (borderClass = '') : (borderClass = 'border-t-1.5');
          return (
            <div
              key={index}
              className={`flex gap-2 border-purple-200 lg:gap-4 overflow-hidden ${borderClass}`}
            >
              <div className="border-r-1.5 border-purple-200 w-[80px] h-full max-sm:min-h-[120px] max-sm:min-w-[80px] aspect-square flex justify-center text-center bg-gradient-to-t from-[#FAF0FF]">
                <span className="text-[56px] font-bold text-purple-400 my-auto">
                  {index + 1}
                </span>
              </div>
              <div className="my-auto mr-4 py-4">
                <div className="text-xl font-semibold mb-2">{item.title}</div>
                <p className="text-base">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </SectionWrapper>
);
