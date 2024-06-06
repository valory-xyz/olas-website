import SectionWrapper from 'components/Layout/SectionWrapper';
import { SCREEN_WIDTH_LG, SUB_HEADER_CLASS } from 'common-util/classes';

export const DoesOlSupportMultiAgentSystems = () => (
  <SectionWrapper customClasses="px-4 py-8 lg:px-24 lg:py-20">
    <div className={`${SCREEN_WIDTH_LG} gap-5`}>
      <h2 className={`${SUB_HEADER_CLASS} text-left mb-2`}>
        Does Olas support multi-agent systems?
      </h2>

      <div className="flex flex-col gap-4">
        <p>
          Olas supports a wide variety of multi-agent systems, that is systems
          of multiple interacting intelligent agents that solve problems that
          are difficult for individual agents to solve.
        </p>

        <p>
          Evidently, any Agent Economy is a multi-agent system. Moreover,
          decentralized agents can be a multi-agent system when the individual
          agent instances in the autonomous service take on differentiated
          tasks.
        </p>
      </div>
    </div>
  </SectionWrapper>
);
