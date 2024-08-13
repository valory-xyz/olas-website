import { Videos } from 'components/Content/Videos';
import Articles from 'components/Content/Articles';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { useFetchVideos } from 'common-util/useFetchApi';

const Media = () => {
  const { videos, isLoading } = useFetchVideos(3);

  return (
    <SectionWrapper
      backgroundType="SUBTLE_GRADIENT"
      customClasses="px-8 py-12 lg:p-24 border-b"
    >
      <div className="max-w-screen-xl mx-auto flex flex-col gap-10">
        <Videos isLoading={isLoading} videos={videos} limit={3} />
        <Articles limit={3} tagFilter="bonds" showSeeAll />
      </div>
    </SectionWrapper>
  );
};

export default Media;
