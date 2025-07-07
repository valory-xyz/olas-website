import {
  getVeOlasCirculatingSupply,
  getVeOlasHolders,
} from 'common-util/api/dune';
import {
  DUNE_OLAS_LOCKED_URL,
  DUNE_VEOLAS_HOLDERS_URL,
} from 'common-util/constants';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { fetchMetrics, MetricsCard } from 'components/MetricsCard';
import { usePersistentSWR } from 'hooks';

export const GovernMetrics = () => {
  const { data: metrics } = usePersistentSWR('governMetrics', () =>
    fetchMetrics([getVeOlasCirculatingSupply, getVeOlasHolders]),
  );

  if (!metrics) {
    return null;
  }

  const governData = [
    {
      role: 'govern',
      displayMetrics: [
        {
          key: 'lockedOlas',
          imageSrc: 'locked-olas.png',
          labelText: 'OLAS locked in veOLAS',
          source: DUNE_OLAS_LOCKED_URL,
          metric: Math.round(metrics[0]),
        },
        {
          key: 'veOlasHolders',
          imageSrc: 'veolas-holders.png',
          labelText: 'Total veOLAS holders',
          source: DUNE_VEOLAS_HOLDERS_URL,
          metric: metrics[1],
        },
      ],
    },
  ];

  return (
    <SectionWrapper id="stats" customClasses="mt-16">
      {governData.map((data, index) => (
        <MetricsCard key={index} metrics={data} />
      ))}
    </SectionWrapper>
  );
};
