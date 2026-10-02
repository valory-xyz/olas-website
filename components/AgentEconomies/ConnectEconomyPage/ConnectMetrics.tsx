import Image from 'next/image';

import { isFrozen } from 'common-util/graphql/metric-utils';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Card } from 'components/ui/card';
import { MetricContext } from 'components/ui/MetricContext';
import { Popover } from 'components/ui/popover';
import { StaleIndicator } from 'components/ui/StaleIndicator';
import { Link } from 'components/ui/typography';

import { CONNECT_DATA_URL } from './constants';

const SCOPE = 'on Gnosis, Polygon and Robinhood Chain';

const TOTALS = [
  {
    id: 'marketplaceRequests',
    label: 'Olas Marketplace requests',
    noun: `requests Connect agents sent to AI agents on the Olas Marketplace ${SCOPE}`,
  },
  {
    id: 'onchainExecutions',
    label: 'Successful on-chain executions',
    noun: `successful transactions executed by Connect agents' Safes ${SCOPE}`,
  },
];

/** A number linking to its methodology on /data, greyed when frozen; "--" when absent. */
const MetricValue = ({ metric, className }) => {
  const value = metric?.value;
  if (typeof value !== 'number') return <span className={`text-purple-600 ${className}`}>--</span>;

  return (
    <span className="inline-flex items-center gap-2">
      <Link className={className} href={CONNECT_DATA_URL}>
        <span className={isFrozen(metric.status) ? 'text-gray-400' : ''}>
          {Math.floor(value).toLocaleString()}
        </span>
      </Link>
      <StaleIndicator status={metric.status} />
    </span>
  );
};

const flooredValue = (metric) =>
  typeof metric?.value === 'number' ? Math.floor(metric.value) : null;

export const ConnectMetrics = ({ metrics = null, snapshotTimestamp = null }) => (
  <SectionWrapper customClasses="px-4 pt-[120px] pb-10" id="stats">
    <div className="max-w-[646px] mx-auto flex flex-col gap-[40px]">
      <Card className="flex flex-col items-center gap-3 px-8 pt-6 pb-5 border border-purple-200 rounded-2xl bg-gradient-to-t from-[#F1DBFF] to-[#FDFAFF] w-full max-w-[424px] mx-auto text-center">
        <div className="flex items-center gap-3 text-lg">
          <Image
            alt="Connect DAAs"
            src="/images/connect-econ-page/connect-economy-logo-128.png"
            width="32"
            height="32"
          />
          Connect Agent Economy
        </div>
        <MetricValue metric={metrics?.dailyActiveAgents} className="font-bold text-5xl" />
        <div className="flex items-center gap-2 text-base">
          Daily Active Agents (DAAs) <Popover>7-day average Daily Active Agents</Popover>
        </div>
        <MetricContext
          label="Daily Active Agents (DAAs)"
          value={flooredValue(metrics?.dailyActiveAgents)}
          status={metrics?.dailyActiveAgents?.status}
          asOfFallback={snapshotTimestamp}
          noun={`daily active Connect agents ${SCOPE}`}
          window="7-day average"
        />

        <div className="flex items-center justify-center gap-2 w-full border-t border-purple-200 pt-4 mt-1 text-base">
          <MetricValue metric={metrics?.totalAgents} className="font-bold text-2xl" />
          Total Agents
          <Popover>Every Connect agent ever set up, whether or not still running</Popover>
        </div>
        <MetricContext
          label="Total Agents"
          value={flooredValue(metrics?.totalAgents)}
          status={metrics?.totalAgents?.status}
          asOfFallback={snapshotTimestamp}
          noun={`Connect agents ever set up ${SCOPE}`}
          window="all time"
        />
      </Card>

      <Card className="grid sm:grid-cols-2 max-sm:divide-y sm:divide-x divide-slate-200 py-8 border border-slate-200 rounded-2xl bg-gradient-to-b from-[rgba(244,247,251,0.2)] to-[#F4F7FB]">
        {TOTALS.map((item) => (
          <div key={item.id} className="flex flex-col items-center gap-2 px-6 max-sm:py-4">
            <span className="text-sm text-slate-700">{item.label}</span>
            <MetricValue metric={metrics?.[item.id]} className="font-bold text-3xl" />
            <MetricContext
              label={item.label}
              value={flooredValue(metrics?.[item.id])}
              status={metrics?.[item.id]?.status}
              asOfFallback={snapshotTimestamp}
              noun={item.noun}
              window="all time"
            />
          </div>
        ))}
      </Card>
    </div>
  </SectionWrapper>
);
