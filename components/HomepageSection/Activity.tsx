import { MetricStatus } from 'common-util/graphql/types';
import SectionHeading from 'components/SectionHeading';
import { Link } from 'components/ui/typography';
import Image from 'next/image';
import { useMemo } from 'react';

import {
  AgentsGrid,
  AgentToAgentCard,
  DailyActiveAgentsCard,
  OlasBurnedCard,
  OlasIsBurnedArrow,
  TransactionsCard,
  UsersCard,
} from './ActivityCards';
import { FlywheelDesktop } from './Flywheel/FlywheelDesktop';
import { PolMobileSection } from './Flywheel/PolMobileSection';
import type { ProtocolActivityMetrics } from './Flywheel/constants';
import { ActivitySummary } from './ActivitySummary';

const imgPath = '/images/homepage/activity/';

type ActivityMetrics = {
  transactions?: { value?: number; status?: MetricStatus };
  olasStaked?: { value?: number; status?: MetricStatus };
  dailyActiveAgents?: { value?: number; status?: MetricStatus };
  mechFees?: { value?: number | string; status?: MetricStatus };
  feesCollected?: { value?: number | string; status?: MetricStatus };
  feesCollectedByToken?: { value?: Record<string, number> | null; status?: MetricStatus };
  ataTransactions?: { value?: number; status?: MetricStatus };
  totalOperators?: { value?: number; status?: MetricStatus };
};

type ActivityProps = {
  metrics?: ActivityMetrics | null;
  protocolMetrics?: ProtocolActivityMetrics;
  /** Fallback as-of timestamp for metrics whose source is lagging. */
  snapshotTimestamp?: number | null;
  /** As-of fallback for the protocol-owned-liquidity lines, from the `other` snapshot. */
  protocolSnapshotTimestamp?: number | null;
  /** OLAS burned to date, from the `agent-economies` snapshot. */
  olasBurned?: { value?: number | string; status?: MetricStatus };
  economySnapshotTimestamp?: number | null;
};

export const Activity = ({
  metrics = null,
  protocolMetrics = null,
  snapshotTimestamp = null,
  protocolSnapshotTimestamp = null,
  olasBurned,
  economySnapshotTimestamp = null,
}: ActivityProps) => {
  const processedMetrics = useMemo(() => {
    if (!metrics) {
      return {
        transactions: '--',
        transactionsStatus: undefined,
        olasStaked: '--',
        olasStakedStatus: undefined,
        dailyActiveAgents: '--',
        dailyActiveAgentsStatus: undefined,
        mechFees: '--',
        mechFeesStatus: undefined,
        feesCollected: '--',
        feesCollectedStatus: undefined,
        feesCollectedByToken: null,
        ataTransactions: '--',
        ataTransactionsStatus: undefined,
        totalOperators: '--',
        totalOperatorsStatus: undefined,
      };
    }

    return {
      transactions: metrics.transactions?.value?.toLocaleString() || '--',
      transactionsStatus: metrics.transactions?.status,
      olasStaked: metrics.olasStaked?.value?.toLocaleString() || '--',
      olasStakedStatus: metrics.olasStaked?.status,
      dailyActiveAgents: metrics.dailyActiveAgents?.value?.toLocaleString() || '--',
      dailyActiveAgentsStatus: metrics.dailyActiveAgents?.status,
      mechFees: metrics.mechFees?.value || '--',
      mechFeesStatus: metrics.mechFees?.status,
      feesCollected: metrics.feesCollected?.value ?? '--',
      feesCollectedStatus: metrics.feesCollected?.status,
      feesCollectedByToken: metrics.feesCollectedByToken?.value ?? null,
      ataTransactions: metrics.ataTransactions?.value?.toLocaleString() || '--',
      ataTransactionsStatus: metrics.ataTransactions?.status,
      totalOperators: metrics.totalOperators?.value?.toLocaleString() || '--',
      totalOperatorsStatus: metrics.totalOperators?.status,
    };
  }, [metrics]);

  return (
    <div>
      <ActivitySummary
        metrics={metrics}
        protocolMetrics={protocolMetrics}
        snapshotTimestamp={snapshotTimestamp}
        protocolSnapshotTimestamp={protocolSnapshotTimestamp}
        olasBurned={olasBurned}
        economySnapshotTimestamp={economySnapshotTimestamp}
      />
      <div className="max-w-4xl mx-auto">
        <SectionHeading
          color="text-gray-900"
          weight="font-bold"
          other="mb-12 max-w-3xl text-center mx-auto max-lg:mx-4"
        >
          OLAS: Powers AI Agent Economies
        </SectionHeading>
        <p className="text-lg text-slate-600 mb-20 max-lg:mx-4">
          The OLAS token is powering a flywheel driving larger and larger agent economies: Each
          Pearl user stakes OLAS to access their agents&apos; benefits. To provide utility to their
          users, Pearl agents use the marketplace. The marketplace charges fees to agents. Fees are
          used to burn OLAS.
        </p>
      </div>

      <FlywheelDesktop metrics={processedMetrics} protocolMetrics={protocolMetrics} />

      <div className="flex flex-col md:hidden w-[90%] mx-auto">
        <UsersCard
          olasStaked={processedMetrics.olasStaked}
          totalOperators={processedMetrics.totalOperators}
          totalOperatorsStatus={processedMetrics.totalOperatorsStatus}
          olasStakedStatus={processedMetrics.olasStakedStatus}
        />
        <Image
          src={`${imgPath}mobile-arrow.png`}
          alt="arrow"
          width={240}
          height={120}
          className="mx-auto mb-2"
        />
        <DailyActiveAgentsCard
          dailyActiveAgents={processedMetrics.dailyActiveAgents}
          dailyActiveAgentsStatus={processedMetrics.dailyActiveAgentsStatus}
        />
        <Image
          src={`${imgPath}mobile-arrow2.png`}
          alt="arrow"
          width={132}
          height={120}
          className="mx-auto mb-2"
        />
        <TransactionsCard
          transactions={processedMetrics.transactions}
          transactionsStatus={processedMetrics.transactionsStatus}
        />
        <Image
          src={`${imgPath}mobile-arrow3.png`}
          alt="arrow"
          width={180}
          height={120}
          className="mx-auto mb-2"
        />
        <AgentToAgentCard
          ataTransactions={processedMetrics.ataTransactions}
          mechFees={processedMetrics.mechFees}
          feesCollected={processedMetrics.feesCollected}
          feesCollectedByToken={processedMetrics.feesCollectedByToken}
          ataTransactionsStatus={processedMetrics.ataTransactionsStatus}
          mechFeesStatus={processedMetrics.mechFeesStatus}
          feesCollectedStatus={processedMetrics.feesCollectedStatus}
        />
        <OlasIsBurnedArrow pointsDown className="mx-auto mb-2" />
        <OlasBurnedCard />
        <Image
          src={`${imgPath}mobile-arrow5.png`}
          alt="arrow"
          width={343}
          height={202}
          className="mx-auto mb-12"
        />
        <PolMobileSection protocolMetrics={protocolMetrics} />
        <div className="mx-auto mt-10 grid place-items-center z-10">
          <AgentsGrid />
          <div>
            As a result, <Link href="/agent-economies">Agent economies</Link> are thriving.
          </div>
        </div>
      </div>
    </div>
  );
};
