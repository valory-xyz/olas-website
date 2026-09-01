import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';
import { Card } from 'components/ui/card';
import { Popover } from 'components/ui/popover';
import { StaleIndicator } from 'components/ui/StaleIndicator';
import { Link } from 'components/ui/typography';
import Image from 'next/image';
import NextLink from 'next/link';
import { useMemo } from 'react';
import { isFrozen } from 'common-util/graphql/metric-utils';
import { buildMetricContext } from 'components/ui/MetricContext';

export const MechAgentMetrics = ({ metrics, snapshotTimestamp = null }) => {
  const data = useMemo(
    () => [
      {
        id: 'predict',
        contextNoun: 'task requests to Mech agents originating from the Predict agent economy',
        label: (
          <div className="flex flex-col gap-2 mb-3">
            <Image alt="Mech" src="/images/agents/predict.png" width="35" height="35" />
            <span className="text-base font-semibold text-black">Predict</span>
          </div>
        ),
        subText: 'requests',
        value: metrics?.predictTxs?.value?.toLocaleString(),
        status: metrics?.predictTxs?.status,
      },
      {
        id: 'agentsfun',
        contextNoun: 'task requests to Mech agents originating from the Agents.fun agent economy',
        label: (
          <div className="flex flex-col gap-2 mb-3">
            <Image
              alt="Agents.fun"
              src="/images/agents/agentsfun-economy.png"
              width="35"
              height="35"
            />
            <span className="text-base font-semibold text-black">Agents.fun</span>
          </div>
        ),
        subText: 'requests',
        value: metrics?.agentsfunTxs?.value?.toLocaleString(),
        status: metrics?.agentsfunTxs?.status,
      },
      {
        id: 'contribute',
        contextNoun: 'task requests to Mech agents originating from the Contribute agent economy',
        label: (
          <div className="flex flex-col gap-2 mb-3">
            <Image alt="Mech" src="/images/agents/contribute.svg" width="35" height="35" />
            <span className="text-base font-semibold text-black">Contribute</span>
          </div>
        ),
        subText: 'requests',
        value: metrics?.contributeTxs?.value?.toLocaleString(),
        status: metrics?.contributeTxs?.status,
      },
      {
        id: 'governatooor',
        contextNoun:
          'task requests to Mech agents originating from the Governatooorr agent economy',
        label: (
          <div className="flex flex-col gap-2 mb-3">
            <Image alt="Mech" src="/images/agents/governatooorr.svg" width="35" height="35" />
            <span className="text-base font-semibold text-black">Governatooor</span>
          </div>
        ),
        subText: 'requests',
        value: metrics?.governatooorrTxs?.value?.toLocaleString(),
        status: metrics?.governatooorrTxs?.status,
      },
      {
        id: 'other',
        contextNoun: 'task requests to Mech agents originating from other sources',
        label: (
          <div className="flex flex-col gap-2 mb-3">
            <div className="w-[35px] h-[35px]"></div>
            <span className="text-base font-semibold text-black">Other</span>
          </div>
        ),
        subText: 'requests',
        value: metrics?.otherTxs?.value?.toLocaleString(),
        status: metrics?.otherTxs?.status,
      },
    ],
    [metrics]
  );

  const summaryLines = [
    buildMetricContext({
      // Floored to match the number the card renders; the raw 7-day mean is fractional.
      value: metrics?.dailyActiveAgents?.value ? Math.floor(metrics.dailyActiveAgents.value) : null,
      status: metrics?.dailyActiveAgents?.status,
      noun: 'daily active Olas Mech agents, measured as unique multisigs active each day',
      window: '7-day average',
      asOfFallback: snapshotTimestamp,
    }),
    buildMetricContext({
      value: metrics?.totalRequests?.value,
      status: metrics?.totalRequests?.status,
      noun: 'task requests made to Olas Mech agents by other agent economies',
      window: 'all time',
      asOfFallback: snapshotTimestamp,
    }),
    buildMetricContext({
      value: metrics?.totalDeliveries?.value,
      status: metrics?.totalDeliveries?.status,
      noun: 'task deliveries completed by Olas Mech agents',
      window: 'all time',
      asOfFallback: snapshotTimestamp,
    }),
    ...data.map((item) =>
      buildMetricContext({
        value: item.value,
        status: item.status,
        noun: `${item.contextNoun}, which is one component of the total Mech requests above and not a separate total`,
        window: 'all time',
        asOfFallback: snapshotTimestamp,
      })
    ),
  ].filter(Boolean);

  return (
    <SectionWrapper customClasses="text-center py-16 border-t" id="stats">
      <section aria-label="Olas Mech agent economy metrics summary" className="sr-only">
        <ul>
          {summaryLines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>
      <div className="text-7xl lg:text-9xl mb-8 max-w-[850px] mx-auto w-full">
        <Card className="flex flex-col gap-6 p-8 mb-8 mx-auto border border-purple-200 rounded-full text-xl w-fit rounded-2xl bg-gradient-to-t from-[#F1DBFF] to-[#FDFAFF] items-center">
          <div className="flex items-center">
            <Image
              alt="Mech DAAs"
              src="/images/agents/mech.svg"
              width="35"
              height="35"
              className="mr-4"
            />
            Mech Agent Economy
          </div>
          {metrics?.dailyActiveAgents?.value ? (
            <div className="flex items-center gap-2">
              <Link className="font-extrabold text-6xl" href="/data#mech-daily-active-agents">
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
            Daily Active Agents (DAAs){' '}
            <Popover omitSrText>7-day average Daily Active Agents</Popover>
          </div>
        </Card>
        <p className="text-xl text-slate-700 mt-0 mb-4 mx-auto">
          The Olas Mech agent economy is in demand as ever, resulting in more than{' '}
          {typeof metrics?.totalRequests?.value === 'number' ? (
            <span className="inline-flex items-center gap-1">
              <Link className="font-bold" href="/data#mech-globals">
                <span className={isFrozen(metrics.totalRequests.status) ? 'text-gray-400' : ''}>
                  {metrics.totalRequests.value.toLocaleString()}
                </span>
              </Link>
              <StaleIndicator status={metrics.totalRequests.status} />
            </span>
          ) : (
            <span className="font-bold">--</span>
          )}{' '}
          requests and{' '}
          {typeof metrics?.totalDeliveries?.value === 'number' ? (
            <span className="inline-flex items-center gap-1">
              <Link className="font-bold" href="/data#mech-globals">
                <span className={isFrozen(metrics.totalDeliveries.status) ? 'text-gray-400' : ''}>
                  {metrics.totalDeliveries.value.toLocaleString()}
                </span>
              </Link>
              <StaleIndicator status={metrics.totalDeliveries.status} />
            </span>
          ) : (
            <span className="font-bold">--</span>
          )}{' '}
          deliveries from other AI agent economies.
        </p>
        <p className="text-xl text-slate-700 mt-0 mb-0 mx-auto">Requests are broken up as:</p>
      </div>
      <div className="w-full border-y mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-0 items-end xl:w-max md:mx-auto">
          {data.map((item, index) => {
            let borderClassName = '';
            if (index !== data.length - 1) borderClassName += ' max-md:border-b-1.5';

            const getValue = () => {
              if (!item.value) return '--';
              return (
                <div className="flex items-center gap-2">
                  <Link href="/data#mech-requests-categorized">
                    <div className="flex items-center">
                      <span className={isFrozen(item.status) ? 'text-gray-400' : ''}>
                        {item.value}
                      </span>
                      <span className="text-black">
                        <StaleIndicator status={item.status} />
                      </span>
                    </div>
                  </Link>
                </div>
              );
            };

            return (
              <div
                key={item.id}
                className={`text-start py-6 2xl:py-3 px-8 border-gray-300 h-full ${borderClassName}`}
              >
                {item.label}
                <span className="block text-5xl max-sm:text-4xl font-extrabold mb-4 text-purple-600">
                  {getValue()}
                </span>
                <span className="block text-base text-slate-700">{item.subText}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-14 flex justify-center">
        <Button variant="default" size="lg" asChild>
          <NextLink href="/agent-economies/explorer?economy=mech">
            View Mech Economy in Explorer
          </NextLink>
        </Button>
      </div>
    </SectionWrapper>
  );
};
