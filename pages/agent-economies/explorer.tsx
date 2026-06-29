import type { ExplorerMetricsData } from 'common-util/api/explorer';
import { getSnapshot } from 'common-util/snapshot-storage';
import Explorer, { type ExplorerEconomies } from 'components/ExplorerPage';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';

type ExplorerPageProps = {
  economies: ExplorerEconomies;
};

const ExplorerPage = ({ economies }: ExplorerPageProps) => (
  <PageWrapper>
    <Meta
      pageTitle="Explore agent-economy activity"
      description="A visual, time-aware view of agent-economy activity."
    />
    <Explorer economies={economies} />
  </PageWrapper>
);

export const getStaticProps = async () => {
  // Read the daily explorer snapshot (Vercel Blob, written by the explorer cron),
  // not the subgraph — so visits/ISR never hit the registry directly.
  const snapshot = await getSnapshot({ category: 'explorer' });
  const data = snapshot?.data as ExplorerMetricsData | undefined;

  const economies: ExplorerEconomies = {
    predict: {
      omenstrat: {
        series: data?.omenstrat?.value ?? { daa: [], transactions: [], accuracy: [], roi: [] },
        status: data?.omenstrat?.status ?? null,
      },
    },
    babydegen: {
      optimus: {
        series: data?.babydegenOptimus?.value ?? { daa: [], transactions: [], aum: [] },
        status: data?.babydegenOptimus?.status ?? null,
      },
      modius: {
        series: data?.babydegenModius?.value ?? { daa: [], transactions: [], aum: [] },
        status: data?.babydegenModius?.status ?? null,
      },
    },
  };

  return {
    props: { economies },
    // Snapshot refreshes daily; revalidate hourly so the (future) predict-derived
    // Accuracy/ROI tiles can stay hourly-fresh without a new explorer job.
    revalidate: 60 * 60,
  };
};

export default ExplorerPage;
