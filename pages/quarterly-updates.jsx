import { BlogBackButton } from 'components/BlogBackButton';
import { Updates } from 'components/Content/Updates';
import PageWrapper from 'components/Layout/PageWrapper';
import SectionWrapper from 'components/Layout/SectionWrapper';
import Meta from 'components/Meta';

const UpdatesPage = () => (
  <PageWrapper>
    <Meta
      pageTitle="Quarterly Updates"
      description="Stay informed with our latest quarterly updates, featuring key insights, progress reports, and upcoming developments."
    />
    <SectionWrapper>
      <BlogBackButton />
      <h1 className="mb-8 text-3xl lg:text-5xl tracking-tight font-extrabold text-gray-900 ">
        Quarterly Updates
      </h1>
      <Updates isMain={true} />
    </SectionWrapper>
  </PageWrapper>
);

export default UpdatesPage;
