import { CONTRIBUTE_URL } from 'common-util/constants';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { MetricsCard } from 'components/MetricsCard';
import { useMemo } from 'react';

export const ContributeMetrics = ({ metrics, snapshotTimestamp = null }) => {
  const contributeMetrics = metrics?.contribute;

  const contributeData = useMemo(() => {
    if (!contributeMetrics) return null;

    return [
      {
        role: 'contribute',
        displayMetrics: [
          {
            key: 'totalContribute',
            imageSrc: 'contributors.png',
            labelText: 'Total Olas Contributors',
            source: CONTRIBUTE_URL,
            metric: contributeMetrics.totalOlasContributors?.value,
            status: contributeMetrics.totalOlasContributors?.status,
            context: {
              noun: 'Olas contributors registered via the Contribute app',
              window: 'all time',
            },
          },
          {
            key: 'DailyContribute',
            imageSrc: 'DAC.png',
            imageWidth: 72,
            labelText: 'Daily Active Contributors',
            source: '/data#contribute-daily-active-agents',
            metric: contributeMetrics.dailyActiveContributors?.value,
            status: contributeMetrics.dailyActiveContributors?.status,
            isExternal: false,
            context: {
              noun: 'daily active Contribute agents, measured as unique multisigs active each day',
              window: '7-day average',
            },
          },
        ],
      },
    ];
  }, [contributeMetrics]);

  if (!contributeData) return null;

  return (
    <SectionWrapper customClasses="pt-16 pb-8">
      {contributeData.map((data, index) => (
        <MetricsCard key={index} metrics={data} snapshotTimestamp={snapshotTimestamp} />
      ))}
    </SectionWrapper>
  );
};
