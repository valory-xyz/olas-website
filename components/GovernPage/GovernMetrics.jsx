import { getVeOlasHolders } from 'common-util/api/dune';
import { getVeOLASCirculatingSupply } from 'common-util/api/flipside';
import {
  FLIPSIDE_URL,
  OLAS_ECONOMY_DASHBOARD_URL,
} from 'common-util/constants';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Card } from 'components/ui/card';
import { ExternalLink } from 'components/ui/typography';
import { usePersistentSWR } from 'hooks';
import Image from 'next/image';
import { useMemo } from 'react';

const fetchMetrics = async () => {
  const [veOLASCirculatingSupply, veOLASHolders] = await Promise.allSettled([
    getVeOLASCirculatingSupply(),
    getVeOlasHolders(),
  ]);

  return {
    veOLASCirculatingSupply:
      veOLASCirculatingSupply.status === 'fulfilled'
        ? veOLASCirculatingSupply.value
        : null,
    veOLASHolders:
      veOLASHolders.status === 'fulfilled' ? veOLASHolders.value : null,
  };
};

export const GovernMetrics = () => {
  const { data: metrics } = usePersistentSWR(
    'bondActivityMetrics',
    fetchMetrics,
  );

  const data = useMemo(
    () => [
      {
        id: 'locked-olas',
        imageSrc: 'locked-olas.png',
        labelText: 'OLAS locked in veOLAS',
        value: metrics?.veOLASCirculatingSupply,
        source: `${FLIPSIDE_URL}?tabIndex=3`,
      },
      {
        id: 'veolas-holders',
        imageSrc: 'veolas-holders.png',
        labelText: 'Total veOLAS holders',
        value: metrics?.veOLASHolders,
        source: `${OLAS_ECONOMY_DASHBOARD_URL}#govern-donations-to-useful-services`,
      },
    ],
    [metrics],
  );

  return (
    <SectionWrapper customClasses="mt-16">
      <Card className="flex flxe-col p-2 mx-auto border border-purple-200 rounded-full text-xl max-w-3xl rounded-2xl bg-gradient-to-t from-[#F1DBFF] to-[#FDFAFF]">
        {data.map((item, index) => {
          const { id, imageSrc, labelText, value, source } = item;
          let borderClassName = '';
          if (index == 0)
            borderClassName +=
              'max-sm:border-b-1.5 md:border-r-1.5 border-purple-200';

          const getValue = () => {
            if (!value) return '--';
            return (
              <ExternalLink href={source} hideArrow>
                {Math.round(value).toLocaleString()}
                <span className="text-2xl">↗</span>
              </ExternalLink>
            );
          };

          return (
            <div
              key={id}
              className={`text-center mx-auto py-6 2xl:py-3 px-8 border-gray-300 ${borderClassName}`}
            >
              <div className="flex gap-2 mb-5 justify-center items-center">
                <div className="aspect-square">
                  <Image
                    alt="Operate"
                    src={`/images/govern-page/${imageSrc}`}
                    width={35}
                    height={35}
                  />
                </div>
                <span className="text-lg text-black flex">{labelText}</span>
              </div>
              <span className="block text-5xl max-sm:text-4xl font-extrabold mb-4 text-purple-600">
                {getValue()}
              </span>
            </div>
          );
        })}
      </Card>
    </SectionWrapper>
  );
};
