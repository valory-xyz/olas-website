import { getVeOlasHolders } from 'common-util/api/dune';
import { getVeOLASCirculatingSupply } from 'common-util/api/flipside';
import {
  FLIPSIDE_URL,
  OLAS_ECONOMY_DASHBOARD_URL,
} from 'common-util/constants';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { fetchMetrics, MetricsCard } from 'components/MetricsCard';
import { usePersistentSWR } from 'hooks';

export const GovernMetrics = () => {
  const { data: lockedOlasMetrics } = usePersistentSWR(
    'governLockedOlasMetrics',
    () => fetchMetrics(getVeOLASCirculatingSupply),
  );
  const { data: veOlasHoldersMetrics } = usePersistentSWR(
    'governVeOlasHoldersMetrics',
    () => fetchMetrics(getVeOlasHolders),
  );

  const governData = [
    {
      role: 'govern',
      displayMetrics: [
        {
          key: 'lockedOlas',
          imageSrc: 'locked-olas.png',
          labelText: 'OLAS locked in veOLAS',
          source: `${FLIPSIDE_URL}?tabIndex=3`,
          metric: lockedOlasMetrics,
        },
        {
          key: 'veOlasHolders',
          imageSrc: 'veolas-holders.png',
          labelText: 'Total veOLAS holders',
          source: `${OLAS_ECONOMY_DASHBOARD_URL}#govern-donations-to-useful-services`,
          metric: veOlasHoldersMetrics,
        },
      ],
    },
  ];

  return (
    <SectionWrapper customClasses="mt-16">
      {governData.map((data, index) => (
        <MetricsCard key={index} data={data} />
      ))}
    </SectionWrapper>
  );
};
