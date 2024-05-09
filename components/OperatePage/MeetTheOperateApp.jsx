import Image from 'next/image';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { TEXT } from 'styles/globals';
import { kebabCase } from 'lodash';
import {
  CircleDollarSign, Cog, LockKeyhole, Zap,
} from 'lucide-react';
import SectionHeading from '../SectionHeading';

const list = [
  {
    title: 'Quick Installation',
    desc: 'Download and set up the Olas Operate app in minutes. Our user-friendly interface ensures a smooth setup process, letting you deploy your first agent with ease.',
    icon: <Zap />,
  },
  {
    title: 'Run Agents Effortlessly',
    desc: 'Once set up, your agents operate in the background. No need for continuous monitoring—your computer does the work while you go about your day.',
    icon: <Cog />,
  },
  {
    title: 'Stake and Earn OLAS',
    desc: 'With Olas Operate, each minute your agent is active could translates into OLAS.',
    icon: <CircleDollarSign />,
  },
  {
    title: 'Secure and Trustworthy',
    desc: 'Built with top-tier security measures to ensure your data and earnings are protected.',
    icon: <LockKeyhole />,
  },
];

const eachCardCss = {
  background:
    'linear-gradient(94.05deg, #F2F4F9 0%, rgba(242, 244, 249, 0) 100%)',
};

export const EasySetupContinuousRewards = () => (
  <div className="max-w-screen-xl lg:px-12 mx-auto lg:gap-8 xl:gap-0 lg:grid-cols-12  mt-24">
    <SectionHeading>
      <div className="text-center">Easy setup. Continuous rewards</div>
    </SectionHeading>

    <div className="grid grid-cols-2 gap-8">
      {list.map(({ title, desc, icon }) => (
        <div
          key={kebabCase(title)}
          className="bg-gradient-to-r from-purple-500 to-blue-500 p-4 rounded-lg text-gray-600 border"
          style={eachCardCss}
        >
          <div className="flex items-center mb-2">
            {icon}
            <h2 className="text-lg font-semibold ml-1">{title}</h2>
          </div>

          <p className="">{desc}</p>
        </div>
      ))}
    </div>
  </div>
);

const MeetTheOperatorContent = () => (
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

    <EasySetupContinuousRewards />
  </SectionWrapper>
);

export const MeetTheOperateApp = () => <MeetTheOperatorContent />;
