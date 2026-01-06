import { getContributeMetrics } from 'common-util/api';
import { CONTRIBUTE_URL } from 'common-util/constants';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { fetchMetrics, MetricsCard } from 'components/MetricsCard';
import { usePersistentSWR } from 'hooks';

export const ContributeMetrics = () => {
  const { data: metrics } = usePersistentSWR('contributeMetrics', () =>
    fetchMetrics([getContributeMetrics]),
  );

  if (!metrics) {
    return null;
  }

  const contributeData = [
    {
      role: 'contribute',
      displayMetrics: [
        {
          key: 'totalContribute',
          imageSrc: 'contributors.png',
          labelText: 'Total Olas Contributors',
          source: CONTRIBUTE_URL,
          metric: metrics[0]?.data?.totalOlasContributors,
        },
        {
          key: 'DailyContribute',
          imageSrc: 'DAC.png',
          imageWidth: 72,
          labelText: 'Daily Active Contributors',
          source: '/data#contribute-daily-active-agents',
          metric: metrics[0]?.data?.dailyActiveContributors,
          isExternal: false,
        },
      ],
    },
  ];

  return (
    <SectionWrapper customClasses="pt-16 pb-8">
      {contributeData.map((data, index) => (
        <MetricsCard key={index} metrics={data} />
      ))}
    </SectionWrapper>
  );
};
