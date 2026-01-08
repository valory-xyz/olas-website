import SectionWrapper from 'components/Layout/SectionWrapper';
import Image from 'next/image';
import { Card } from '../ui/card';
import { StaleIndicator } from '../ui/StaleIndicator';
import { Link } from '../ui/typography';

export const TokenHoldersMetric = ({ metrics }) => {
  const tokenHolders = metrics?.tokenHolders;
  const value = tokenHolders?.totalTokenHolders?.value;
  const status = tokenHolders?.totalTokenHolders?.status;

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
        {value ? (
          <Link href="/data#token-holders" className="" hideArrow>
            <div className="flex items-center gap-2 text-black">
              <span
                className={`font-extrabold text-6xl ${status?.stale ? 'text-gray-400' : 'text-purple-600'}`}
              >
                {value?.toLocaleString()}
              </span>
              <StaleIndicator
                status={tokenHolders?.totalTokenHolders?.status}
              />
            </div>
          </Link>
        ) : (
          <span className="text-purple-600 text-6xl">--</span>
        )}
        <div className="flex gap-2">OLAS holders across chains</div>
      </Card>
    </SectionWrapper>
  );
};
