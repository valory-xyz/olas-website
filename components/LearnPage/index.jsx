import { DecentralizedAndSophisticated } from './DecentralizedAndSophisticated';
import HowDoOlasWork from './4HowDoOlasWork';
import { QuickIntroArticles } from './QuickIntroArticles';
import PageWrapper from '../Layout/PageWrapper';
import Meta from '../Meta';
import { TheTech } from '../HomepageSection/TheTech';

export const LearnPage = () => (
  <PageWrapper>
    <Meta
      pageTitle="Learn"
      description="Build your understanding of what Olas is and how it works."
    />

    <TheTech hideLearnMoreButton />
    <div className="flex flex-col gap-12 container mx-auto px-4">
      <DecentralizedAndSophisticated />
      <HowDoOlasWork />
      <QuickIntroArticles />
    </div>
  </PageWrapper>
);
