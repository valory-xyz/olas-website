/* eslint-disable react/no-unescaped-entities */
import PageWrapper from 'components/Layout/PageWrapper';
import SectionWrapper from 'components/Layout/SectionWrapper';
import SectionHeading from 'components/SectionHeading';
import Meta from 'components/Meta';

const PearlTerms = () => (
  <PageWrapper>
    <Meta pageTitle="Disclaimer" />
    <SectionWrapper backgroundType="SUBTLE_GRADIENT">
      <article className="max-w-[800px] mx-auto">
        <SectionHeading size="text-4xl lg:text-2xl" color="text-purple-950">
          Pearl Terms
        </SectionHeading>
        <div className="text-xl text-gray-600">
          <ol className="list-decimal">
            <li>TODO</li>
          </ol>
        </div>
      </article>
    </SectionWrapper>
  </PageWrapper>
);

export default PearlTerms;
