import PageWrapper from '@/components/Layout/PageWrapper';
import SectionWrapper from '@/components/Layout/SectionWrapper';
import Videos from '@/components/Content/Videos'
import Meta from '@/components/Meta';

const VideosPage = () =>
  <PageWrapper>
    <Meta pageTitle="Videos" />
    <SectionWrapper backgroundType={"SUBTLE_GRADIENT"}><Videos /></SectionWrapper>
  </PageWrapper>
  ;

export default VideosPage;