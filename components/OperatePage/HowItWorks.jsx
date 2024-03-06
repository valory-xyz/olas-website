import Image from 'next/image';
import SectionWrapper from '@/components/Layout/SectionWrapper';
import SectionHeading from '../SectionHeading';
import { CTA } from './utils';
import { TEXT } from '@/styles/globals';

function HowItWorks() {
  return (
    <SectionWrapper customClasses="lg:p-24 px-4 py-12">
      <div className="grid max-w-screen-xl lg:px-12 mx-auto lg:gap-8 xl:gap-0 lg:grid-cols-12 items-center">
        <div className="lg:col-span-7 px-5 lg:p-0 mb-12">
          <SectionHeading>How it Works</SectionHeading>
          <ol className={`${TEXT} list-decimal`}>
            <li>
              <a href={CTA} className="text-primary">Browse</a>
              {' '}
              for interesting agents
            </li>
            <li>Follow instructions to run them. Optionally, stake tokens behind the quality of your operations</li>
            <li>Refine strategy and maintain uptime</li>
            <li>Potentially earn rewards and benefit from the operations of the agent</li>
          </ol>
        </div>
        <div className="lg:mt-0 lg:col-span-5 lg:flex">
          <Image
            className="mx-auto border shadow-xl"
            alt="OLAS Utility"
            src="/images/operate-page/how-it-works.png"
            width="500"
            height="474"
          />
        </div>
      </div>
    </SectionWrapper>
  );
}

export default HowItWorks;
