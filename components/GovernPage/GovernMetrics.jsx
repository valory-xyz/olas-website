import {
  getVeOlasCirculatingSupply,
  getVeOlasHolders,
} from 'common-util/api/flipside';
import {
  FLIPSIDE_LOCKED_OLAS_QUERY_URL,
  FLIPSIDE_VEOLAS_HOLDERS_QUERY_URL,
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
          source: FLIPSIDE_LOCKED_OLAS_QUERY_URL,
          metric: Math.round(metrics[0]),
        },
        {
          key: 'veOlasHolders',
          imageSrc: 'veolas-holders.png',
          labelText: 'Total veOLAS holders',
          source: FLIPSIDE_VEOLAS_HOLDERS_QUERY_URL,
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
