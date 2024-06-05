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

export const LearnPage = () => (
  <PageWrapper>
    <Meta
      pageTitle="Learn"
      description="Build your understanding of what Olas is and how it works."
    />

    <div className="flex flex-col gap-12 container mx-auto px-4">
      <WhatIsOlas />
      <DecentralizedAndSophisticated />
      <HowDoOlasWork />
      <QuickIntroArticles />
      <WhyBuildOnOlas />
      <WhatCouldYouBuild />
    </div>
  </PageWrapper>
);
