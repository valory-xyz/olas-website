import SectionWrapper from 'components/Layout/SectionWrapper';
import { MetricsCard } from 'components/MetricsCard';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';

export const MarketplaceMetrics = ({ metrics, snapshotTimestamp = null }) => {
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
            imageSrc: 'money-bag.png',
            imageWidth: 24,
            context: {
              // One canonical name, with the aliases named so the four labels
              // across the site resolve to a single metric rather than four.
              noun: 'in Olas marketplace turnover — the total fees collected from the Mech Marketplace, also shown elsewhere as "Total Task Payments", "Mech Turnover" and "turnover"',
              window: 'all time',
            },
          },
          {
            key: 'ataTransactions',
            labelText: 'Total A2A Transactions',
            metric: ataTransactions?.value,
            status: ataTransactions?.status,
            isMoney: false,
            source: '/data#ata-transactions',
            isExternal: false,
            imageSrc: 'agent-to-agent.png',
            imageWidth: 80,
            context: {
              noun: 'agent-to-agent transactions — a subset of total Olas agent transactions, not the same figure',
              scope: 'across Gnosis, Base, Polygon and Optimism',
              window: 'all time',
            },
          },
        ],
      },
    ];
  }, [mechFees, ataTransactions]);

  return (
    <SectionWrapper id="stats" customClasses="mt-16">
      {marketplaceData.map((data, index) => (
        <MetricsCard key={index} metrics={data} snapshotTimestamp={snapshotTimestamp} />
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
