import { getMainMetrics } from 'common-util/api';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { MetricsCard } from 'components/MetricsCard';
import { usePersistentSWR } from 'hooks';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';

export const MarketplaceMetrics = () => {
  const { data: metrics } = usePersistentSWR('mainMetrics', getMainMetrics);
  const { mechFees, ataTransactions } = metrics?.data ?? {};

  const marketplaceData = useMemo(() => {
    return [
      {
        role: 'marketplace',
        displayMetrics: [
          {
            key: 'mechFees',
            labelText: 'Total Marketplace Turnover',
            metric: mechFees ? Number(mechFees).toFixed(0) : null,
            isMoney: true,
            source: '/data#mech-turnover',
            isExternal: false,
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
            metric: ataTransactions,
            isMoney: false,
            source: '/data#ata-transactions',
            isExternal: false,
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
  }, [mechFees, ataTransactions]);

  return (
    <SectionWrapper id="stats" customClasses="mt-16">
      {marketplaceData.map((data, index) => (
        <MetricsCard key={index} metrics={data} />
      ))}
      <div className="mt-8 text-center">
        <Link
          href="/agent-economies/mech"
          className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium transition-colors"
        >
          More metrics on Mech Marketplace
          <svg
            className="ml-2 w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </SectionWrapper>
  );
};
