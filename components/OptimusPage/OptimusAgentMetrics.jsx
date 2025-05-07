import { useMemo } from 'react';

import { getAverageAPRs } from 'common-util/api';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Card } from 'components/ui/card';
import { ExternalLink } from 'components/ui/typography';
import { usePersistentSWR } from 'hooks';

const HUGGINGFACE_URL =
  'https://huggingface.co/spaces/valory/Modius-Agent-Performance';

const fetchMetrics = async () => {
  try {
    const averageAPRs = await getAverageAPRs();
    return {
      latestAvgAPR: averageAPRs?.latestAvgAPR || null,
      latestETHAPR: averageAPRs?.latestETHAPR || null,
    };
  } catch (error) {
    console.error('Error fetching average APRs:', error);
    return { latestAvgAPR: null, latestETHAPR: null };
  }
};

const formatNumber = (num) => {
  const numTo1dp = Number(num?.toFixed(1));
  const formattedNumber = `${numTo1dp}%`;
  return formattedNumber;
};

export const OptimusAgentMetrics = () => {
  const { data: metrics } = usePersistentSWR('OptimusMetrics', fetchMetrics);

  const data = useMemo(
    () => [
      {
        id: 'toETH',
        subText: 'Relative to ETH',
        value: formatNumber(metrics?.latestAvgAPR) || '--',
        source: HUGGINGFACE_URL,
      },
      {
        id: 'toUSDC',
        subText: 'Relative to USDC',
        value: formatNumber(metrics?.latestETHAPR) || '--',
        source: HUGGINGFACE_URL,
      },
    ],
    [metrics],
  );

  return (
    <SectionWrapper>
      <Card className="p-6 mx-auto border border-purple-200 rounded-full text-xl w-fit rounded-2xl bg-gradient-to-t from-[#F1DBFF] to-[#FDFAFF] items-center">
        <div className="text-center mb-6">
          <span className="text-lg text-black max-w-fit">
            📈 APR - Moving Average 3d
          </span>
        </div>

        <div className="md:grid-cols-2 grid gap-6">
          {data.map((item, index) => {
            let borderClassName = '';
            if (index == 0)
              borderClassName +=
                'max-sm:border-b-1.5 md:border-r-1.5 border-purple-200';

            const getValue = () => {
              if (item.value === '--') return '--';
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
                className={`text-center w-[345px] py-6 2xl:py-3 px-8 border-gray-300 h-full w-full ${borderClassName}`}
              >
                <span className="block text-5xl max-sm:text-4xl font-extrabold mb-4 text-purple-600">
                  {getValue()}
                </span>
                <span className="block text-lg text-slate-700">
                  {item.subText}
                </span>
              </div>
            );
          })}
        </div>
      </Card>
    </SectionWrapper>
  );
};
