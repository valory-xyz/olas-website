import { SUB_HEADER_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Tag } from 'components/ui/tag';

export const OlasMission = () => (
  <SectionWrapper
    id="olas-mission"
    backgroundType="NONE"
    customClasses="relative bg-[url('/images/about/mission-background.svg')] bg-repeat bg-top px-8"
  >
    <div className="absolute inset-0 bg-[#7522CE80]" />
    <div className="max-w-[1096px] mx-auto relative text-white py-12 md:py-20">
      <Tag variant="white" className="mb-6">
        Olas Mission
      </Tag>
      <p className={SUB_HEADER_CLASS}>
        To incentivize and coordinate different parties to launch autonomous
        agents that form entire AI economies serving all humans
      </p>
    </div>
  </SectionWrapper>
);
