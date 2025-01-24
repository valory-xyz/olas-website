import { SUB_HEADER_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';

export const ExpectedOutcomes = () => (
  <SectionWrapper customClasses="py-12 border-b-1.5">
    <div className="max-w-[720px] mx-auto">
      <h1 className={`${SUB_HEADER_CLASS} font-semibold mb-4 mt-8`}>
        Expected Outcomes
      </h1>
      <ol className="list-decimal ml-6">
        <li className="mb-2">
          <strong>New Agents in the Pearl App Store:</strong>
          <br />
          Up to 10 high-quality agents developed and integrated, adding agents
          to Pearl and diversifying the Pearl agent use cases. Ideally, all are
          ideas that the community gets excited about.
        </li>
        <li className="mb-2">
          <strong>Increased DAA Adoption:</strong> <br />
          Accelerated adoption of agents and staking activity, strengthening
          Pearl.
        </li>
        <li className="mb-2">
          <strong>Developer Ecosystem Growth:</strong> <br />
          Creation of a network of skilled builders committed to expanding
          Pearl&apos;s potential.
        </li>
        <li className="mb-2">
          <strong>Broader Awareness and Engagement:</strong> <br />
          Demonstrating the capabilities of Pearl as the Olas agent app store to
          attract future developers and users.
        </li>
      </ol>
    </div>
  </SectionWrapper>
);
