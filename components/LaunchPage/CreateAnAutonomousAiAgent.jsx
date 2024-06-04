import Image from 'next/image';
import SectionWrapper from 'components/Layout/SectionWrapper';
import Link from 'next/link';
import SectionHeading from '../SectionHeading';

const list = [
  'Involves being specific about the agents’ goals and defining matching KPIs that capture these goals',
  <>
    Involves developing a simple extension contract that embeds these KPIs in
    code.
    {' '}
    <Link
      href="https://github.com/valory-xyz/autonolas-staking-programmes/blob/main/contracts/mech_usage/MechActivityChecker.sol"
      className="text-purple-600"
    >
      Example here
    </Link>
    .
  </>,
  'Involves developing the matching agents on the Olas Stack. Valory offers a matching service with experienced consultants that have been vetted to develop agents on Olas.',
  'Operators (end users and professionals) can operate these agents',
  'Protocol teams hit their goals through the targeted activity of the agents.',
];

export const CreateAnAutonomousAiAgent = () => (
  <SectionWrapper customClasses="lg:p-24 px-4 py-12 ">
    <SectionHeading>Network Role</SectionHeading>
    <Image
      className="mx-auto mb-24"
      alt="OLAS Utility"
      src="/images/launch-page/how-predict-works.svg"
      width="600"
      height="474"
    />

    {list.map((title, index) => (
      <div
        key={index}
        className="flex flex-col gap-3 bg-gradient-to-r p-4 lg:p-6"
      >
        <div className="flex items-center">
          <h2 className="text-xl">{title}</h2>
        </div>

        <p className="text-base">{title}</p>
      </div>
    ))}
  </SectionWrapper>
);
