import { SUB_HEADER_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';

export const EvaluationCriteria = () => (
  <SectionWrapper customClasses="py-12 border-b-1.5">
    <div className="max-w-[720px] mx-auto">
      <h1 className={`${SUB_HEADER_CLASS} font-semibold mb-4 mt-8`}>
        Evaluation Criteria
      </h1>
      <ol className="list-decimal ml-6">
        <li className="mb-2">
          <strong>Innovation and Creativity:</strong>
          <br /> Does the agent introduce a novel and valuable use case for
          Pearl users?
        </li>
        <li className="mb-2">
          <div className="mb-2">
            <strong>Technical Execution:</strong>
          </div>
          <ol className="list-[lower-alpha] ml-6">
            <li className="mb-2">
              How well is the agent integrated into the Pearl App?
            </li>
            <li className="mb-2">
              Does it meet performance and reliability standards?
            </li>
          </ol>
        </li>
        <li className="mb-2">
          <div className="mb-2">
            <strong>Adoption Success:</strong>
          </div>
          <ol className="list-[lower-alpha] ml-6">
            <li className="mb-2">
              How likely is the agent to attract and retain DAA users?
            </li>
            <li className="mb-2">
              Does it contribute to the growth of Pearl&apos;s user base?
            </li>
          </ol>
        </li>
        <li className="mb-2">
          <strong>Ecosystem Alignment:</strong> <br />
          Does the agent enhance the functionality and appeal of the Pearl App?
        </li>
      </ol>
    </div>
  </SectionWrapper>
);
