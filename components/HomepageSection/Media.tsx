import { useFetchVideos } from 'common-util/useFetchApi';
import Articles from 'components/Content/Articles';
import { Videos } from 'components/Content/Videos';
import SectionWrapper from 'components/Layout/SectionWrapper';

const LIMIT = 3;

const Media = () => {
  const { videos, isLoading } = useFetchVideos({ limit: LIMIT });

  return (
    <SectionWrapper
      id="videos-and-podcasts"
      backgroundType="NONE"
      customClasses="px-4 md:px-8 py-12 lg:p-24 border-b bg-slate-100"
    >
      <div className="max-w-screen-xl mx-auto flex flex-col gap-20">
        <Videos isLoading={isLoading} videos={videos} limit={LIMIT} />
        <div id="blog">
          <Articles limit={LIMIT} showSeeAll isMain={false} displayFolders={false} />
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Media;
