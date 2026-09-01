import SectionWrapper from 'components/Layout/SectionWrapper';
import { MetricsCard } from 'components/MetricsCard';
import { useMemo } from 'react';

export const BuildMetrics = ({ metrics, snapshotTimestamp = null }) => {
  const buildMetrics = metrics?.build;

  const buildData = useMemo(
    () => [
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
            metric: buildMetrics?.totalBuilders?.value,
            status: buildMetrics?.totalBuilders?.status,
            context: {
              noun: 'unique builders who have developed on the Olas Stack',
              window: 'all time',
            },
          },
        ],
      },
    ],
    [buildMetrics]
  );

  return (
    <SectionWrapper id="stats" customClasses="border-b-1.5 py-16">
      {buildData.map((data, index) => (
        <MetricsCard key={index} metrics={data} snapshotTimestamp={snapshotTimestamp} />
      ))}
    </SectionWrapper>
  );
};
