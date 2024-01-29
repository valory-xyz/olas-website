import React from 'react';
import Link from 'next/link';
import WhatIsAutonolas from './2WhatIsAutonolas';
import DecentralizedAndSophisticated from './3DecentralizedAndSophisticated';
import HowDoAutonolasWork from './4HowDoAutonolasWork';
import QuickIntroArticles from './5QuickIntroArticles';
import WhyBuildOnAutonolas from './6WhyBuildOnAutonolas';
import WhatCouldYouBuild from './8WhatCouldYouBuild';
import Mission from './9Mission';
import PageWrapper from '../Layout/PageWrapper';

export const LEARN_LIST = [
  { name: 'What is Autonolas?', id: 'what-is-autonolas' },
  { name: 'What are autonomous services?', id: 'what-are-autonomous-services' },
  {
    name: 'How do autonomous services work?',
    id: 'how-do-autonomous-services-work',
  },
  { name: 'Quick intro articles', id: 'quick-intro-articles' },
  { name: 'Why build on Autonolas?', id: 'why-build-on-autonolas' },
  { name: 'What could you build?', id: 'what-could-you-build' },
  { name: 'What’s our mission?', id: 'mission' },
];

const LearnPage = () => (
  <PageWrapper>
    <section className="bg-white shadow-md rounded-lg p-10 mb-10">
      <h2 className="text-4xl font-bold tracking-tighter text-center sm:text-5xl md:text-6xl mb-6">Learn</h2>
      <h4 className="text-2xl font-semibold text-center mb-8">Jump To:</h4>
      <div className="bg-gray-100 shadow-lg rounded-lg p-6">
        <ul>
          {LEARN_LIST.map(e => (
            <li key={e.id} className="mb-4">
              <Link href={`/learn/#${e.id}`} className="text-2xl text-purple-600 hover:text-purple-800 visited:text-purple-600">
                  {e.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>

    <div className="container mx-auto px-4">
      <WhatIsAutonolas />
      <DecentralizedAndSophisticated />
      <HowDoAutonolasWork />
      <QuickIntroArticles />
      <WhyBuildOnAutonolas />
      <WhatCouldYouBuild />
      <Mission />
    </div>
  </PageWrapper>
);

export default LearnPage;
