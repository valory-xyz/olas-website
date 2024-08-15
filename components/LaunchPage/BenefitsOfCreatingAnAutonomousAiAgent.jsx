/* eslint-disable react/no-unescaped-entities */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { SUB_HEADER_CLASS } from 'common-util/classes';
import Image from 'next/image';
import SectionWrapper from 'components/Layout/SectionWrapper';
import Link from 'next/link';

export const BenefitsOfCreatingAnAutonomousAiAgent = () => (
  <SectionWrapper customClasses="lg:p-24 px-4 py-12 border-y">
    <div className="max-w-screen-xl mx-auto items-center text-lg flex px-5">
      <div className="flex flex-col lg:flex-row lg:gap-32">
        <h1 className={`${SUB_HEADER_CLASS} mb-6`}>
          Bring AI agnets economies
          <br />
          {' '}
          to your ecosystem
        </h1>
        <p>
          Create and deploy entire AI agent economies within your ecosystem
          {' '}
          <br />
          effortlessly. As an Olas Launcher, you'll have the tools and resources
          {' '}
          <br />
          to bring autonomous agents into your ecosystem, driving growth in
          {' '}
          <br />
          transaction volume and other key metrics.
        </p>
      </div>
    </div>
    <div className="lg:mt-14 lg:col-span-6 lg:flex px-0 mx-5">
      <Image
        src="/images/launch-page/predict.png"
        alt="predict"
        width={1200}
        height={474}
        className="mx-auto mb-0"
      />
    </div>
    <div className="text-center mt-2">
      <h2 className="text-slate-500">
        {' '}
        <Link href="" className="text-purple-600">
          Olas Predict
        </Link>
        {' '}
        is a bright example of the autonomous AI economy
      </h2>
    </div>
  </SectionWrapper>
);
