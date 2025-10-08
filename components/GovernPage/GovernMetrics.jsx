import {
  getActiveVeOlasHolders,
  getVeOlasLockedBalance,
} from 'common-util/api';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { fetchMetrics, MetricsCard } from 'components/MetricsCard';
import { usePersistentSWR } from 'hooks';
import { useMemo } from 'react';

export const GovernMetrics = () => {
  const { data: metrics } = usePersistentSWR('governMetrics', () =>
    fetchMetrics([getVeOlasLockedBalance, getActiveVeOlasHolders]),
  );

  const governData = useMemo(() => {
    if (!metrics) return null;

    return {
      role: 'govern',
      displayMetrics: [
        {
          key: 'lockedOlas',
          imageSrc: 'locked-olas.png',
          labelText: 'OLAS locked in veOLAS',
          source: '/data#govern-veolas',
          metric: Math.round(metrics[0]),
          isExternal: false,
        },
        {
          key: 'veOlasHolders',
          imageSrc: 'veolas-holders.png',
          labelText: 'Total veOLAS holders',
          source: '/data#govern-veolas',
          metric: metrics[1],
          isExternal: false,
        },
      ],
    };
  }, [metrics]);

  if (!governData) {
    return null;
  }

  return (
    <SectionWrapper id="stats" customClasses="mt-16">
      <MetricsCard metrics={governData} />
    </SectionWrapper>
  );
};
