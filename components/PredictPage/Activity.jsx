import {
  getPredictionTxs,
  getSevenDayAvgDailyActiveAgents,
} from 'common-util/api/flipside';
import { PREDICTION_ECONOMY_DASHBOARD_URL } from 'common-util/constants';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Card } from 'components/ui/card';
import { Popover } from 'components/ui/popover';
import { ExternalLink } from 'components/ui/typography';
import { usePersistentSWR } from 'hooks';
import Image from 'next/image';
import { useMemo } from 'react';

const fetchMetrics = async () => {
  const [dailyActiveAgents, transactions] = await Promise.allSettled([
    getSevenDayAvgDailyActiveAgents(),
    getPredictionTxs(),
  ]);

  return {
    dailyActiveAgents:
      dailyActiveAgents.status === 'fulfilled' ? dailyActiveAgents.value : null,
    traderTxs:
      transactions.status === 'fulfilled' ? transactions.value.traderTxs : null,
    mechTxs:
      transactions.status === 'fulfilled' ? transactions.value.mechTxs : null,
    marketCreatorTxs:
      transactions.status === 'fulfilled'
        ? transactions.value.marketCreatorTxs
        : null,
    totalTxs:
      transactions.status === 'fulfilled' ? transactions.value.totalTxs : null,
  };
};

export const Activity = () => {
  const { data: metrics } = usePersistentSWR(
    'predictionActivityMetrics',
    fetchMetrics,
  );

  const data = useMemo(
    () => [
      {
        id: 'traders',
        label: (
          <div className="flex flex-col gap-2 mb-3">
            <Image
              alt="Predict"
              src="/images/predict-page/traders.png"
              width="72"
              height="32"
            />
            <span className="text-base font-semibold text-black">Traders</span>
          </div>
        ),
        subText: 'transactions',
        value: metrics?.traderTxs?.toLocaleString(),
        source: PREDICTION_ECONOMY_DASHBOARD_URL,
      },
      {
        id: 'mechs',
        label: (
          <div className="flex flex-col gap-2 mb-3">
            <Image
              alt="Predict"
              src="/images/predict-page/mechs.png"
              width="72"
              height="32"
            />
            <span className="text-base font-semibold text-black">Mechs</span>
          </div>
        ),
        subText: 'transactions',
        value: metrics?.mechTxs?.toLocaleString(),
        source: PREDICTION_ECONOMY_DASHBOARD_URL,
      },
      {
        id: 'marketCreatorsAndClosers',
        label: (
          <div className="flex flex-col max-w-max gap-2 mb-3">
            <div className="flex gap-2 justify-between">
              <Image
                alt="Predict"
                src="/images/predict-page/market-creators.png"
                width="72"
                height="32"
              />
              <Image
                alt="Predict"
                src="/images/predict-page/closers.png"
                width="72"
                height="32"
              />
            </div>
            <span className="text-base font-semibold text-black">
              Market creators & closers
            </span>
          </div>
        ),
        subText: 'transactions',
        value: metrics?.marketCreatorTxs?.toLocaleString(),
        source: PREDICTION_ECONOMY_DASHBOARD_URL,
      },
    ],
    [metrics],
  );

  return (
    <SectionWrapper
      customClasses="text-center py-16 px-4 border-b border-t"
      id="activity"
    >
      <div className="text-7xl lg:text-9xl mb-12 max-w-[750px] mx-auto mb-16">
        <Card className="flex flex-col gap-6 p-8 mb-16 border border-purple-200 rounded-full text-xl w-fit mx-auto rounded-2xl bg-gradient-to-t from-[#F1DBFF] to-[#FDFAFF]">
          <div className="flex items-center">
            <Image
              alt="Predict"
              src="/images/predict-page/predict.svg"
              width="35"
              height="35"
              className="mr-4"
            />
            Olas Predict agent economy is ever growing
          </div>
          {metrics?.dailyActiveAgents ? (
            <ExternalLink
              className="font-extrabold text-6xl"
              href={PREDICTION_ECONOMY_DASHBOARD_URL}
              hideArrow
            >
              {metrics.dailyActiveAgents}
              <span className="text-4xl">↗</span>
            </ExternalLink>
          ) : (
            <span className="text-purple-600 text-6xl">--</span>
          )}
          <div className="flex self-center gap-2">
            Daily Active Agents (DAAs)
            <Popover>7-day average Daily Active Agents</Popover>
          </div>
        </Card>
        <p className="text-xl text-slate-700 mb-8 mx-auto">
          Four key autonomous AI agent types have generated over{' '}
          <ExternalLink
            className="font-bold"
            href={PREDICTION_ECONOMY_DASHBOARD_URL}
            hideArrow
          >
            {metrics?.totalTxs?.toLocaleString()}&nbsp;↗
          </ExternalLink>{' '}
          transactions in the Olas Predict agent economy on the Gnosis Chain
        </p>
      </div>
      <div className="mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-0 w-max items-end mb-8">
        {data.map((item, index) => {
          let borderClassName = '';
          if (index !== 0) borderClassName += 'xl:border-l-1.5';
          if (index % 2 !== 0) borderClassName += ' md:border-l-1.5';

          const getValue = () => {
            if (!item.value) return '--';
            return (
              <ExternalLink href={item.source} hideArrow>
                {item.value}
                <span className="text-2xl">↗</span>
              </ExternalLink>
            );
          };

          return (
            <div
              key={item.id}
              className={`text-start w-[345px] py-6 2xl:py-3 px-8 border-gray-300 h-full max-sm:w-full ${borderClassName}`}
            >
              {item.label}
              <span className="block text-5xl max-sm:text-4xl font-extrabold mb-4 text-purple-600">
                {getValue()}
              </span>
              <span className="block text-base text-slate-700">
                {item.subText}
              </span>
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
};
