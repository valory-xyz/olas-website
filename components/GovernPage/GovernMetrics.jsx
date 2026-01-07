import SectionWrapper from 'components/Layout/SectionWrapper';
import { MetricsCard } from 'components/MetricsCard';
import { useMemo } from 'react';

export const GovernMetrics = ({ metrics }) => {
  const governMetrics = metrics?.govern;

  const governData = useMemo(() => {
    if (!governMetrics) return null;

    return {
      role: 'govern',
      displayMetrics: [
        {
          key: 'lockedOlas',
          imageSrc: 'locked-olas.png',
          labelText: 'OLAS locked in veOLAS',
          source: '/data#govern-veolas',
          metric: Math.round(governMetrics.lockedOlas),
          isExternal: false,
        },
        {
          key: 'veOlasHolders',
          imageSrc: 'veolas-holders.png',
          labelText: 'Total veOLAS holders',
          source: '/data#govern-veolas',
          metric: governMetrics.activeHolders,
          isExternal: false,
        },
      ],
    };
  }, [governMetrics]);

  if (!governData) {
    return null;
  }

  return (
    <SectionWrapper id="stats" customClasses="mt-16">
      <MetricsCard metrics={governData} />
    </SectionWrapper>
  );
};
