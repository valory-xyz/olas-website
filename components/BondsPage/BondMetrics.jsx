import {
  getTotalProtocolOwnedLiquidity,
  getTotalProtocolRevenue,
} from 'common-util/api/flipside';
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
          source: `${FLIPSIDE_QUERY_URL}EVHMVqzqhIvF/total/visualizations/v2/2d31feb6-a661-4103-ba09-02f60d3d28e8`,
          metric: Math.round(metrics[0]),
          isMoney: true,
        },
        {
          key: 'fees',
          imageSrc: 'protocol-fees.png',
          labelText: 'Fees from Protocol-owned Liquidity',
          source: `${FLIPSIDE_QUERY_URL}0H0TnBLIMXjf/olas-total-protocol-revenue-from-lp-new/visualizations/fa540a62-ac0b-4030-9b43-26d1d7faa454`,
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
