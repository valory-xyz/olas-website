import SectionWrapper from 'components/Layout/SectionWrapper';
import { Card } from 'components/ui/card';
import { ExternalLink } from 'components/ui/typography';
import Image from 'next/image';

export const ContributeMetrics = () => {
  return (
    <SectionWrapper customClasses="border-b-1.5 py-16">
      <Card className="flex flex-col gap-6 p-8 mx-auto border border-purple-200 rounded-full text-xl max-w-md rounded-2xl bg-gradient-to-t from-[#F1DBFF] to-[#FDFAFF] items-center">
        <div className="flex items-center">
          <Image
            alt="Contribute"
            src="/images/contribute-page/contributors.png"
            width="35"
            height="35"
            className="mr-4"
          />
          Total Olas Contributors
        </div>
        <ExternalLink
          className="font-extrabold text-6xl"
          href="https://operate.olas.network/contracts"
          target="_blank"
          hideArrow
        >
          320
          <span className="text-4xl">↗</span>
        </ExternalLink>
        <div className="flex gap-2">
          Influencing the direction of the network
        </div>
      </Card>
    </SectionWrapper>
  );
};
