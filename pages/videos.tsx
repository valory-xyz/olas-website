import { useFetchVideos } from 'common-util/useFetchApi';
import Videos from 'components/Content/Videos';
import PageWrapper from 'components/Layout/PageWrapper';
import SectionWrapper from 'components/Layout/SectionWrapper';
import Meta from 'components/Meta';

const VideosPage = () => {
  const { videos, isLoading } = useFetchVideos({});

  return (
    <PageWrapper>
      <Meta
        pageTitle="Videos"
        description="Tune in to our curated collection of videos and podcasts where we share valuable insights, expert interviews, and the latest updates on AI agents and crypto."
      />
      <SectionWrapper backgroundType="SUBTLE_GRADIENT">
        <h1 className="mb-4 text-3xl lg:text-5xl tracking-tight font-extrabold text-gray-900 ">
          Videos & Podcasts
        </h1>
        {/* @ts-expect-error TS(2322) FIXME: Type '{ isLoading: boolean; videos: any; isMain: t... Remove this comment to see the full error message */}{' '}
        <Videos isLoading={isLoading} videos={videos} isMain />
      </SectionWrapper>
    </PageWrapper>
  );
};

export default VideosPage;
