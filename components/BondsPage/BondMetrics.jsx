import {
  getTotalProtocolOwnedLiquidity,
  getTotalProtocolRevenue,
} from 'common-util/api/flipside';
import { FLIPSIDE_URL } from 'common-util/constants';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Card } from 'components/ui/card';
import { ExternalLink } from 'components/ui/typography';
import { usePersistentSWR } from 'hooks';
import Image from 'next/image';
import { useMemo } from 'react';

const fetchMetrics = async () => {
  const [protocolOwnedLiquidity, totalProtocolRevenue] =
    await Promise.allSettled([
      getTotalProtocolOwnedLiquidity(),
      getTotalProtocolRevenue(),
    ]);

  return {
    protocolOwnedLiquidity:
      protocolOwnedLiquidity.status === 'fulfilled'
        ? protocolOwnedLiquidity.value
        : null,
    totalProtocolRevenue:
      totalProtocolRevenue.status === 'fulfilled'
        ? totalProtocolRevenue.value
        : null,
  };
};

export const BondMetrics = () => {
  const { data: metrics } = usePersistentSWR(
    'bondActivityMetrics',
    fetchMetrics,
  );

  const data = useMemo(
    () => [
      {
        id: 'liquidity',
        imageSrc: 'liquidity.png',
        labelText: 'Total Protocol-owned Liquidity',
        value: metrics?.protocolOwnedLiquidity,
        source: `${FLIPSIDE_URL}?tabIndex=2`,
      },
      {
        id: 'fees',
        imageSrc: 'protocol-fees.png',
        labelText: 'Fees from Protocol-owned Liquidity',
        value: metrics?.totalProtocolRevenue,
        source: `${FLIPSIDE_URL}?tabIndex=2`,
      },
    ],
    [metrics],
  );

  return (
    <SectionWrapper customClasses="mt-16">
      <Card className="grid md:grid-cols-2 p-2 mx-auto border border-purple-200 rounded-full text-xl max-w-4xl rounded-2xl bg-gradient-to-t from-[#F1DBFF] to-[#FDFAFF] items-center">
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
              className={`text-center w-[345px] py-6 2xl:py-3 px-8 border-gray-300 w-full ${borderClassName}`}
            >
              <div className="flex gap-2 mb-5 justify-center">
                <div className="aspect-square">
                  <Image
                    alt="Operate"
                    src={`/images/bonds-page/${imageSrc}`}
                    width={35}
                    height={35}
                  />
                </div>
                <span className="text-lg text-black flex">{labelText}</span>
              </div>
              <span className="block text-5xl max-sm:text-4xl font-extrabold mb-4 text-purple-600">
                ${getValue()}
              </span>
            </div>
          );
        })}
      </Card>
    </SectionWrapper>
  );
};
