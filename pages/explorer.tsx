import { DaaSeriesPoint, generateMockDaaSeries } from 'common-util/explorer';
import Explorer from 'components/ExplorerPage';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';

type ExplorerPageProps = {
  omenstratDaa: DaaSeriesPoint[];
};

const ExplorerPage = ({ omenstratDaa }: ExplorerPageProps) => (
  <PageWrapper>
    <Meta
      pageTitle="Explore agent-economy activity"
      description="A visual, time-aware view of agent-economy activity."
    />
    <Explorer omenstratDaa={omenstratDaa} />
  </PageWrapper>
);

export const getStaticProps = async () => ({
  props: {
    omenstratDaa: generateMockDaaSeries(730),
  },
});

export default ExplorerPage;
