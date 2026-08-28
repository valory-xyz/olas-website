import { MetricStatus } from 'common-util/graphql/types';
import { useEffect, useRef, useState } from 'react';

import { AgentToAgentCard, OlasBurnedCard, TransactionsCard, UsersCard } from '../ActivityCards';
import { DIAGRAM, ECONOMY_PILLS, ProtocolActivityMetrics } from './constants';
import { DailyActiveAgentsAvatarsCard } from './DailyActiveAgentsAvatarsCard';
import { EconomyPill } from './EconomyPill';
import { FeesFromPolCard } from './FeesFromPolCard';
import { FlywheelConnectors } from './FlywheelConnectors';
import { PolCenterPanel } from './PolCenterPanel';

type FlywheelMetrics = {
  olasStaked?: string;
  olasStakedStatus?: MetricStatus;
  totalOperators?: string;
  totalOperatorsStatus?: MetricStatus;
  dailyActiveAgents?: string;
  dailyActiveAgentsStatus?: MetricStatus;
  mechFees?: string | number;
  mechFeesStatus?: MetricStatus;
  feesCollected?: string | number;
  feesCollectedStatus?: MetricStatus;
  feesCollectedByToken?: Record<string, number> | null;
  ataTransactions?: string;
  ataTransactionsStatus?: MetricStatus;
  transactions?: string;
  transactionsStatus?: MetricStatus;
};

type FlywheelDesktopProps = {
  metrics: FlywheelMetrics;
  protocolMetrics?: ProtocolActivityMetrics;
};

// Uniform scale-to-fit: the diagram is authored on a fixed 1214x952 canvas so
// connectors and cards share one coordinate space; narrower viewports scale the
// whole canvas rather than reflowing it.
const useDiagramScale = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect?.width;
      if (width) setScale(Math.min(1, width / DIAGRAM.width));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, scale };
};

export const FlywheelDesktop = ({ metrics, protocolMetrics }: FlywheelDesktopProps) => {
  const { ref, scale } = useDiagramScale();

  return (
    <div
      ref={ref}
      className="hidden md:flex justify-center w-full max-w-[1320px] mx-auto"
      style={{ height: DIAGRAM.height * scale }}
    >
      <div
        className="relative shrink-0 text-slate-500 text-left"
        style={{
          width: DIAGRAM.width,
          height: DIAGRAM.height,
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
        }}
      >
        <FlywheelConnectors />

        {ECONOMY_PILLS.map((pill) => (
          <EconomyPill key={pill.slug} {...pill} />
        ))}

        <div className="absolute left-[480px] top-[30px] z-10">
          <UsersCard
            olasStaked={metrics.olasStaked}
            totalOperators={metrics.totalOperators}
            totalOperatorsStatus={metrics.totalOperatorsStatus}
            olasStakedStatus={metrics.olasStakedStatus}
          />
        </div>

        <div className="absolute left-[27px] top-[333px] z-10">
          <OlasBurnedCard />
        </div>

        <div className="absolute left-[393px] top-[224px] w-[545px] h-[340px]">
          <PolCenterPanel protocolMetrics={protocolMetrics} />
        </div>

        <div className="absolute left-[1004px] top-[335px] z-10">
          <DailyActiveAgentsAvatarsCard
            dailyActiveAgents={metrics.dailyActiveAgents}
            dailyActiveAgentsStatus={metrics.dailyActiveAgentsStatus}
          />
        </div>

        <div className="absolute left-[520px] top-[592px] z-10">
          <FeesFromPolCard protocolMetrics={protocolMetrics} />
        </div>

        <div className="absolute left-[288px] top-[738px] z-10">
          <AgentToAgentCard
            ataTransactions={metrics.ataTransactions}
            mechFees={metrics.mechFees}
            feesCollected={metrics.feesCollected}
            feesCollectedByToken={metrics.feesCollectedByToken}
            ataTransactionsStatus={metrics.ataTransactionsStatus}
            mechFeesStatus={metrics.mechFeesStatus}
            feesCollectedStatus={metrics.feesCollectedStatus}
          />
        </div>

        <div className="absolute left-[745px] top-[778px] z-10">
          <TransactionsCard
            transactions={metrics.transactions}
            transactionsStatus={metrics.transactionsStatus}
          />
        </div>
      </div>
    </div>
  );
};
