import Academy from 'components/Academy';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';

const AcademyPage = () => (
  <PageWrapper>
    <Meta
      pageTitle="Academy"
      description="Learn more about our Dev Academy program and become an Olas agent Builder!"
    />
    <Academy />
  </PageWrapper>
);

export default AcademyPage;
