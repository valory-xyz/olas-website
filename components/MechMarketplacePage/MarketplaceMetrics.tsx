import SectionWrapper from 'components/Layout/SectionWrapper';
import { MetricsCard } from 'components/MetricsCard';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';

export const MarketplaceMetrics = ({ metrics }) => {
  const { mechFees, ataTransactions } = metrics ?? {};

  const marketplaceData = useMemo(() => {
    return [
      {
        role: 'marketplace',
        displayMetrics: [
          {
            key: 'mechFees',
            labelText: 'Total Marketplace Turnover',
            metric: mechFees?.value ? Number(mechFees.value).toFixed(0) : null,
            status: mechFees?.status,
            isMoney: true,
            source: '/data#mech-turnover',
            isExternal: false,
            imageSrc: '/images/marketplace-page/money-bag.png',
            imageWidth: 24,
          },
          {
            key: 'ataTransactions',
            labelText: 'Total A2A Transactions',
            metric: ataTransactions?.value,
            status: ataTransactions?.status,
            isMoney: false,
            source: '/data#ata-transactions',
            isExternal: false,
            imageSrc: '/images/marketplace-page/agent-to-agent.png',
            imageWidth: 80,
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
          <ChevronRight size={20} />
        </Link>
      </div>
    </SectionWrapper>
  );
};
