import { getTotalUniqueBuilders } from 'common-util/api/dune';
import { OLAS_ECONOMY_DASHBOARD_URL } from 'common-util/constants';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { fetchMetrics, MetricsCard } from 'components/MetricsCard';
import { usePersistentSWR } from 'hooks';

export const BuildMetrics = () => {
  const { data: metrics } = usePersistentSWR('buildMetrics', () =>
    fetchMetrics([getTotalUniqueBuilders]),
  );

  const buildData = [
    {
      role: 'build',
      displayMetrics: [
        {
          key: 'build',
          role: 'build',
          imageSrc: 'builders.png',
          labelText: 'Total Olas Builders',
          subText: 'Developing on the Olas Stack',
          source: `${OLAS_ECONOMY_DASHBOARD_URL}#builders`,
          metric: metrics,
        },
      ],
    },
  ];

  return (
    <SectionWrapper id="stats" customClasses="border-b-1.5 py-16">
      {buildData.map((data, index) => (
        <MetricsCard key={index} metrics={data} />
      ))}
    </SectionWrapper>
  );
};
