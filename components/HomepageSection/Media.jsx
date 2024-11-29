import { useFetchVideos } from 'common-util/useFetchApi';
import Articles from 'components/Content/Articles';
import { Videos } from 'components/Content/Videos';
import SectionWrapper from 'components/Layout/SectionWrapper';

const limit = 3;

const Media = () => {
  const { videos, isLoading } = useFetchVideos(limit);

  return (
    <SectionWrapper
      backgroundType="SUBTLE_GRADIENT"
      customClasses="px-4 md:px-8 py-12 lg:p-24 border-b"
    >
      <div className="max-w-screen-xl mx-auto flex flex-col gap-10">
        <Videos isLoading={isLoading} videos={videos} limit={limit} />
        <Articles limit={limit} tagFilter="bonds" showSeeAll />
      </div>
    </SectionWrapper>
  );
};

export default Media;
