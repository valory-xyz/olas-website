import Image from 'next/image';

import { isFrozen } from 'common-util/graphql/metric-utils';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Card } from 'components/ui/card';
import { MetricContext } from 'components/ui/MetricContext';
import { Popover } from 'components/ui/popover';
import { StaleIndicator } from 'components/ui/StaleIndicator';
import { Link } from 'components/ui/typography';

import { EXPLORE_CONNECT_URL } from './constants';

// TODO: wire `metrics` to a snapshot once the Connect data source exists; every value renders
// "--" until then. Same layout as the BabyDegen economy: the DAA card, then a card of totals.
const TOTALS = [
  {
    id: 'marketplaceRequests',
    label: 'Olas Marketplace requests',
    noun: 'requests Connect agents made to AI agents on the Olas Marketplace',
  },
  {
    id: 'onchainExecutions',
    label: 'Successful on-chain executions',
    noun: 'successful on-chain transactions executed by Connect agents',
  },
];

const ConnectTotal = ({ item, metric, snapshotTimestamp }) => (
  <div className="flex flex-col gap-2 text-center">
    <span className="text-sm text-slate-700">{item.label}</span>
    <div className="flex items-center justify-center gap-2">
      <span
        className={`text-2xl font-semibold ${isFrozen(metric?.status) ? 'text-gray-400' : 'text-purple-600'}`}
      >
        {typeof metric?.value === 'number' ? (
          <Link href={EXPLORE_CONNECT_URL}>
            <span className={isFrozen(metric.status) ? 'text-gray-400' : ''}>
              {metric.value.toLocaleString()}
            </span>
          </Link>
        ) : (
          '--'
        )}
      </span>
      <StaleIndicator status={metric?.status} />
    </div>
    <MetricContext
      label={item.label}
      value={metric?.value ?? null}
      status={metric?.status}
      asOfFallback={snapshotTimestamp}
      noun={item.noun}
      window="all time"
    />
  </div>
);

export const ConnectMetrics = ({ metrics = null, snapshotTimestamp = null }) => (
  <SectionWrapper customClasses="pt-[120px] pb-10" id="stats">
    <div className="max-w-[646px] mx-auto flex flex-col gap-[40px]">
      <Card className="flex flex-col gap-6 p-8 border border-purple-200 rounded-2xl bg-gradient-to-t from-[#F1DBFF] to-[#FDFAFF] items-center text-xl max-w-[424px] mx-auto">
        <div className="flex items-center">
          <Image
            alt="Connect DAAs"
            src="/images/connect-econ-page/connect-economy-logo-128.png"
            width="35"
            height="35"
            className="mr-4"
          />
          Connect Agent Economy
        </div>
        {metrics?.dailyActiveAgents?.value ? (
          <div className="flex items-center gap-2">
            <Link className="font-extrabold text-6xl" href={EXPLORE_CONNECT_URL}>
              <span className={isFrozen(metrics.dailyActiveAgents.status) ? 'text-gray-400' : ''}>
                {Math.floor(metrics.dailyActiveAgents.value).toLocaleString()}
              </span>
            </Link>
            <StaleIndicator status={metrics.dailyActiveAgents.status} />
          </div>
        ) : (
          <span className="text-purple-600 text-6xl">--</span>
        )}
        <div className="flex gap-2">
          Daily Active Agents (DAAs) <Popover>7-day average Daily Active Agents</Popover>
        </div>
        <MetricContext
          label="Daily Active Agents (DAAs)"
          value={
            metrics?.dailyActiveAgents?.value ? Math.floor(metrics.dailyActiveAgents.value) : null
          }
          status={metrics?.dailyActiveAgents?.status}
          asOfFallback={snapshotTimestamp}
          noun="daily active Connect agents"
          window="7-day average"
        />
      </Card>

      <Card className="p-8 border border-slate-200 rounded-2xl bg-gradient-to-b from-[rgba(244,247,251,0.2)] to-[#F4F7FB] grid sm:grid-cols-2 gap-6">
        {TOTALS.map((item) => (
          <ConnectTotal
            key={item.id}
            item={item}
            metric={metrics?.[item.id]}
            snapshotTimestamp={snapshotTimestamp}
          />
        ))}
      </Card>
    </div>
  </SectionWrapper>
);
