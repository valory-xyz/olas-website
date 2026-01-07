import {
  getPredictMetrics,
  getPredictRoi,
  getPredictSuccessRate,
} from 'common-util/api';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { MetricsBubble } from 'components/MetricsBubble';
import { Card } from 'components/ui/card';
import { Popover } from 'components/ui/popover';
import { Link } from 'components/ui/typography';
import { usePersistentSWR } from 'hooks';
import Image from 'next/image';
import { useMemo } from 'react';

const processPredictMetrics = (predictMetrics) => {
  if (!predictMetrics) return null;

  const predictTxsByType = predictMetrics.predictTxsByType ?? null;

  const traderTxs = predictTxsByType
    ? (predictTxsByType.valory_trader || 0) +
      (predictTxsByType.other_trader || 0)
    : null;
  const mechTxs = predictTxsByType ? (predictTxsByType.mech ?? 0) : null;
  const marketCreatorTxs = predictTxsByType
    ? (predictTxsByType.market_maker ?? 0)
    : null;

  return {
    dailyActiveAgents: predictMetrics.dailyActiveAgents ?? null,
    traderTxs,
    mechTxs,
    marketCreatorTxs,
    apr: predictMetrics.apr ?? null,
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
                    <span className="text-purple-600">{`${metrics.partialRoi}%`}</span>
                  </div>
                </div>
              </Popover>
            )}
          </span>
        ),
        value: metrics?.finalRoi ? `${metrics.finalRoi}%` : null,
        source: {
          link: '/data#predict-roi',
          isExternal: false,
        },
      },
      {
        id: 'apr',
        subText: 'APR, OLAS - Via OLAS Staking',
        value: metrics?.apr ? `${metrics.apr}%` : null,
        source: {
          link: '/data#predict-apr',
          isExternal: false,
        },
      },
      {
        id: 'accuracy',
        subText: 'Prediction Accuracy -  Average (Last 10K Bets)',
        value: metrics?.successRate ? `${metrics.successRate}%` : null,
        source: {
          link: '/data#predict-accuracy',
          isExternal: false,
        },
      },
    ],
    [metrics],
  );

  // @ts-expect-error TS(2322) FIXME: Type '{ metrics: ({ id: string; subText: Element; ... Remove this comment to see the full error message
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
        source: {
          link: '/data#predict-transactions-by-type',
          isExternal: false,
        },
      },
    ],
    [metrics],
  );

  // @ts-expect-error TS(2322) FIXME: Type '{ metrics: { id: string; subText: Element; v... Remove this comment to see the full error message
  return <MetricsBubble metrics={data} image={image} title={title} />;
};

export const Activity = () => {
  // @ts-expect-error TS(2554) FIXME: Expected 3 arguments, but got 2.
  const { data: predictMetrics } = usePersistentSWR(
    'predictionMetrics',
    getPredictMetrics,
  );

  // @ts-expect-error TS(2554) FIXME: Expected 3 arguments, but got 2.
  const { data: roi } = usePersistentSWR('predictRoi', getPredictRoi);

  // @ts-expect-error TS(2554) FIXME: Expected 3 arguments, but got 2.
  const { data: successRateData } = usePersistentSWR(
    'predictSuccessRate',
    getPredictSuccessRate,
  );

  const metrics = useMemo(() => {
    const base = processPredictMetrics(predictMetrics) || {};
    return {
      ...base,
      partialRoi: roi?.partialRoi ?? null,
      finalRoi: roi?.finalRoi ?? null,
      successRate: successRateData?.successRate ?? null,
    };
  }, [predictMetrics, roi, successRateData]);

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
          {/* @ts-expect-error TS(2339) FIXME: Property 'dailyActiveAgents' does not exist on typ... Remove this comment to see the full error message */}
          {metrics?.dailyActiveAgents ? (
            <Link
              className="font-extrabold text-6xl"
              href="/data#predict-daily-active-agents"
              // @ts-expect-error TS(2322) FIXME: Type '{ children: any[]; className: string; href: ... Remove this comment to see the full error message
              hideArrow
            >
              {/* @ts-expect-error TS(2339): Property &apos;dailyActiveAgents&apos; does
              not exist on typ... */}{' '}
              Remove this comment to see the full error
              {/* @ts-expect-error TS(2339) FIXME: Property 'dailyActiveAgents' does not exist on typ... Remove this comment to see the full error message */}
              {metrics.dailyActiveAgents}
            </Link>
          ) : (
            <span className="text-purple-600 text-6xl">--</span>
          )}
          <div className="flex self-center gap-2">
            Daily Active Agents (DAAs){' '}
            <Popover>7-day average Daily Active Agents</Popover>
          </div>
        </Card>
        {/* @ts-expect-error TS(2741) FIXME: Property 'image' is missing in type '{ title: stri... Remove this comment to see the full error message */}{' '}
        <AgentPerformanceBubble title="Agent Performance" metrics={metrics} />
        {/* @ts-expect-error TS(2741) FIXME: Property 'image' is missing in type '{ title: stri... Remove this comment to see the full error message */}{' '}
        <TransactionsBubble
          title="Transactions by Agent Type"
          metrics={metrics}
        />
      </div>
    </SectionWrapper>
  );
};
