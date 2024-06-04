import Image from 'next/image';
import Link from 'next/link';

import { SCREEN_WIDTH_LG, SUB_HEADER_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';

const list = [
  'Involves being specific about the agents’ goals and defining matching KPIs that capture these goals.',
  <>
    Involves developing a simple extension contract that embeds these KPIs in
    code.
    {' '}
    <Link
      href="https://github.com/valory-xyz/autonolas-staking-programmes/blob/main/contracts/mech_usage/MechActivityChecker.sol"
      className="text-purple-600"
      target="_blank"
    >
      Example here
    </Link>
    .
  </>,
  <>
    Involves developing the matching agents on the Olas Stack.
    {' '}
    <Link
      href="https://www.valory.xyz/"
      className="text-purple-600"
      target="_blank"
    >
      Valory
    </Link>
    {' '}
    offers a matching service with experienced consultants that have been vetted
    to develop agents on Olas.
  </>,
  'Operators (end users and professionals) can operate these agents.',
  'Protocol teams hit their goals through the targeted activity of the agents.',
];

export const CreateAnAutonomousAiAgent = () => (
  <SectionWrapper
    customClasses="lg:p-24 px-4 py-12 "
    backgroundType="SUBTLE_GRADIENT"
  >
    <div className={`${SCREEN_WIDTH_LG} gap-5`}>
      <h2 className={`${SUB_HEADER_CLASS} text-left mb-8`}>
        How to create an autonomous AI agent economy on Olas
      </h2>

      <Image
        className="mx-auto mb-8"
        alt="OLAS Utility"
        src="/images/launch-page/how-predict-works.svg"
        width="600"
        height="465"
      />

      <ol className="list-decimal list-inside">
        {list.map((title, index) => (
          <li key={index} className="mb-1">
            {title}
          </li>
        ))}
      </ol>

      <p className="mt-2">
        More on staking
        {' '}
        <Link href="https://staking.olas.network/" className="text-purple-600">
          here
        </Link>
        .
      </p>
    </div>
  </SectionWrapper>
);
