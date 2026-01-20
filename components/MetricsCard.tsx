import Image from 'next/image';
import { StaleIndicator } from './ui/StaleIndicator';
import { Card } from './ui/card';
import { ExternalLink, Link } from './ui/typography';

export const fetchMetrics = async (fetchFunctions) => {
  try {
    const results = await Promise.all(fetchFunctions.map((fetchFunction) => fetchFunction()));
    return results || null;
  } catch (error) {
    console.error('Error fetching data: ', error);
    return null;
  }
};

type MetricsCardProps = {
  metrics: {
    role: string;
    displayMetrics: {
      key: string;
      imageSrc: string;
      labelText: string;
      source?: string;
      metric?: string | number;
      isMoney?: boolean;
      isExternal?: boolean;
      subText?: string;
      imageWidth?: number;
    }[];
  };
};

export const MetricsCard = ({ metrics }: MetricsCardProps) => {
  return (
    <Card className="lg:flex lg:flex-row grid grid-cols-1 mx-auto border border-purple-200 rounded-full text-xl rounded-2xl bg-gradient-to-t from-[#F1DBFF] to-[#FDFAFF] items-center w-fit md:min-w-[440px]">
      {metrics.displayMetrics.map((metric, index) => {
        const borderClassName =
          metrics.displayMetrics.length > 1 && index === 0
            ? 'max-lg:border-b-1.5 lg:border-r-1.5 border-purple-200'
            : undefined;

        return (
          <div
            key={metric.key}
            className={`mx-auto p-3 pb-5 md:p-8 md:pb-10 gap-6 flex flex-col items-center ${borderClassName}`}
          >
            <div className="flex items-center">
              {metric.imageSrc && (
                <Image
                  alt={metrics.role}
                  src={`/images/${metrics.role}-page/${metric.imageSrc}`}
                  width={metric.imageWidth ?? 35}
                  height={35}
                  className="mr-4"
                />
              )}
              {metric.labelText}
            </div>
            {renderMetricValue(metric)}
            {metric.subText && <div className="flex gap-2">{metric.subText}</div>}
          </div>
        );
      })}
    </Card>
  );
};

const renderMetricValue = (metric: {
  metric?: string | number;
  status?: {
    stale: boolean;
    lastValidAt: number | null;
    indexingErrors: string[];
    fetchErrors: string[];
  };
  isMoney?: boolean;
  source?: string;
  isExternal?: boolean;
}) => {
  const isStale = metric.status?.stale;
  const valueClassName = 'font-extrabold max-sm:text-4xl text-6xl';
  const staleIndicator = isStale ? (
    <span className="ml-2 inline-block align-middle">
      <StaleIndicator status={metric.status} />
    </span>
  ) : null;

  if (!metric.metric && metric.metric !== 0) {
    return <span className="text-purple-600 text-6xl">--</span>;
  }

  const formatted = Number(metric.metric).toLocaleString('en-US');
  const isExternal = metric.isExternal !== false;

  if (!metric.source) {
    return (
      <div className="flex items-center">
        <span className={valueClassName}>
          {metric.isMoney && <span>$</span>}
          {formatted}
        </span>
        {staleIndicator}
      </div>
    );
  }

  return (
    <div className="flex items-center">
      {isExternal ? (
        <ExternalLink className={valueClassName} href={metric.source} hideArrow>
          <div className={`flex items-center ${isStale ? 'text-gray-400' : ''}`}>
            {metric.isMoney && <span>$</span>}
            {formatted}
            <span className="text-4xl">↗</span>
          </div>
        </ExternalLink>
      ) : (
        <Link className={valueClassName} href={metric.source}>
          <span className={isStale ? 'text-gray-400' : ''}>
            {metric.isMoney && <span>$</span>}
            {formatted}
          </span>
        </Link>
      )}
      {staleIndicator}
    </div>
  );
};
