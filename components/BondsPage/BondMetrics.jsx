import {
  getTotalProtocolOwnedLiquidity,
  getTotalProtocolRevenue,
} from 'common-util/api/flipside';
import { FLIPSIDE_URL } from 'common-util/constants';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { fetchMetrics, MetricsCard } from 'components/MetricsCard';
import { usePersistentSWR } from 'hooks';

export const BondMetrics = () => {
  const { data: liquidityMetrics } = usePersistentSWR(
    'bondLiquidityMetrics',
    () => fetchMetrics(getTotalProtocolOwnedLiquidity),
  );
  const { data: feesMetrics } = usePersistentSWR('bondFeesMetrics', () =>
    fetchMetrics(getTotalProtocolRevenue),
  );

  const bondData = [
    {
      role: 'bonds',
      displayMetrics: [
        {
          key: 'liquidity',
          imageSrc: 'liquidity.png',
          labelText: 'Total Protocol-owned Liquidity',
          source: `${FLIPSIDE_URL}?tabIndex=2`,
          metric: liquidityMetrics,
          isMoney: true,
        },
        {
          key: 'fees',
          imageSrc: 'protocol-fees.png',
          labelText: 'Fees from Protocol-owned Liquidity',
          source: `${FLIPSIDE_URL}?tabIndex=2`,
          metric: feesMetrics,
          isMoney: true,
        },
      ],
    },
  ];

  return (
    <SectionWrapper customClasses="mt-16">
      {bondData.map((data, index) => (
        <MetricsCard key={index} data={data} />
      ))}
    </SectionWrapper>
  );
};
