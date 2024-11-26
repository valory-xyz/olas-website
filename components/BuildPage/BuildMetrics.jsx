import { getTotalUniqueBuilders } from 'common-util/api/dune';
import { OLAS_ECONOMY_DASHBOARD_URL } from 'common-util/constants';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Card } from 'components/ui/card';
import { ExternalLink } from 'components/ui/typography';
import { usePersistentSWR } from 'hooks';
import Image from 'next/image';

const fetchMetrics = async () => {
  try {
    const totalUniqueBuilders = await getTotalUniqueBuilders();
    return { totalUniqueBuilders: totalUniqueBuilders || null };
  } catch (error) {
    console.error('Error fetching total unique builders: ', error);
    return { totalUniqueBuilders: null };
  }
};

export const BuildMetrics = () => {
  const { data: metrics } = usePersistentSWR('buildMetric', fetchMetrics);

  return (
    <SectionWrapper customClasses="border-b-1.5 py-16">
      <Card className="flex flex-col gap-6 p-8 mx-auto border border-purple-200 rounded-full text-xl max-w-md rounded-2xl bg-gradient-to-t from-[#F1DBFF] to-[#FDFAFF] items-center">
        <div className="flex items-center">
          <Image
            alt="Build"
            src="/images/build-page/builders.png"
            width="35"
            height="35"
            className="mr-4"
          />
          Total Olas Builders
        </div>
        {metrics?.totalUniqueBuilders ? (
          <ExternalLink
            className="font-extrabold text-6xl"
            href={`${OLAS_ECONOMY_DASHBOARD_URL}#builders`}
            target="_blank"
            hideArrow
          >
            {metrics?.totalUniqueBuilders?.toLocaleString()}
            <span className="text-4xl">↗</span>
          </ExternalLink>
        ) : (
          <span className="text-purple-600 text-6xl">--</span>
        )}
        <div className="flex gap-2">Developing on the Olas Stack</div>
      </Card>
    </SectionWrapper>
  );
};
