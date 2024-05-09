import Image from 'next/image';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { TEXT } from 'styles/globals';
import SectionHeading from '../SectionHeading';

export const MeetTheOperateApp = () => (
  <SectionWrapper customClasses="lg:p-24 px-4 py-12">
    <div className="grid max-w-screen-xl lg:pl-12 mx-auto lg:gap-8 xl:gap-0 lg:grid-cols-12 items-center">
      <div className="lg:col-span-6 text-center px-5 lg:p-0 lg:text-left mb-12">
        <Image
          style={{ marginLeft: -6 }}
          className="mb-6"
          alt="Operate Logo"
          src="/images/operate-page/operate-logo.svg"
          width={96}
          height={96}
        />

        <SectionHeading>Meet the Operate app</SectionHeading>

        <div className={TEXT}>
          Set up and run an agent with just a few clicks, and start earning OLAS
          tokens by simply keeping your computer on.
        </div>

        <div className={`${TEXT} mt-6`}>
          Whether you’re a tech enthusiast or a novice in the blockchain space,
          Olas Operate makes participation accessible and rewarding.
        </div>
      </div>

      <div className="lg:mt-0 lg:col-span-6 lg:flex">
        <Image
          className="mx-auto"
          alt="Meet the Operate app"
          src="/images/operate-page/meet-the-operate-app.png"
          width={580}
          height={574}
        />
      </div>
    </div>
  </SectionWrapper>
);
