import PropTypes from 'prop-types';

import { VideoPropTypes } from 'common-util/propTypes';
import { getVideos } from 'common-util/api';
import { transformVideosFromApi } from 'common-util/transformApi';
import PageWrapper from 'components/Layout/PageWrapper';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Videos } from 'components/Content/Videos';
import Meta from 'components/Meta';

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
    <SectionWrapper backgroundType="SUBTLE_GRADIENT">
      <Videos videos={videos} />
    </SectionWrapper>
  </PageWrapper>
);

VideosPage.propTypes = {
  videos: PropTypes.arrayOf(VideoPropTypes),
};

VideosPage.defaultProps = {
  videos: [],
};

export default VideosPage;
