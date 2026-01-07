import { SUB_HEADER_CLASS } from 'common-util/classes';
import { ACCELERATOR_APPLY_URL, PEARL_YOU_URL } from 'common-util/constants';
import { Card } from 'components/ui/card';
import { ExternalLink, SubsiteLink } from 'components/ui/typography';
import { SquareCheck } from 'lucide-react';

const evaluationList = [
  {
    title: 'Potential',
    description: 'Creativity of the agent concept.',
  },
  {
    title: 'Mission alignment',
    description: 'Product Sense and Strategy.',
  },
  {
    title: 'Impact',
    description: 'Potential to drive adoption and enhance the Olas ecosystem.',
  },
];

export const HowToApply = () => (
  <div className="max-w-[720px] mx-auto max-sm:mx-4">
    // @ts-expect-error TS(2304) FIXME: Cannot find name 'children'.
    // @ts-expect-error TS(2322): Type '{ children: Element[]; className: string; }'... Remove this comment to see the full error message
    // @ts-expect-error TS(2322) FIXME: Type '{ children: Element[]; className: string; }'... Remove this comment to see the full error message
    <Card className="rounded-3xl border outline outline-8 outline-slate-100">
      <div className="px-6 md:px-12 border-b-1.5 border-dotted">
        <h2 className={`${SUB_HEADER_CLASS} font-semibold mb-8 mt-12`}>
          How to apply to the Olas Accelerator
        </h2>
        <div className="mb-8">
          We recommend you{' '}
          // @ts-expect-error TS(2304) FIXME: Cannot find name 'childre'.
          // @ts-expect-error TS(2741): Property 'className' is missing in type '{ childre... Remove this comment to see the full error message
          <SubsiteLink href={PEARL_YOU_URL}>download and try Pearl</SubsiteLink>
          , consult the{' '}
          <ExternalLink href="https://drive.google.com/file/d/1YPe2RFMjf_YPsrldHuwzBHTYwCCy22C8/view">
            Integrating Your AI Agent with Pearl
          </ExternalLink>{' '}
          document and the{' '}
          <ExternalLink href="https://drive.google.com/file/d/1GlK2h7cpcNLqidjEHrPDde7xuQDhABzN/view">
            Agent Integration Checklist
          </ExternalLink>{' '}
          before you frame and submit your proposal.
        </div>
        <h2 className="text-3xl font-semibold mb-6">Submit your proposal</h2>
        <div className="flex flex-col gap-4 mb-8">
          <div>
            <ExternalLink href={ACCELERATOR_APPLY_URL} className="inline">
              Apply here
            </ExternalLink>{' '}
            with a proposal, including:
          </div>
          <div>
            <div className="font-semibold text-xl mb-1">Team</div>
            <p>Team lead information, team size, and team expertise.</p>
          </div>
          <div>
            <div className="font-semibold text-xl mb-1">
              Mission, User Personas & Strategy
            </div>
            <p>
              Agent&apos;s mission, alignment with Pearl, definition of the
              end-user personas, and the agent&apos;s product strategy.
            </p>
          </div>
          <div>
            <div className="font-semibold text-xl mb-1">Adoption Plan</div>
            <p>Adoption plan to achieve the 100 and 1,000 DAA milestones.</p>
          </div>
        </div>
      </div>
      <div className="px-6 md:px-12 mb-4 mt-8">
        <h2 className="text-3xl font-semibold mb-6">
          How is your proposal evaluated?
        </h2>
        {evaluationList.map((item, index) => (
          <div key={index} className="flex flex-row gap-2">
            <SquareCheck size={28} className="text-purple-700" />
            <div className="flex flex-col mb-8">
              <div className="font-semibold text-xl mb-1">{item.title}</div>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  </div>
);
