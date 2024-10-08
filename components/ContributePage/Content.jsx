import SectionWrapper from 'components/Layout/SectionWrapper';
import { SUB_HEADER_CLASS } from 'common-util/classes';
import Articles from '../Content/Articles';
import Resources from '../Content/Resources';

const Content = () => (
  <SectionWrapper backgroundType="SUBTLE_GRADIENT">
    <div id="resources" />
    <div className="max-w-screen-xl mx-auto">
      <h1
        className={`${SUB_HEADER_CLASS} text-4xl font-black text-center lg:text-left lg:text-6xl text-gray-800 mb-12`}
      >
        Learn more about Olas Contribute
      </h1>
      <div className="mb-12">
        <Articles limit={3} tagFilter="contribute" showSeeAll />
      </div>
      <div className="mb-12">
        <Resources tagFilter="contribute" />
      </div>
    </div>
  </SectionWrapper>
);

export default Content;
