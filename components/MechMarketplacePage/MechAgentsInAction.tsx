import { SECTION_BOX_CLASS, SUB_HEADER_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import Image from 'next/image';
import Link from 'next/link';

export const MechAgentsInAction = () => (
  <SectionWrapper
    id="sample-use-case"
    customClasses={`border-b bg-gradient-to-t from-slate-200 to-slate-50 ${SECTION_BOX_CLASS}`}
  >
    <div className="mx-auto max-w-6xl flex flex-col gap-14">
      <div className="text-center">
        <div className="max-sm:mt-2 rounded-full border py-2 px-3 max-w-fit inline bg-white text-slate-600">
          Use Case
        </div>
        <h2 className={`${SUB_HEADER_CLASS} mt-6`}>Mech Agents in Action - Eolas AI</h2>
      </div>
      <Image
        src="/images/mech-marketplace/eolas-AI.png"
        alt="Mech agents in action - Eolas AI"
        width={1096}
        height={855}
      />
      <div className="max-w-[650px] mx-auto">
        <p className="mb-4">
          @Eolas_AI is a{' '}
          <Link
            href="/blog/how-olas-is-driving-agent-to-agent-collaboration-with-creator-bid"
            className="text-purple-600"
          >
            CreatorBid agent
          </Link>{' '}
          built on Olas Mech Agents. It lets users request real-time, AI-driven predictions directly
          on X (formerly Twitter) — simply by mentioning the agent. From weather and market
          forecasts to event outcomes, predictions are delivered instantly and autonomously.
        </p>
        <p>
          Behind the scenes,{' '}
          <Link href="/agents/ai-mechs" className="text-purple-600">
            Olas Mechs
          </Link>{' '}
          handle everything: agent-to-agent payments, task delegation, and prediction delivery. What
          looks like a simple interaction is actually a powerful example of Mechs in action —
          showcasing real A2A collaboration. Since launch, users have made 57 paid prediction
          requests, all fulfilled through the Mech Marketplace.
        </p>
      </div>
    </div>
  </SectionWrapper>
);
