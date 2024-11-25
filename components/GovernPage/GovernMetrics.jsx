import { getVeOLASCirculatingSupply } from 'common-util/api/flipside';
import { FLIPSIDE_URL } from 'common-util/constants';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Card } from 'components/ui/card';
import { ExternalLink } from 'components/ui/typography';
import { usePersistentSWR } from 'hooks';
import Image from 'next/image';

const fetchMetrics = async () => {
  try {
    const veOLASCirculatingSupply = await getVeOLASCirculatingSupply();
    return { veOLASCirculatingSupply: veOLASCirculatingSupply || null };
  } catch (error) {
    console.error('Error fetching veOLAS circulating supply:', error);
    return { veOLASCirculatingSupply: null };
  }
};

export const GovernMetrics = () => {
  const { data: metrics } = usePersistentSWR('governMetric', fetchMetrics);

  return (
    <SectionWrapper customClasses="border-b-1.5 py-16">
      <Card className="flex flex-col gap-6 p-8 mx-auto border border-purple-200 rounded-full text-xl w-fit rounded-2xl bg-gradient-to-t from-[#F1DBFF] to-[#FDFAFF] items-center">
        <div className="flex items-center">
          <Image
            alt="Govern"
            src="/images/govern-page/locked-olas.png"
            width="35"
            height="35"
            className="mr-4"
          />
          OLAS locked in veOLAS
        </div>
        {metrics?.veOLASCirculatingSupply ? (
          <ExternalLink
            className="font-extrabold text-6xl"
            href={`${FLIPSIDE_URL}?tabIndex=3`}
            target="_blank"
            hideArrow
          >
            {metrics?.veOLASCirculatingSupply?.toLocaleString()}
            <span className="text-4xl">↗</span>
          </ExternalLink>
        ) : (
          <span className="text-purple-600 text-6xl">--</span>
        )}
        <div className="flex gap-2">veOLAS - governance token</div>
      </Card>
    </SectionWrapper>
  );
};
