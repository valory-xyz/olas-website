import { useFetchVideos } from 'common-util/useFetchApi';
import Videos from 'components/Content/Videos';
import PageWrapper from 'components/Layout/PageWrapper';
import SectionWrapper from 'components/Layout/SectionWrapper';
import Meta from 'components/Meta';

const VideosPage = () => {
  const { videos, isLoading } = useFetchVideos();

  return (
    <PageWrapper>
      <Meta
        pageTitle="Videos"
        description="Tune in to our curated collection of videos and podcasts where we share valuable insights, expert interviews, and the latest updates on AI agents and crypto."
      />
      <SectionWrapper backgroundType="SUBTLE_GRADIENT">
        <Videos isLoading={isLoading} videos={videos} />
      </SectionWrapper>
    </PageWrapper>
  );
};

export default VideosPage;
