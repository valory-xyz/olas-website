import {
  getVeOlasCirculatingSupply,
  getVeOlasHolders,
} from 'common-util/api/flipside';
import { FLIPSIDE_QUERY_URL } from 'common-util/constants';
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
          source: `${FLIPSIDE_QUERY_URL}ORaUMVaQVovq/veolas/visualizations/v2/a437de1b-5d22-4139-82b8-b51cd1b07848`,
          metric: Math.round(metrics[0]),
        },
        {
          key: 'veOlasHolders',
          imageSrc: 'veolas-holders.png',
          labelText: 'Total veOLAS holders',
          source: `${FLIPSIDE_QUERY_URL}6ANzqADDc8VL/total-veolas-holders/visualizations/v2/939139ef-5597-4058-8e85-38e406cb6387`,
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
