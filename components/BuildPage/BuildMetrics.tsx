import { getBuildMetrics } from 'common-util/api';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { fetchMetrics, MetricsCard } from 'components/MetricsCard';
import { usePersistentSWR } from 'hooks';

export const BuildMetrics = () => {
  // @ts-expect-error TS(2554) FIXME: Expected 3 arguments, but got 2.
  const { data: metrics } = usePersistentSWR('buildMetrics', () =>
    fetchMetrics([getBuildMetrics]),
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
          source: '/data#builders',
          isExternal: false,
          metric: metrics?.[0]?.data?.totalBuilders,
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
