import { fetchOmenstratExplorerSeries } from 'common-util/api/explorer';
import type { ExplorerSeries } from 'common-util/api/explorer';
import type { MetricStatus } from 'common-util/graphql/types';
import Explorer from 'components/ExplorerPage';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';

type ExplorerPageProps = {
  series: ExplorerSeries;
  status: MetricStatus | null;
};

const ExplorerPage = ({ series, status }: ExplorerPageProps) => (
  <PageWrapper>
    <Meta
      pageTitle="Explore agent-economy activity"
      description="A visual, time-aware view of agent-economy activity."
    />
    <Explorer series={series} status={status} />
  </PageWrapper>
);

export const getStaticProps = async () => {
  // Query the Gnosis registry subgraph directly — it retains daily history, so no
  // snapshot/cron is needed (and mergeWithFallback would clobber a series anyway).
  const { value, status } = await fetchOmenstratExplorerSeries();

  return {
    props: {
      series: value ?? { daa: [], transactions: [] },
      status,
    },
    // Registry data updates ~daily; revalidate hourly.
    revalidate: 60 * 60,
  };
};

export default ExplorerPage;
