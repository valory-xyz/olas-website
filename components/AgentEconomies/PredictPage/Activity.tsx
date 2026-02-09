import SectionWrapper from 'components/Layout/SectionWrapper';
import { Card } from 'components/ui/card';
import { Popover } from 'components/ui/popover';
import { StaleIndicator, StaleMetricContent } from 'components/ui/StaleIndicator';
import { Link } from 'components/ui/typography';
import Image from 'next/image';
import { useMemo } from 'react';

const processPredictMetrics = (metrics: any) => {
  if (!metrics) {
    return {
      dailyActiveAgents: null,
      dailyActiveAgentsStatus: undefined,
      omenstrat: {
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
      },
      polystrat: {
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
    dailyActiveAgents: metrics.dailyActiveAgents?.value ?? null,
    dailyActiveAgentsStatus: metrics.dailyActiveAgents?.status,
    omenstrat: {
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
    },
    polystrat: {
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

const PerformanceBubble = ({ platformMetrics, title, imgSrc }) => {
  const bubbleData = useMemo(() => {
    const performanceMetrics = [
      {
        id: 'roi',
        subText: (
          <span className="flex items-center gap-2">
            Total ROI - Average{' '}
            {platformMetrics.partialRoi != null && (
              <Popover>
                <div className="flex flex-col max-w-[320px] gap-4 text-base">
                  <p className="text-gray-500">
                    Total ROI shows your agent&apos;s overall earnings, including profits from
                    predictions and staking rewards, minus all related costs.
                  </p>
                  <p className="text-gray-500">
                    Partial ROI reflects only prediction performance, excluding staking rewards.
                  </p>
                  <div className="flex justify-between">
                    <span className="text-gray-900">Partial ROI</span>
                    <span className={`${platformMetrics.roiStatus?.stale ? 'text-gray-400' : ''}`}>
                      {`${platformMetrics.partialRoi}%`}
                    </span>
                  </div>
                  <div className="text-sm">
                    <StaleMetricContent status={platformMetrics.roiStatus} />
                  </div>
                </div>
              </Popover>
            )}
          </span>
        ),
        value: platformMetrics.finalRoi != null ? `${platformMetrics.finalRoi}%` : null,
        status: platformMetrics.roiStatus,
        source: { link: '/data#predict-roi', isExternal: false },
      },
      {
        id: 'apr',
        subText: 'APR, OLAS - Via OLAS Staking',
        value: platformMetrics.apr ? `${platformMetrics.apr}%` : null,
        status: platformMetrics.aprStatus,
        source: { link: '/data#predict-apr', isExternal: false },
      },
      {
        id: 'accuracy',
        subText: 'Prediction Accuracy - Average (Last 10K Trades)',
        value: platformMetrics.successRate ? `${platformMetrics.successRate}%` : null,
        status: platformMetrics.successRateStatus,
        source: { link: '/data#predict-accuracy', isExternal: false },
      },
    ];

    const transactionMetrics = [
      {
        id: 'traders',
        subText: (
          <div className="flex items-center gap-2">
            <span>Traders</span>
            <Image alt="Traders" src="/images/predict-page/traders.png" width="32" height="15" />
          </div>
        ),
        value: platformMetrics.traderTxs ? platformMetrics.traderTxs.toLocaleString() : null,
        status: platformMetrics.txsStatus,
        source: { link: '/data#predict-transactions-by-type', isExternal: false },
      },
      {
        id: 'mechs',
        subText: (
          <div className="flex items-center gap-2">
            <span>Mechs: Prediction Brokers</span>
            <Image alt="Mechs" src="/images/predict-page/mechs.png" width="32" height="15" />
          </div>
        ),
        value: platformMetrics.mechTxs ? platformMetrics.mechTxs.toLocaleString() : null,
        status: platformMetrics.txsStatus,
        source: { link: '/data#predict-transactions-by-type', isExternal: false },
      },
    ];

    if (platformMetrics.marketCreatorTxs !== undefined) {
      transactionMetrics.push({
        id: 'marketCreatorsAndClosers',
        subText: (
          <div className="flex flex-wrap items-center gap-2">
            <span>Market Creators</span>
            <Image
              alt="Market Creators"
              src="/images/predict-page/market-creators.png"
              width="32"
              height="15"
            />
            <span>Closers</span>
            <Image alt="Closers" src="/images/predict-page/closers.png" width="32" height="15" />
          </div>
        ),
        value: platformMetrics.marketCreatorTxs
          ? platformMetrics.marketCreatorTxs.toLocaleString()
          : null,
        status: platformMetrics.txsStatus,
        source: { link: '/data#predict-transactions-by-type', isExternal: false },
      });
    }

    return { performanceMetrics, transactionMetrics };
  }, [platformMetrics]);

  return (
    <Card className="p-8 border border-slate-200 rounded-full text-xl w-full rounded-2xl bg-gradient-to-b from-[rgba(244,247,251,0.2)] to-[#F4F7FB] flex flex-col">
      <Image alt={title} src={imgSrc} width="48" height="48" className="mb-4" />

      {/* Agent performance metrics */}
      <div className="text-lg font-semibold mb-6">{title}</div>
      <div className="flex flex-col gap-4">
        {bubbleData.performanceMetrics.map((metric) => (
          <div key={metric.id} className="flex flex-col gap-1">
            <div className="text-sm text-gray-600">{metric.subText}</div>
            <div className="flex items-center gap-2">
              {metric.source?.link ? (
                <Link href={metric.source.link} className="text-2xl font-bold">
                  <span className={metric.status?.stale ? 'text-gray-400' : ''}>
                    {metric.value || '--'}
                  </span>
                </Link>
              ) : (
                <span
                  className={`text-2xl font-bold ${metric.status?.stale ? 'text-gray-400' : ''}`}
                >
                  {metric.value || '--'}
                </span>
              )}
              <StaleIndicator status={metric.status} />
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-[#D7DDEA] my-8" />

      {/* Transaction metrics */}
      <div className="text-lg font-semibold mb-6">Transactions by Agent Type</div>
      <div className="flex flex-col gap-4">
        {bubbleData.transactionMetrics.map((metric) => (
          <div key={metric.id} className="flex flex-col gap-1">
            <div className="text-sm text-gray-600">{metric.subText}</div>
            <div className="flex items-center gap-2">
              {metric.source?.link ? (
                <Link href={metric.source.link} className="text-2xl font-bold">
                  <span className={metric.status?.stale ? 'text-gray-400' : ''}>
                    {metric.value || '--'}
                  </span>
                </Link>
              ) : (
                <span
                  className={`text-2xl font-bold ${metric.status?.stale ? 'text-gray-400' : ''}`}
                >
                  {metric.value || '--'}
                </span>
              )}
              <StaleIndicator status={metric.status} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export const Activity = ({ metrics: initialMetrics }) => {
  const metrics = useMemo(() => {
    return processPredictMetrics(initialMetrics);
  }, [initialMetrics]);

  return (
    <SectionWrapper customClasses="py-16 px-4 border-t" id="stats">
      <div className="max-w-[872px] mx-auto grid md:grid-cols-2 gap-6">
        {/* Combined DAA Card */}
        <Card className="md:col-span-2 flex flex-col items-center gap-6 p-8 border border-purple-200 rounded-2xl bg-gradient-to-t from-[#F1DBFF] to-[#FDFAFF]">
          <div className="flex gap-4 items-center">
            <Image alt="Predict" src="/images/predict-page/predict.svg" width="36" height="36" />
            Predict Agent Economy
          </div>
          <div className="flex items-center gap-2">
            {metrics.dailyActiveAgents ? (
              <Link className="font-extrabold text-6xl" href="/data#predict-daily-active-agents">
                <span
                  className={`${metrics.dailyActiveAgentsStatus?.stale ? 'text-gray-400' : ''}`}
                >
                  {metrics.dailyActiveAgents}
                </span>
              </Link>
            ) : (
              <span className="text-purple-600 text-6xl">--</span>
            )}
            <StaleIndicator status={metrics.dailyActiveAgentsStatus} />
          </div>
          <div className="flex self-center gap-2">
            Daily Active Agents (DAAs){' '}
            <Popover>7-day average Daily Active Agents (Omenstrat + Polystrat)</Popover>
          </div>
        </Card>

        {/* Omenstrat Unified Bubble */}
        <PerformanceBubble
          title="Omenstrat Performance"
          platformMetrics={metrics.omenstrat}
          imgSrc="/images/predict-page/omenstrat-icon.png"
        />

        {/* Polystrat Unified Bubble */}
        <PerformanceBubble
          title="Polystrat Performance"
          platformMetrics={metrics.polystrat}
          imgSrc="/images/predict-page/polystrat-icon.png"
        />
      </div>
    </SectionWrapper>
  );
};
