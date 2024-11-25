import { getProtocolEarnedFees } from 'common-util/api/dune';
import { getOlasBonded } from 'common-util/api/flipside';
import {
  FLIPSIDE_BOND_URL,
  OLAS_PROTOCOL_LIQUIDITY_URL,
} from 'common-util/constants';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Card } from 'components/ui/card';
import { ExternalLink } from 'components/ui/typography';
import { usePersistentSWR } from 'hooks';
import Image from 'next/image';
import { useMemo } from 'react';

const fetchMetrics = async () => {
  const [olasBonded, protocolEarnedFees] = await Promise.allSettled([
    getOlasBonded(),
    getProtocolEarnedFees(),
  ]);

  return {
    olasBonded: olasBonded.status === 'fulfilled' ? olasBonded.value : null,
    protocolEarnedFees:
      protocolEarnedFees.status === 'fulfilled'
        ? protocolEarnedFees.value
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
        id: 'olas-bonded',
        imageSrc: 'olas-bonded.png',
        imageWidth: 56,
        labelText: 'OLAS bonded',
        value: metrics?.olasBonded?.toLocaleString(),
        source: FLIPSIDE_BOND_URL,
      },
      {
        id: 'fees',
        imageSrc: 'protocol-fees.png',
        labelText: 'Fees from Protocol-owned Liquidity',
        value: metrics?.protocolEarnedFees?.toLocaleString(),
        source: OLAS_PROTOCOL_LIQUIDITY_URL,
      },
    ],
    [metrics],
  );

  return (
    <SectionWrapper customClasses="mt-16">
      <Card className="grid md:grid-cols-2 p-6 mx-auto border border-purple-200 rounded-full text-xl max-w-4xl rounded-2xl bg-gradient-to-t from-[#F1DBFF] to-[#FDFAFF] items-center">
        {data.map((item, index) => {
          const { id, imageSrc, imageWidth, labelText, value, source } = item;
          let borderClassName = '';
          if (index == 0)
            borderClassName +=
              'max-sm:border-b-1.5 md:border-r-1.5 border-purple-200';

          const getValue = () => {
            if (!value) return '--';
            return (
              <ExternalLink href={source} hideArrow>
                {value}
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
                    width={imageWidth ?? 35}
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
