import { DUNE_TOTAL_LIQUIDITY_URL, DUNE_TOTAL_PROTOCOL_REVENUE_URL } from 'common-util/constants';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { MetricsCard } from 'components/MetricsCard';
import { useMemo } from 'react';

export const BondMetrics = ({ metrics }) => {
  const protocolMetrics = metrics?.protocol;

  const bondData = useMemo(() => {
    if (!protocolMetrics) return null;

    return [
      {
        role: 'bonds',
        displayMetrics: [
          {
            key: 'liquidity',
            imageSrc: 'liquidity.png',
            labelText: 'Total Protocol-owned Liquidity',
            source: DUNE_TOTAL_LIQUIDITY_URL,
            metric: Math.round(protocolMetrics.totalProtocolOwnedLiquidity?.value),
            status: protocolMetrics.totalProtocolOwnedLiquidity?.status,
            isMoney: true,
          },
          {
            key: 'fees',
            imageSrc: 'protocol-fees.png',
            labelText: 'Fees from Protocol-owned Liquidity',
            source: DUNE_TOTAL_PROTOCOL_REVENUE_URL,
            metric: Math.round(protocolMetrics.totalProtocolRevenue?.value),
            status: protocolMetrics.totalProtocolRevenue?.status,
            isMoney: true,
          },
        ],
      },
    ];
  }, [protocolMetrics]);

  if (!bondData) return null;

  return (
    <SectionWrapper id="stats" customClasses="mt-16">
      {bondData.map((data, index) => (
        <MetricsCard key={index} metrics={data} />
      ))}
    </SectionWrapper>
  );
};
