import type { ExplorerMetricsData, ExplorerSeries } from 'common-util/api/explorer';
import type { MetricStatus } from 'common-util/graphql/types';
import { getSnapshot } from 'common-util/snapshot-storage';
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
  // Read the daily explorer snapshot (Vercel Blob, written by the explorer cron),
  // not the subgraph — so visits/ISR never hit the registry directly.
  const snapshot = await getSnapshot({ category: 'explorer' });
  const metric = (snapshot?.data as ExplorerMetricsData)?.omenstrat ?? null;

  return {
    props: {
      series: metric?.value ?? { daa: [], transactions: [] },
      status: metric?.status ?? null,
    },
    // Snapshot refreshes daily; revalidate hourly so the (future) predict-derived
    // Accuracy/ROI tiles can stay hourly-fresh without a new explorer job.
    revalidate: 60 * 60,
  };
};

export default ExplorerPage;
