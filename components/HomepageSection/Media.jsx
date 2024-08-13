import PropTypes from 'prop-types';

import { VideoPropTypes } from 'common-util/propTypes';
import { getVideos } from 'common-util/api';
import { Videos } from 'components/Content/Videos';
import Articles from 'components/Content/Articles';
import SectionWrapper from 'components/Layout/SectionWrapper';

export async function getServerSideProps() {
  const videos = await getVideos();
  return {
    props: { videos },
  };
}

const Media = ({ videos }) => (
  <SectionWrapper
    backgroundType="SUBTLE_GRADIENT"
    customClasses="px-8 py-12 lg:p-24 border-b"
  >
    <div className="max-w-screen-xl mx-auto flex flex-col gap-10">
      <Videos videos={videos} limit={3} />
      <Articles limit={3} tagFilter="bonds" showSeeAll />
    </div>
  </SectionWrapper>
);

Media.propTypes = {
  videos: PropTypes.arrayOf(VideoPropTypes),
};

Media.defaultProps = {
  videos: [],
};

export default Media;
