import SectionWrapper from 'components/Layout/SectionWrapper';
import { MetricsBubble } from 'components/MetricsBubble';
import { Card } from 'components/ui/card';
import { Popover } from 'components/ui/popover';
import {
  StaleIndicator,
  StaleMetricContent,
} from 'components/ui/StaleIndicator';
import { Link } from 'components/ui/typography';
import Image from 'next/image';
import { useMemo } from 'react';

const processPredictMetrics = (metrics) => {
  if (!metrics) return null;

  const predictTxsByType = metrics.predictTxsByType?.value ?? null;

  const traderTxs = predictTxsByType
    ? (predictTxsByType.valory_trader || 0) +
      (predictTxsByType.other_trader || 0)
    : null;
  const mechTxs = predictTxsByType ? (predictTxsByType.mech ?? 0) : null;
  const marketCreatorTxs = predictTxsByType
    ? (predictTxsByType.market_maker ?? 0)
    : null;

  return {
    dailyActiveAgents: metrics.dailyActiveAgents?.value ?? null,
    dailyActiveAgentsStatus: metrics.dailyActiveAgents?.status,
    traderTxs,
    txsStatus: metrics.predictTxsByType?.status,
    mechTxs,
    marketCreatorTxs,
    apr: metrics.apr?.value ?? null,
    aprStatus: metrics.apr?.status,
    partialRoi: metrics.partialRoi?.value ?? null,
    partialRoiStatus: metrics.partialRoi?.status,
    finalRoi: metrics.finalRoi?.value ?? null,
    roiStatus: metrics.finalRoi?.status,
    successRate: metrics.successRate?.value ?? null,
    successRateStatus: metrics.successRate?.status,
  };
};

const AgentPerformanceBubble = ({ metrics, image, title }) => {
  const data = useMemo(
    () => [
      {
        id: 'roi',
        subText: (
          <span className="flex items-center gap-2">
            Total ROI - Average{' '}
            {metrics?.partialRoi && (
              <Popover>
                <div className="flex flex-col max-w-[320px] gap-4 text-base ">
                  <p className="text-gray-500">
                    Total ROI shows your agent&apos;s overall earnings,
                    including profits from predictions and staking rewards,
                    minus all related costs such as bet amounts, gas fees, and
                    Mech request fees.
                  </p>
                  <p className="text-gray-500">
                    Partial ROI reflects only prediction performance, excluding
                    staking rewards.
                  </p>
                  <div className="flex justify-between">
                    <span className="text-gray-900">Partial ROI</span>
                    <span
                      className={`${metrics.partialRoiStatus?.stale ? 'text-gray-400' : ''}`}
                    >{`${metrics.partialRoi}%`}</span>
                  </div>
                  <div className="text-sm">
                    <StaleMetricContent status={metrics.partialRoiStatus} />
                  </div>
                </div>
              </Popover>
            )}
          </span>
        ),
        value: metrics?.finalRoi ? `${metrics.finalRoi}%` : null,
        status: metrics?.roiStatus,
        source: {
          link: '/data#predict-roi',
          isExternal: false,
        },
      },
      {
        id: 'apr',
        subText: 'APR, OLAS - Via OLAS Staking',
        value: metrics?.apr ? `${metrics.apr}%` : null,
        status: metrics?.aprStatus,
        source: {
          link: '/data#predict-apr',
          isExternal: false,
        },
      },
      {
        id: 'accuracy',
        subText: 'Prediction Accuracy -  Average (Last 10K Bets)',
        value: metrics?.successRate ? `${metrics.successRate}%` : null,
        status: metrics?.successRateStatus,
        source: {
          link: '/data#predict-accuracy',
          isExternal: false,
        },
      },
    ],
    [metrics],
  );

  return <MetricsBubble metrics={data} image={image} title={title} />;
};

const TransactionsBubble = ({ metrics, image, title }) => {
  const data = useMemo(
    () => [
      {
        id: 'traders',
        subText: (
          <div className="flex items-center gap-2">
            <Image
              alt="Predict"
              src="/images/predict-page/traders.png"
              width="48"
              height="22"
            />
            <span>Traders</span>
          </div>
        ),
        value: metrics?.traderTxs ? metrics.traderTxs.toLocaleString() : null,
        status: metrics?.txsStatus,
        source: {
          link: '/data#predict-transactions-by-type',
          isExternal: false,
        },
      },
      {
        id: 'mechs',
        subText: (
          <div className="flex items-center gap-2">
            <Image
              alt="Predict"
              src="/images/predict-page/mechs.png"
              width="48"
              height="22"
            />
            <span>Mechs: Prediction Brokers</span>
          </div>
        ),
        value: metrics?.mechTxs ? metrics.mechTxs.toLocaleString() : null,
        status: metrics?.txsStatus,
        source: {
          link: '/data#predict-transactions-by-type',
          isExternal: false,
        },
      },
      {
        id: 'marketCreatorsAndClosers',
        subText: (
          <div className="flex flex-wrap items-center gap-2">
            <Image
              alt="Predict"
              src="/images/predict-page/market-creators.png"
              width="48"
              height="22"
            />
            <span>Market Creators</span>
            <Image
              alt="Predict"
              src="/images/predict-page/closers.png"
              width="48"
              height="22"
            />
            <span>Closers</span>
          </div>
        ),
        value: metrics?.marketCreatorTxs
          ? metrics.marketCreatorTxs.toLocaleString()
          : null,
        status: metrics?.txsStatus,
        source: {
          link: '/data#predict-transactions-by-type',
          isExternal: false,
        },
      },
    ],
    [metrics],
  );

  return <MetricsBubble metrics={data} image={image} title={title} />;
};

export const Activity = ({ metrics: initialMetrics }) => {
  const metrics = useMemo(() => {
    return processPredictMetrics(initialMetrics);
  }, [initialMetrics]);

  return (
    <SectionWrapper customClasses="py-16 px-4 border-b border-t" id="stats">
      <div className="max-w-[872px] mx-auto grid md:grid-cols-2 gap-6">
        <Card className="md:col-span-2 flex flex-col items-center gap-6 p-8 border border-purple-200 rounded-full text-xl w-full mx-auto rounded-2xl bg-gradient-to-t from-[#F1DBFF] to-[#FDFAFF]">
          <div className="flex gap-4 items-center">
            <Image
              alt="Predict"
              src="/images/predict-page/predict.svg"
              width="36"
              height="36"
            />
            Predict Agent Economy
          </div>
          <div className="flex items-center gap-2">
            {metrics?.dailyActiveAgents ? (
              <Link
                className="font-extrabold text-6xl"
                href="/data#predict-daily-active-agents"
                hideArrow
              >
                <span
                  className={`${metrics.dailyActiveAgentsStatus?.stale ? 'text-gray-400' : ''}`}
                >
                  {metrics.dailyActiveAgents}
                </span>
              </Link>
            ) : (
              <span className="text-purple-600 text-6xl">--</span>
            )}
            {metrics?.dailyActiveAgentsStatus?.stale && (
              <StaleIndicator status={metrics.dailyActiveAgentsStatus} />
            )}
          </div>
          <div className="flex self-center gap-2">
            Daily Active Agents (DAAs)
            <Popover>7-day average Daily Active Agents</Popover>
          </div>
        </Card>

        <AgentPerformanceBubble title="Agent Performance" metrics={metrics} />
        <TransactionsBubble
          title="Transactions by Agent Type"
          metrics={metrics}
        />
      </div>
    </SectionWrapper>
  );
};
