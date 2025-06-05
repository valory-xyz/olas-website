import { getTotalTokenHolders } from 'common-util/api/flipside';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Card } from 'components/ui/card';
import { ExternalLink } from 'components/ui/typography';
import { usePersistentSWR } from 'hooks';
import Image from 'next/image';

const fetchMetrics = async () => {
  try {
    const totalTokenHolders = await getTotalTokenHolders();
    return { totalTokenHolders: totalTokenHolders || null };
  } catch (error) {
    console.error('Error fetching total token holders:', error);
    return { totalTokenHolders: null };
  }
};

export const TokenHoldersMetric = () => {
  const { data: metrics } = usePersistentSWR(
    'tokenHoldersMetric',
    fetchMetrics,
  );

  return (
    <SectionWrapper id="stats" customClasses="border-b-1.5 py-16">
      <Card className="flex flex-col gap-6 p-8 mx-auto border border-purple-200 rounded-full text-xl w-fit rounded-2xl bg-gradient-to-t from-[#F1DBFF] to-[#FDFAFF] items-center">
        <div className="flex items-center">
          <Image
            alt="Tokenomics"
            src="/images/olas-token-logo.png"
            width="35"
            height="35"
            className="mr-4"
          />
          The OLAS Token is widely supported by the community
        </div>
        {metrics?.totalTokenHolders ? (
          <ExternalLink
            className="font-extrabold text-6xl"
            href="https://flipsidecrypto.xyz/flipsideteam/q/WGkAsswnV2pH/total-holders/visualizations/v2/d57457e2-1c31-4c9b-af60-3a58de583eeb"
            target="_blank"
            hideArrow
          >
            {metrics?.totalTokenHolders?.toLocaleString()}
            <span className="text-4xl">↗</span>
          </ExternalLink>
        ) : (
          <span className="text-purple-600 text-6xl">--</span>
        )}
        <div className="flex gap-2">OLAS holders across chains</div>
      </Card>
    </SectionWrapper>
  );
};
