import SectionWrapper from 'components/Layout/SectionWrapper';
import { Card } from 'components/ui/card';
import { Link } from 'components/ui/typography';
import Image from 'next/image';

export const TokenHoldersMetric = ({ metrics }) => {
  const tokenHolders = metrics?.tokenHolders;

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
        {tokenHolders?.totalTokenHolders ? (
          <Link
            href="/data#token-holders"
            className="font-extrabold text-6xl text-purple-600"
            hideArrow
          >
            {tokenHolders.totalTokenHolders.toLocaleString()}
          </Link>
        ) : (
          <span className="text-purple-600 text-6xl">--</span>
        )}
        <div className="flex gap-2">OLAS holders across chains</div>
      </Card>
    </SectionWrapper>
  );
};
