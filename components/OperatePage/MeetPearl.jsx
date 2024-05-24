import Image from 'next/image';
import SectionWrapper from 'components/Layout/SectionWrapper';
import {
  FileCode2,
  Handshake,
  LockKeyhole,
  PersonStanding,
} from 'lucide-react';
import {
  SECTION_BOX_CLASS,
  SUB_HEADER_CLASS,
  TEXT_CLASS,
  TEXT_LIGHT_CLASS,
} from './utils';

const list = [
  {
    title: 'Accessible',
    desc: 'No prior expertise is required. If you can use a computer, you can start earning OLAS with Pearl. It’s designed to be as simple as possible.',
    icon: <PersonStanding />,
  },
  {
    title: 'Strong',
    desc: 'We put your peace of mind first. Pearl provides robust recovery options to protect your funds.',
    icon: <LockKeyhole />,
  },
  {
    title: 'Transparent',
    desc: 'The Pearl app is completely open-source, allowing everyone to review its code for total transparency.',
    icon: <FileCode2 />,
  },
  {
    title: 'Yours',
    desc: 'By staking your own agent and participating in Olas agent economies, you are claiming your ownership of a share of AI.',
    icon: <Handshake />,
  },
];

const eachCardCss = {
  background:
    'linear-gradient(94.05deg, #F2F4F9 0%, rgba(242, 244, 249, 0) 100%)',
};

const EasySetupContinuousRewards = () => (
  <div className="max-w-screen-xl lg:px-12 mx-auto lg:gap-8 xl:gap-0 lg:grid-cols-12 mt-24 mb-8">
    <p className={`${TEXT_LIGHT_CLASS} text-left lg:text-center mb-3`}>
      DESIGNED TO BE...
    </p>

    <h2
      className={`${SUB_HEADER_CLASS} text-left mb-8 lg:text-center lg:mb-14`}
    >
      Accessible. Strong. Transparent. Yours.
    </h2>

    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      {list.map(({ title, desc, icon }) => (
        <div
          key={title}
          className="flex flex-col gap-3 bg-gradient-to-r p-4 rounded-xl border lg:p-6"
          style={eachCardCss}
        >
          <div className="flex items-center">
            {icon}
            <h2 className="text-xl font-semibold ml-2">{title}</h2>
          </div>

          <p className={TEXT_CLASS}>{desc}</p>
        </div>
      ))}
    </div>
  </div>
);

export const MeetPearlContent = () => (
  <div className="max-w-screen-xl grid items-start lg:pl-12 mx-auto lg:grid-cols-12 lg:items-center">
    <div className="mb-6 px-0 lg:col-span-5 lg:px-5 lg:text-left lg:mb-12">
      <Image
        style={{ marginLeft: -6 }}
        className="mb-2 lg:mb-4 w-16 lg:w-16"
        alt="Operate Logo"
        src="/images/operate-page/operate-logo.svg"
        width={48}
        height={48}
      />

      <h2 className={`${SUB_HEADER_CLASS} mb-4 lg:mb-6`}>Meet Pearl</h2>

      <p className={TEXT_CLASS}>
        An all-in-one application designed to streamline your entry into the
        world of autonomous agents and earning OLAS through staking.
      </p>
    </div>

    <div className="lg:mt-0 lg:col-span-7 lg:flex">
      <Image
        className="mx-auto"
        alt="Meet Pearl"
        src="/images/operate-page/meet-the-operate-app.png"
        width={580}
        height={574}
      />
    </div>
  </div>
);

export const MeetPearl = () => (
  <SectionWrapper customClasses={`${SECTION_BOX_CLASS}`}>
    <MeetPearlContent />
    <EasySetupContinuousRewards />
  </SectionWrapper>
);
