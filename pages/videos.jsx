/* eslint-disable camelcase */
import get from 'lodash/get';

import { getVideos } from 'common-util/api';
import PageWrapper from 'components/Layout/PageWrapper';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Videos } from 'components/Content/Videos';
import Meta from 'components/Meta';
import { transformVideosFromApi } from 'common-util/transformApi';

export async function getServerSideProps() {
  const videosResponse = await getVideos();

  return {
    props: {
      videos: transformVideosFromApi(videosResponse),
    },
  };
}

const VideosPage = ({ videos }) => (
  <PageWrapper>
    <Meta pageTitle="Videos" />
    <SectionWrapper backgroundType="SUBTLE_GRADIENT"><Videos videos={videos} /></SectionWrapper>
  </PageWrapper>
);

export default VideosPage;
