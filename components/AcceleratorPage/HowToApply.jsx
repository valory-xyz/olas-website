import { SUB_HEADER_CLASS } from 'common-util/classes';
import { Card } from 'components/ui/card';
import { ExternalLink } from 'components/ui/typography';
import { SquareCheck } from 'lucide-react';

const evaluationList = [
  {
    title: 'Potential',
    description: 'Creativity of the agent concept.',
  },
  {
    title: 'Feasibility',
    description: 'Clarity and practicality of the implementation plan.',
  },
  {
    title: 'Impact',
    description:
      'Potential to drive adoption and enhance Pearl and the Olas ecosystem.',
  },
];

export const HowToApply = () => (
  <div className="max-w-[720px] mx-auto">
    <Card className="rounded-3xl border outline outline-8 outline-slate-100">
      <div className="px-12 border-b-1.5 border-dotted">
        <h1 className={`${SUB_HEADER_CLASS} font-semibold mb-8 mt-12`}>
          How to apply to the Olas Accelerator
        </h1>
        <h2 className="text-3xl font-semibold mb-6">Submit your proposal</h2>
        <div className="flex flex-col gap-4 mb-8">
          <div>
            <ExternalLink
              href="https://docs.google.com/forms/d/1nXIHsfudZzOv7oUGcJ2nvSbgVwziR2g9Mvfhik9t1IA/edit"
              className="inline"
            >
              Apply here
            </ExternalLink>{' '}
            with a proposal, including:
          </div>
          <div>
            <div className="font-semibold text-xl mb-2">
              Purpose & functionality
            </div>
            <p>
              The agent&apos;s purpose, core functionality, and target users.
            </p>
          </div>
          <div>
            <div className="font-semibold text-xl mb-2">Technical plan</div>
            <p>
              A technical implementation plan, highlighting an integration with
              Pearl.
            </p>
          </div>
          <div>
            <div className="font-semibold text-xl mb-2">Adoption plan</div>
            <p>An adoption strategy to achieve the 100 DAA user milestone.</p>
          </div>
        </div>
      </div>
      <div className="px-12 mb-4 mt-8">
        <h2 className="text-3xl font-semibold mb-6">
          How is your proposal evaluated?
        </h2>
        {evaluationList.map((item, index) => (
          <div key={index} className="flex flex-row gap-2">
            <SquareCheck size={28} className="text-purple-700" />
            <div className="flex flex-col mb-8">
              <div className="font-semibold text-xl">{item.title}</div>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  </div>
);
