import SectionWrapper from 'components/Layout/SectionWrapper';
import { MetricsCard } from 'components/MetricsCard';
import { useMemo } from 'react';

export const GovernMetrics = ({ metrics, snapshotTimestamp = null }) => {
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
          metric: Math.round(governMetrics.lockedOlas?.value),
          status: governMetrics.lockedOlas?.status,
          isExternal: false,
          context: {
            noun: 'currently locked as veOLAS for governance',
            unit: 'OLAS',
            window: 'current total, not cumulative',
          },
        },
        {
          key: 'veOlasHolders',
          imageSrc: 'veolas-holders.png',
          labelText: 'Total veOLAS holders',
          source: '/data#govern-veolas',
          metric: governMetrics.activeHolders?.value,
          status: governMetrics.activeHolders?.status,
          isExternal: false,
          context: {
            noun: 'addresses currently holding veOLAS',
            window: 'current total, not cumulative',
          },
        },
      ],
    };
  }, [governMetrics]);

  if (!governData) {
    return null;
  }

  return (
    <SectionWrapper id="stats" customClasses="mt-16">
      <MetricsCard metrics={governData} snapshotTimestamp={snapshotTimestamp} />
    </SectionWrapper>
  );
};
