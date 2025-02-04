import { SUB_HEADER_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';

const criteria = [
  {
    title: 'Innovation and creativity',
    desc: 'Does the agent introduce a novel and valuable use case for Pearl users?',
  },
  {
    title: 'Innovation and creativity',
    desc: (
      <ol className="list-decimal ml-6">
        <li className="mb-2">
          How well is the agent integrated into the Pearl App?
        </li>
        <li className="mb-2">
          Does it meet performance and reliability standards?
        </li>
      </ol>
    ),
  },
  {
    title: 'Adoption success',
    desc: (
      <ol className="list-decimal ml-6">
        <li className="mb-2">
          How likely is the agent to attract and retain DAA users?
        </li>
        <li className="mb-2">
          Does it contribute to the growth of Pearl&apos;s user base?
        </li>
      </ol>
    ),
  },
  {
    title: 'Ecosystem alignment',
    desc: 'Does the agent enhance the functionality and appeal of the Pearl App?',
  },
];

export const EvaluationCriteria = () => (
  <SectionWrapper customClasses="max-sm:mx-4 py-12 border-b-1.5">
    <div className="max-w-[720px] mx-auto">
      <div className="flex flex-col gap-2 mb-12">
        <h1 className={`${SUB_HEADER_CLASS} font-semibold my-8`}>
          What support is provided?
        </h1>
        Selected teams will enter a 6-12 week self-paced development phase to
        build their MVPs. <br />
        <div className="flex flex-row gap-2">
          <div className="text-purple-600">-&gt;</div>
          Technical documentation, SDKs, and APIs.
        </div>
        <div className="flex flex-row gap-2">
          <div className="text-purple-600">-&gt;</div>
          Dedicated developer support channels and workshops as needed.
        </div>
        <div className="flex flex-row gap-2">
          <div className="text-purple-600">-&gt;</div>
          Marketing Support.
        </div>
      </div>
      <div className="flex flex-col gap-8">
        <h1 className={`${SUB_HEADER_CLASS} font-semibold mt-8`}>
          Evaluation Criteria
        </h1>
        {criteria.map((item, index) => (
          <div key={index}>
            <div className="font-semibold text-xl">{item.title}</div>
            <div>{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  </SectionWrapper>
);
