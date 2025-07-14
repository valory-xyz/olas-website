import {
  getTotalProtocolOwnedLiquidity,
  getTotalProtocolRevenue,
} from 'common-util/api/dune';
import {
  DUNE_TOTAL_LIQUIDITY_URL,
  DUNE_TOTAL_PROTOCOL_REVENUE_URL,
} from 'common-util/constants';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { fetchMetrics, MetricsCard } from 'components/MetricsCard';
import { usePersistentSWR } from 'hooks';

export const BondMetrics = () => {
  const { data: metrics } = usePersistentSWR('bondMetrics', () =>
    fetchMetrics([getTotalProtocolOwnedLiquidity, getTotalProtocolRevenue]),
  );
  if (!metrics) {
    return null;
  }

  const bondData = [
    {
      role: 'bonds',
      displayMetrics: [
        {
          key: 'liquidity',
          imageSrc: 'liquidity.png',
          labelText: 'Total Protocol-owned Liquidity',
          source: DUNE_TOTAL_LIQUIDITY_URL,
          metric: Math.round(metrics[0]),
          isMoney: true,
        },
        {
          key: 'fees',
          imageSrc: 'protocol-fees.png',
          labelText: 'Fees from Protocol-owned Liquidity',
          source: DUNE_TOTAL_PROTOCOL_REVENUE_URL,
          metric: Math.round(metrics[1]),
          isMoney: true,
        },
      ],
    },
  ];

  return (
    <SectionWrapper id="stats" customClasses="mt-16">
      {bondData.map((data, index) => (
        <MetricsCard key={index} metrics={data} />
      ))}
    </SectionWrapper>
  );
};
