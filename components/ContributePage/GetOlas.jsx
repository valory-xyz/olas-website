import {
  SECTION_BOX_CLASS,
  SUB_HEADER_CLASS,
  TEXT_CLASS,
} from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import Image from 'next/image';

const DESC =
  'Turn your passion for the Olas ecosystem into rewards. As an Olas Contributor, posts you share about Olas can earn you OLAS, while amplifying the reach and impact of the network. No complicated steps — just tweet, earn, and play a vital role in shaping the future of Olas.';

export const GetOlas = () => (
  <SectionWrapper id="about" customClasses={SECTION_BOX_CLASS}>
    <div className="grid max-w-[1180px] mx-auto lg:px-8 lg:grid-cols-12">
      <h2
        className={`${SUB_HEADER_CLASS} mb-4 md:col-span-6 lg:mb-0 lg:col-span-4 lg:pr-6`}
      >
        Get OLAS for supporting Olas
      </h2>
      <p className={`${TEXT_CLASS} md:col-span-8 lg:pl-14`}>{DESC}</p>
    </div>

    <div className="mb-2 mt-6 lg:mt-8">
      <Image
        src="/images/contribute-page/get-olas.png"
        alt="contribute"
        width={1180}
        height={348}
        className="mx-auto"
        unoptimized
      />
    </div>
  </SectionWrapper>
);
