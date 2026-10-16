import { REVALIDATE_DURATION } from 'common-util/constants';
import { getSiteUrl } from 'common-util/getSiteUrl';
import { buildVideoGallery } from 'common-util/structured-data';
import { fetchVideos, useFetchVideos } from 'common-util/useFetchApi';
import Videos, { videoHref } from 'components/Content/Videos';
import { JsonLd } from 'components/JsonLd';
import PageWrapper from 'components/Layout/PageWrapper';
import SectionWrapper from 'components/Layout/SectionWrapper';
import Meta from 'components/Meta';

const VideosPage = ({ gallery }) => {
  const { videos, isLoading } = useFetchVideos({});

  return (
    <PageWrapper>
      {gallery && <JsonLd data={gallery} />}
      <Meta
        pageTitle="Videos"
        description="Tune in to our curated collection of videos and podcasts where we share valuable insights, expert interviews, and the latest updates on AI agents and crypto."
      />
      <SectionWrapper backgroundType="SUBTLE_GRADIENT">
        <h1 className="mb-4 text-3xl lg:text-5xl tracking-tight font-extrabold text-gray-900 ">
          Videos & Podcasts
        </h1>
        <Videos isLoading={isLoading} videos={videos} isMain />
      </SectionWrapper>
    </PageWrapper>
  );
};

// The cards load in the browser; the VideoGallery names the same items in the served HTML.
export const getStaticProps = async () => ({
  props: {
    gallery: buildVideoGallery({
      siteUrl: getSiteUrl(),
      path: '/videos',
      name: 'Videos & Podcasts',
      entries: (await fetchVideos()).map((video) => ({
        name: video.title,
        url: videoHref(video),
        date: video.date,
      })),
    }),
  },
  revalidate: REVALIDATE_DURATION,
});

export default VideosPage;
