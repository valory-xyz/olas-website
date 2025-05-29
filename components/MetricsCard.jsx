import Image from 'next/image';
import PropTypes from 'prop-types';
import { Card } from './ui/card';
import { ExternalLink } from './ui/typography';

export const fetchMetrics = async (fetchFunctions) => {
  try {
    const results = await Promise.all(
      fetchFunctions.map((fetchFunction) => fetchFunction()),
    );
    return results || null;
  } catch (error) {
    console.error('Error fetching data: ', error);
    return null;
  }
};

export const MetricsCard = ({ metrics }) => {
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
              <Image
                alt={metric.role}
                src={`/images/${metrics.role}-page/${metric.imageSrc}`}
                width={metric.imageWidth ?? 35}
                height={35}
                className="mr-4"
              />
              {metric.labelText}
            </div>
            {metric.metric ? (
              <ExternalLink
                className="font-extrabold max-sm:text-4xl text-6xl"
                href={metric.source}
                target="_blank"
                hideArrow
              >
                {metric.isMoney && <span>$</span>}
                {metric.metric.toLocaleString()}
                <span className="text-4xl">↗</span>
              </ExternalLink>
            ) : (
              <span className="text-purple-600 text-6xl">--</span>
            )}
            {metric.subText && (
              <div className="flex gap-2">{metric.subText}</div>
            )}
          </div>
        );
      })}
    </Card>
  );
};

MetricsCard.propTypes = {
  metrics: PropTypes.shape({
    role: PropTypes.string.isRequired,
    displayMetrics: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        imageSrc: PropTypes.string.isRequired,
        labelText: PropTypes.string.isRequired,
        source: PropTypes.string.isRequired,
        metric: PropTypes.string,
        isMoney: PropTypes.bool,
        subText: PropTypes.string,
        imageWidth: PropTypes.number,
      }),
    ).isRequired,
  }).isRequired,
};
