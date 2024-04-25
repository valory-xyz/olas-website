import React from 'react';
import Link from 'next/link';
import SectionWrapper from 'components/Layout/SectionWrapper';
import WhatIsOlas from './2WhatIsOlas';
import DecentralizedAndSophisticated from './3DecentralizedAndSophisticated';
import HowDoOlasWork from './4HowDoOlasWork';
import QuickIntroArticles from './5QuickIntroArticles';
import WhyBuildOnOlas from './6WhyBuildOnOlas';
import WhatCouldYouBuild from './8WhatCouldYouBuild';
import PageWrapper from '../Layout/PageWrapper';
import Meta from '../Meta';

export const LEARN_LIST = [
  { name: 'What is Olas?', id: 'what-is-olas' },
  { name: 'What are autonomous services?', id: 'what-are-autonomous-services' },
  {
    name: 'How do autonomous services work?',
    id: 'how-do-autonomous-services-work',
  },
  { name: 'Quick intro articles', id: 'quick-intro-articles' },
  { name: 'Why build on Olas?', id: 'why-build-on-olas' },
  { name: 'What could you build?', id: 'what-could-you-build' },
];

const LearnPage = () => (
  <PageWrapper>
    <Meta pageTitle="Learn" description="Build your understanding of what Olas is and how it works." />
    <SectionWrapper customClasses="px-8 mt-12 mb-20 max-w-screen-xl mx-auto">
      <h1 className="text-4xl font-bold tracking-tighter text-center sm:text-5xl md:text-6xl mb-6">Learn</h1>
      <span className="block text-2xl text-center mb-8">Jump To:</span>
      <ul className="flex flex-col gap-4 bg-gray-100 rounded-lg p-6 mx-auto">
        {LEARN_LIST.map((e) => (
          <li key={e.id}>
            <Link href={`/learn/#${e.id}`} className="text-2xl text-purple-600 hover:text-purple-800 visited:text-purple-600">
              {e.name}
            </Link>
          </li>
        ))}
      </ul>
    </SectionWrapper>

    <div className="container mx-auto px-4">
      <WhatIsOlas />
      <DecentralizedAndSophisticated />
      <HowDoOlasWork />
      <QuickIntroArticles />
      <WhyBuildOnOlas />
      <WhatCouldYouBuild />
    </div>
  </PageWrapper>
);

export default LearnPage;
