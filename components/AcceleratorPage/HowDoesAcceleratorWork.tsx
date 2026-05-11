import { SUB_HEADER_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';

import { NotAcceptingAlert } from './NotAcceptingAlert';

const list = [
  {
    title: 'Apply with Your Agent Idea',
    description: (
      <>
        Submit a proposal detailing your AI agent&apos;s concept, integration with Pearl, and user
        adoption plan.
        <NotAcceptingAlert className="mt-3" />
      </>
    ),
  },
  {
    title: 'Get selected & receive $10,000',
    description:
      'Awarded to the teams with the most promising agent concepts and detailed implementation plans.',
  },
  {
    title: '$40,000 for delivering agent MVP on Pearl',
    description:
      'The Agent MVP must be usable, meet integration requirements, and pass quality assurance checks.',
  },
  {
    title: 'Reach 100 DAA milestones & unlock $10K',
    description:
      'Awarded on achieving 100 users of this agent, this is measured as 100 Daily Active Agents per Olas Staking.',
  },
  {
    title: 'Unlock $40K for 1000 DAAs',
    description:
      'Awarded on achieving 100 users of this agent, this is measured as 100 Daily Active Agents per Olas Staking.',
  },
  {
    title: 'Earn additional OLAS rewards',
    description: (
      <>
        Teams that register their agent code in the Olas Protocol can also receive ongoing OLAS Dev
        Rewards. Top developers are already earning thousands of OLAS each month.
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
                <span className="text-[56px] font-bold text-purple-400 my-auto">{index + 1}</span>
              </div>
              <div className="my-auto flex-1 min-w-0 pr-4 py-4">
                <div className="text-xl font-semibold mb-2">{item.title}</div>
                <div className="text-base">{item.description}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </SectionWrapper>
);
