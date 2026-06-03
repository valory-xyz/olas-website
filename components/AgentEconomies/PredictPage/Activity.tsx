import SectionWrapper from 'components/Layout/SectionWrapper';
import { Card } from 'components/ui/card';
import { Popover } from 'components/ui/popover';
import { StaleIndicator } from 'components/ui/StaleIndicator';
import { Link } from 'components/ui/typography';
import { isNil } from 'lodash';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { PlatformActivitySection } from './PlatformActivitySection';
import type { Platform, PlatformMetrics } from './PlatformActivitySection';
import { RoiDistributionChart } from './RoiDistributionChart';
import { ToolAccuracyTable } from './ToolAccuracyTable';

const processPredictMetrics = (
  metrics: any
): {
  omenstrat: PlatformMetrics & {
    dailyActiveAgents: number | null;
    dailyActiveAgentsStatus: any;
  };
  polystrat: PlatformMetrics & {
    dailyActiveAgents: number | null;
    dailyActiveAgentsStatus: any;
  };
} => {
  if (!metrics) {
    return {
      omenstrat: {
        dailyActiveAgents: null,
        dailyActiveAgentsStatus: undefined,
        apr: null,
        aprStatus: undefined,
        traderTxs: null,
        mechTxs: null,
        marketCreatorTxs: null,
        txsStatus: undefined,
        partialRoi: null,
        finalRoi: null,
        roiStatus: undefined,
        successRate: null,
        successRateStatus: undefined,
        brierScore: null,
        brierStatus: undefined,
      },
      polystrat: {
        dailyActiveAgents: null,
        dailyActiveAgentsStatus: undefined,
        apr: null,
        aprStatus: undefined,
        traderTxs: null,
        mechTxs: null,
        txsStatus: undefined,
        partialRoi: null,
        finalRoi: null,
        roiStatus: undefined,
        successRate: null,
        successRateStatus: undefined,
      },
    };
  }

  const omenstratTxs = metrics.omenstrat?.predictTxsByType?.value ?? null;
  const polystratTxs = metrics.polystrat?.predictTxsByType?.value ?? null;

  return {
    omenstrat: {
      dailyActiveAgents: metrics.omenstrat?.dailyActiveAgents?.value ?? null,
      dailyActiveAgentsStatus: metrics.omenstrat?.dailyActiveAgents?.status,
      apr: metrics.omenstrat?.apr?.value ?? null,
      aprStatus: metrics.omenstrat?.apr?.status,
      traderTxs: omenstratTxs
        ? (omenstratTxs.valory_trader || 0) + (omenstratTxs.other_trader || 0)
        : null,
      mechTxs: omenstratTxs ? (omenstratTxs.mech ?? 0) : null,
      marketCreatorTxs: omenstratTxs ? (omenstratTxs.market_maker ?? 0) : null,
      txsStatus: metrics.omenstrat?.predictTxsByType?.status,
      partialRoi: metrics.omenstrat?.partialRoi?.value ?? null,
      finalRoi: metrics.omenstrat?.finalRoi?.value ?? null,
      roiStatus: metrics.omenstrat?.finalRoi?.status,
      successRate: metrics.omenstrat?.successRate?.value ?? null,
      successRateStatus: metrics.omenstrat?.successRate?.status,
      brierScore: metrics.omenstrat?.brierScore?.value ?? null,
      brierStatus: metrics.omenstrat?.brierScore?.status,
    },
    polystrat: {
      dailyActiveAgents: metrics.polystrat?.dailyActiveAgents?.value ?? null,
      dailyActiveAgentsStatus: metrics.polystrat?.dailyActiveAgents?.status,
      apr: metrics.polystrat?.apr?.value ?? null,
      aprStatus: metrics.polystrat?.apr?.status,
      traderTxs: polystratTxs ? polystratTxs.valory_trader || 0 : null,
      mechTxs: polystratTxs ? (polystratTxs.mech ?? 0) : null,
      txsStatus: metrics.polystrat?.predictTxsByType?.status,
      partialRoi: metrics.polystrat?.partialRoi?.value ?? null,
      finalRoi: metrics.polystrat?.finalRoi?.value ?? null,
      roiStatus: metrics.polystrat?.finalRoi?.status,
      successRate: metrics.polystrat?.successRate?.value ?? null,
      successRateStatus: metrics.polystrat?.successRate?.status,
    },
  };
};

const DaaCard = ({ title, imgSrc, daaValue, status, href, popoverText, id }) => {
  return (
    <Card
      id={id}
      className="flex flex-col items-center gap-6 p-8 border border-purple-200 rounded-2xl bg-gradient-to-t from-[#F1DBFF] to-[#FDFAFF]"
    >
      <div className="flex gap-4 items-center">
        <Image alt={title} src={imgSrc} width="36" height="36" />
        {title}
      </div>
      <div className="flex items-center gap-2">
        {isNil(daaValue) ? (
          <span className="text-purple-600 text-6xl">--</span>
        ) : (
          <Link className="font-extrabold text-6xl" href={href}>
            <span className={`${status?.stale ? 'text-gray-400' : ''}`}>{daaValue}</span>
          </Link>
        )}
        <StaleIndicator status={status} />
      </div>
      <div className="flex self-center gap-2">
        Daily Active Agents (DAAs) <Popover>{popoverText}</Popover>
      </div>
    </Card>
  );
};

export const Activity = ({ metrics: initialMetrics, roiDistribution, toolAccuracy }) => {
  const metrics = useMemo(() => {
    return processPredictMetrics(initialMetrics);
  }, [initialMetrics]);
  const [platform, setPlatform] = useState<Platform>('omenstrat');

  return (
    <SectionWrapper customClasses="py-16 px-4 border-t" id="stats">
      <div className="max-w-[872px] mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Omenstrat DAA Card */}
          <DaaCard
            id="omenstrat-agent-economy"
            title="Omenstrat Agent Economy"
            imgSrc="/images/predict-page/omenstrat-icon.png"
            daaValue={metrics.omenstrat.dailyActiveAgents}
            status={metrics.omenstrat.dailyActiveAgentsStatus}
            href="/data#omenstrat-daily-active-agents"
            popoverText="7-day average Daily Active Agents for Omenstrat (Omen)"
          />

          {/* Polystrat DAA Card */}
          <DaaCard
            id="polystrat-agent-economy"
            title="Polystrat Agent Economy"
            imgSrc="/images/predict-page/polystrat-icon.png"
            daaValue={metrics.polystrat.dailyActiveAgents}
            status={metrics.polystrat.dailyActiveAgentsStatus}
            href="/data#polystrat-daily-active-agents"
            popoverText="7-day average Daily Active Agents for Polystrat (Polymarket)"
          />

          {/* Switcher-driven per-platform performance & lifetime activity */}
          <PlatformActivitySection
            metrics={{ omenstrat: metrics.omenstrat, polystrat: metrics.polystrat }}
            platform={platform}
            onPlatformChange={setPlatform}
            className="md:col-span-2"
          />

          {/* ROI Distribution Chart — filtered to the selected platform */}
          <RoiDistributionChart
            id="roi-distribution"
            data={roiDistribution}
            platform={platform}
            className="md:col-span-2"
          />

          {/* Tool Accuracy Table — filtered to the selected platform */}
          <ToolAccuracyTable
            id="tool-accuracy"
            data={toolAccuracy}
            platform={platform}
            className="md:col-span-2"
          />
        </div>
      </div>
    </SectionWrapper>
  );
};
