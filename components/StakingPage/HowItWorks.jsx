import { SUB_HEADER_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Card } from 'components/ui/card';
import { Tag } from 'components/ui/tag';
import Image from 'next/image';
import { useState } from 'react';

const mechanismList = [
  'DAOs or Protocol teams (aka Launchers) define their goals.',
  'DAOs or Protocol teams launch staking contracts.',
  'Builders develop AI agents using their preferred AI agent stack.',
  'Operators run AI agents.',
  'Launchers hit their goals (powered by all roles).',
];

const exampleList = [
  'Olas DAO decides to launch a prediction product.',
  'Olas DAO creates staking programs',
  'Builders develop the prediction agent using Olas Stack.',
  'Operators run prediction agents to earn staking rewards.',
  'Olas DAO delivers the prediction product',
];

export const HowItWorks = () => {
  const [activeTab, setActiveTab] = useState('mechanism');

  return (
    <SectionWrapper>
      <div className="max-w-5xl mx-auto">
        <div className="place-items-center mb-10">
          <Tag variant="primary" className="mb-6">
            How It Works
          </Tag>
          <h2 className={`${SUB_HEADER_CLASS} mb-10`}>
            Not Your Ordinary Staking Mechanism
          </h2>
          <p>
            Staking gives Olas unprecedented control to launch, sustain and
            benefit from entire autonomous AI agent economies.
          </p>
        </div>
        <div className="flex flex-row mb-14 border rounded-full w-fit p-1 mx-auto">
          <button
            onClick={() => setActiveTab('mechanism')}
            className={`max-sm:text-sm px-4 py-2 transition-colors rounded-full ${activeTab === 'mechanism' ? 'text-black bg-slate-100' : 'text-slate-400 hover:text-slate-300'}`}
          >
            Mechanism
          </button>
          <button
            onClick={() => setActiveTab('example')}
            className={`max-sm:text-sm px-4 py-2 transition-colors rounded-full ${activeTab === 'example' ? 'text-black bg-slate-100' : 'text-slate-400 hover:text-slate-300'}`}
          >
            Example
          </button>
        </div>
        <div className="flex flex-col max-lg:place-items-center lg:flex-row gap-14 justify-center">
          <Image
            src={`/images/staking-page/${activeTab}-diagram.png`}
            alt={activeTab}
            width={528}
            height={400}
          />
          <Card className="bg-slate-100 p-6 w-[320px] h-fit">
            <ol className="list-decimal ml-6">
              {(activeTab === 'mechanism' ? mechanismList : exampleList).map(
                (item, index) => (
                  <li key={index} className="mb-6">
                    {item}
                  </li>
                ),
              )}
            </ol>
          </Card>
        </div>
      </div>
    </SectionWrapper>
  );
};
