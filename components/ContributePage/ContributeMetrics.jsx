import { getTotalOlasContributors } from 'common-util/api';
import { get7DayAvgDailyActiveContributors } from 'common-util/api/dune';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { fetchMetrics, MetricsCard } from 'components/MetricsCard';
import { usePersistentSWR } from 'hooks';
import { CTA_LINK } from './utils';

export const ContributeMetrics = () => {
  const { data: metrics } = usePersistentSWR('contributeMetrics', () =>
    fetchMetrics([getTotalOlasContributors, get7DayAvgDailyActiveContributors]),
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
          source: CTA_LINK,
          metric: metrics[0],
        },
        {
          key: 'DailyContribute',
          imageSrc: 'DAC.png',
          imageWidth: 72,
          labelText: 'Daily Active Contributors',
          source: 'https://dune.com/adrian0x/the-contribute-agent-economy',
          metric: metrics[1],
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
