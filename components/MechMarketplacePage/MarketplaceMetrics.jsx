import { getMarketplaceMetrics } from 'common-util/api';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { MetricsCard } from 'components/MetricsCard';
import { usePersistentSWR } from 'hooks';
import Image from 'next/image';
import { useMemo } from 'react';

export const MarketplaceMetrics = () => {
  const { data: metrics } = usePersistentSWR(
    'marketplaceMetrics',
    getMarketplaceMetrics,
  );

  const marketplaceData = useMemo(() => {
    return [
      {
        role: 'marketplace',
        displayMetrics: [
          {
            key: 'mechFees',
            labelText: 'Total Marketplace Turnover',
            metric: metrics?.mechFees
              ? Number(metrics.mechFees).toFixed(0)
              : null,
            isMoney: true,
            source: '/data#mech-turnover',
            image: (
              <Image
                src="/images/marketplace-page/money-bag.png"
                alt="A2A"
                width={24}
                height={24}
              />
            ),
          },
          {
            key: 'ataTransactions',
            labelText: 'Total A2A Transactions',
            metric: metrics?.ataTransactions,
            isMoney: false,
            source: '/data#ata-transactions',
            image: (
              <Image
                src="/images/marketplace-page/agent-to-agent.png"
                alt="A2A"
                width={80}
                height={48}
              />
            ),
          },
        ],
      },
    ];
  }, [metrics]);

  return (
    <SectionWrapper id="stats" customClasses="mt-16">
      {marketplaceData.map((data, index) => (
        <MetricsCard key={index} metrics={data} />
      ))}
    </SectionWrapper>
  );
};
