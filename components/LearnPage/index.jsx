import WhatIsOlas from './2WhatIsOlas';
import DecentralizedAndSophisticated from './3DecentralizedAndSophisticated';
import HowDoOlasWork from './4HowDoOlasWork';
import QuickIntroArticles from './5QuickIntroArticles';
import PageWrapper from '../Layout/PageWrapper';
import Meta from '../Meta';

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
    </div>
  </PageWrapper>
);
