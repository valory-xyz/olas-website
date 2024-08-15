import PageWrapper from 'components/Layout/PageWrapper';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Videos } from 'components/Content/Videos';
import Meta from 'components/Meta';
import { useFetchVideos } from 'common-util/useFetchApi';

const VideosPage = () => {
  const { videos, isLoading } = useFetchVideos();

  return (
    <PageWrapper>
      <Meta pageTitle="Videos" />
      <SectionWrapper backgroundType="SUBTLE_GRADIENT">
        <Videos isLoading={isLoading} videos={videos} />
      </SectionWrapper>
    </PageWrapper>
  );
};

export default VideosPage;
