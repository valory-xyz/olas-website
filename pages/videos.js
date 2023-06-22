import PageWrapper from '@/components/Layout/PageWrapper';
import SectionWrapper from '@/components/Layout/SectionWrapper';
import Videos from '@/components/Content/Videos'

const VideosPage = () =>
  <PageWrapper>
    <SectionWrapper backgroundType={"SUBTLE_GRADIENT"}><Videos /></SectionWrapper>
  </PageWrapper>
  ;

export default VideosPage;