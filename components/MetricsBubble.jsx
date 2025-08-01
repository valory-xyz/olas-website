import { Card } from 'components/ui/card';
import { ExternalLink } from 'components/ui/typography';
import Image from 'next/image';
import PropTypes from 'prop-types';

export const MetricsBubble = ({ metrics, image, title }) => {
  return (
    <Card className="p-8 border border-slate-200 rounded-full text-xl w-full rounded-2xl bg-gradient-to-b from-[rgba(244,247,251,0.2)] to-[#F4F7FB] items-center">
      {image && (
        <Image
          alt={title}
          src={image}
          width="48"
          height="48"
          className="mb-4"
        />
      )}

      <div className="text-lg font-medium mb-6">{title}</div>

      <div className="flex flex-col gap-8">
        {metrics.map((item) => {
          const value = !metrics || item.value === null ? '--' : item.value;
          const source =
            item.source && value !== '--' ? (
              <ExternalLink href={item.source} hideArrow>
                {value}
                <span className="text-2xl">↗</span>
              </ExternalLink>
            ) : (
              value
            );

          return (
            <div key={item.id} className="flex flex-col gap-3">
              <span className="block text-base text-slate-700">
                {item.subText}
              </span>
              <span className="block text-2xl font-semibold text-purple-600">
                {source}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

MetricsBubble.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      subText: PropTypes.string.isRequired,
      value: PropTypes.string,
      source: PropTypes.string.isRequired,
    }),
  ),
  image: PropTypes.string,
  title: PropTypes.string.isRequired,
};

MetricsBubble.defaultProps = {
  data: null,
  image: null,
};
