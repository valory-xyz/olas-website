import Image from 'next/image';
import { Card } from './ui/card';
import { ExternalLink } from './ui/typography';

export const fetchMetrics = async (fetchDataFunction) => {
  try {
    const data = await fetchDataFunction();
    return data || null;
  } catch (error) {
    console.error('Error fetching data: ', error);
    return null;
  }
};

export const MetricsCard = ({ data }) => {
  return (
    <Card className="lg:flex lg:flex-row grid grid-cols-1 mx-auto border border-purple-200 rounded-full text-xl rounded-2xl bg-gradient-to-t from-[#F1DBFF] to-[#FDFAFF] items-center w-fit md:min-w-[440px]">
      {data.displayMetrics.map((metricData, index) => {
        const borderClassName =
          data.displayMetrics.length > 1 && index === 0
            ? 'max-lg:border-b-1.5 lg:border-r-1.5 border-purple-200'
            : undefined;

        return (
          <div
            key={metricData.key}
            className={`mx-auto p-8 pb-10 gap-6 flex flex-col items-center ${borderClassName}`}
          >
            <div className="flex items-center">
              <Image
                alt={metricData.role}
                src={`/images/${data.role}-page/${metricData.imageSrc}`}
                width={metricData.imageWidth ?? 35}
                height={35}
                className="mr-4"
              />
              {metricData.labelText}
            </div>
            {metricData.metric ? (
              <ExternalLink
                className="font-extrabold max-sm:text-4xl text-6xl"
                href={metricData.source}
                target="_blank"
                hideArrow
              >
                {metricData.isMoney && <span>$</span>}
                {Math.round(metricData.metric).toLocaleString()}
                <span className="text-4xl">↗</span>
              </ExternalLink>
            ) : (
              <span className="text-purple-600 text-6xl">--</span>
            )}
            {metricData.subText && (
              <div className="flex gap-2">{metricData.subText}</div>
            )}
          </div>
        );
      })}
    </Card>
  );
};
